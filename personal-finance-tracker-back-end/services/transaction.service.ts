import { HTTP_STATUS } from "../constants/httpStatus";
import { ApiResponse } from "../utils/apiResponse";
import { TransactionRepository } from "../repositories/transaction.repository";
import { BudgetRepository } from "../repositories/budget.repository";
import { CategoryRepository } from "../repositories/category.repository";
import { ITransactionRequest } from "interfaces/transaction.interface";
import { RuleService } from "./rule.service";
import { TransactionType } from "@prisma/client";
import { parse } from "csv-parse/sync";

type CsvRow = Record<string, string | number | undefined>;

interface ImportFailure {
  rowNumber: number;
  reason: string;
}

interface ImportSummary {
  totalRows: number;
  created: number;
  matchedByRule: number;
  fallbackBanking: number;
  failed: ImportFailure[];
}

export class TransactionService {
  constructor(
    private transactionRepo = new TransactionRepository(),
    private budgetRepo = new BudgetRepository(),
    private ruleService = new RuleService(),
    private categoryRepo = new CategoryRepository()
  ) {}

  async importTransactionsFromCsv(accountId: string, fileBuffer: Buffer) {
    try {
      const bankingCategory = await this.categoryRepo.findCategoryByName("Banking");
      if (!bankingCategory) {
        return ApiResponse.error(
          'Fallback category "Banking" not found',
          HTTP_STATUS.BAD_REQUEST
        );
      }

      const csvText = fileBuffer.toString("utf-8");
      const rows = parse(csvText, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      }) as CsvRow[];

      const summary: ImportSummary = {
        totalRows: rows.length,
        created: 0,
        matchedByRule: 0,
        fallbackBanking: 0,
        failed: [],
      };

      for (let i = 0; i < rows.length; i += 1) {
        const row = rows[i];

        try {
          const description = this.getCsvValue(row, [
            "note",
            "description",
            "content",
            "memo",
          ]);
          const dateRaw = this.getCsvValue(row, ["date", "transactionDate"]);
          const amountRaw = this.getCsvValue(row, ["amount", "value"]);
          const typeRaw = this.getCsvValue(row, ["type"]);

          if (!dateRaw) {
            throw new Error("Missing date column");
          }

          if (!amountRaw) {
            throw new Error("Missing amount column");
          }

          const parsedDate = this.parseCsvDate(dateRaw);
          if (!parsedDate) {
            throw new Error(`Invalid date format: ${dateRaw}`);
          }

          const parsedAmount = this.parseCsvAmount(amountRaw);
          if (parsedAmount === null) {
            throw new Error(`Invalid amount format: ${amountRaw}`);
          }

          const type = this.resolveCsvType(typeRaw, parsedAmount);
          const finalAmount =
            type === "expense"
              ? -Math.abs(parsedAmount)
              : Math.abs(parsedAmount);

          const normalizedDescription = this.normalizeText(description || "");
          const resolvedCategoryId = await this.ruleService.resolveCategoryFromRules(
            accountId,
            normalizedDescription
          );

          const categoryId: string = resolvedCategoryId ?? bankingCategory.id;
          if (resolvedCategoryId) {
            summary.matchedByRule += 1;
          } else {
            summary.fallbackBanking += 1;
          }

          const createResponse = await this.createTransaction({
            accountId,
            categoryId,
            amount: finalAmount,
            type,
            date: parsedDate,
            description: description || "Imported from CSV",
          });

          if (!createResponse.isSuccess) {
            throw new Error(createResponse.message || "Failed to create transaction");
          }

          summary.created += 1;
        } catch (error) {
          summary.failed.push({
            rowNumber: i + 1,
            reason: error instanceof Error ? error.message : "Unknown error",
          });
        }
      }

      return ApiResponse.success(
        summary,
        "CSV import completed",
        HTTP_STATUS.OK
      );
    } catch (error) {
      console.error("Error in importTransactionsFromCsv method:", error);
      return ApiResponse.error(
        "Failed to import CSV transactions",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  async createTransaction(transactionData: ITransactionRequest) {
    try {
      if (!transactionData.categoryId) {
        const resolvedCategoryId = await this.ruleService.resolveCategoryFromRules(
          transactionData.accountId,
          transactionData.description
        );

        const fallbackCategoryId = resolvedCategoryId ?? undefined;
        if (!fallbackCategoryId) {
          return ApiResponse.error(
            "categoryId is required when no matching rule is found",
            HTTP_STATUS.BAD_REQUEST
          );
        }

        transactionData.categoryId = fallbackCategoryId;
      }

      const transaction = await this.transactionRepo.createTransaction(
        transactionData
      );
      if (!transaction) {
        return ApiResponse.error(
          "Failed to create transaction",
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
      }

      await this.budgetRepo.adjustBudgetAmount({
        accountId: transaction.accountId,
        categoryId: transaction.categoryId,
        amount: transaction.amount,
        type: transaction.type,
      });

      const budgetStatus = await this.getBudgetStatus(
        transaction.accountId.toString(),
        transaction.categoryId.toString()
      );

      return ApiResponse.success(
        { transaction, budgetStatus: budgetStatus || undefined },
        "Transaction created",
        HTTP_STATUS.CREATED
      );
    } catch (error) {
      console.error("Error in createTransaction method:", error);
      return ApiResponse.error(
        "Failed to create transaction",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateTransaction(
    accountId: string,
    id: string,
    updateData: Partial<ITransactionRequest>
  ) {
    try {
      const existing = await this.transactionRepo.findTransactionByIdAndAccountId(
        id,
        accountId
      );
      if (!existing) {
        return ApiResponse.error(
          "Transaction not found",
          HTTP_STATUS.NOT_FOUND
        );
      }

      await this.budgetRepo.adjustBudgetAmount({
        accountId: existing.accountId,
        categoryId: existing.categoryId,
        amount: -existing.amount,
        type: existing.type,
      });

      const updated = await this.transactionRepo.updateTransaction(
        id,
        accountId,
        updateData
      );
      if (!updated) {
        return ApiResponse.error(
          "Failed to update transaction",
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
      }

      await this.budgetRepo.adjustBudgetAmount({
        accountId: updated.accountId,
        categoryId: updated.categoryId,
        amount: updated.amount,
        type: updated.type,
      });

      const budgetStatus = await this.getBudgetStatus(
        updated.accountId.toString(),
        updated.categoryId.toString()
      );

      return ApiResponse.success(
        { transaction: updated, budgetStatus: budgetStatus || undefined },
        "Transaction updated successfully",
        HTTP_STATUS.OK
      );
    } catch (error) {
      console.error("Error in updateTransaction method:", error);
      return ApiResponse.error(
        "Failed to update transaction",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteTransaction(accountId: string, id: string) {
    try {
      const existing = await this.transactionRepo.findTransactionByIdAndAccountId(
        id,
        accountId
      );
      if (!existing) {
        return ApiResponse.error("Transaction not found", HTTP_STATUS.NOT_FOUND);
      }

      await this.budgetRepo.adjustBudgetAmount({
        accountId: existing.accountId,
        categoryId: existing.categoryId,
        amount: -existing.amount,
        type: existing.type,
      });

      const deleted = await this.transactionRepo.deleteTransaction(id, accountId);
      if (!deleted) {
        return ApiResponse.error(
          "Failed to delete transaction",
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
      }

      return ApiResponse.success(
        deleted,
        "Transaction deleted successfully",
        HTTP_STATUS.OK
      );
    } catch (error) {
      console.error("Error in deleteTransaction method:", error);
      return ApiResponse.error(
        "Failed to delete transaction",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  private async getBudgetStatus(accountId: string, categoryId: string) {
    const budget = await this.budgetRepo.findByAccountAndCategory(
      accountId,
      categoryId
    );

    if (!budget || budget.limitAmount === 0) return null;

    const updatedBudget = await this.budgetRepo.resetBudgetIfNeeded(budget);

    const spent = updatedBudget.amount;
    const limit = updatedBudget.limitAmount;
    const remaining = Math.max(0, limit - spent);
    const percentage = (spent / limit) * 100;
    const periodEnd = this.budgetRepo.getPeriodEndDate(
      updatedBudget.period,
      updatedBudget.periodStartDate
    );

    let status: "safe" | "warning" | "exceeded";
    let warning: string | null = null;

    if (percentage >= 100) {
      status = "exceeded";
      warning = `⚠️ Budget exceeded! You've spent ${spent.toLocaleString()} out of ${limit.toLocaleString()} (${percentage.toFixed(
        1
      )}%) for this ${updatedBudget.period}.`;
    } else if (percentage >= 80) {
      status = "warning";
      warning = `⚠️ Budget warning! You've spent ${spent.toLocaleString()} out of ${limit.toLocaleString()} (${percentage.toFixed(
        1
      )}%) for this ${
        updatedBudget.period
      }. ${remaining.toLocaleString()} remaining.`;
    } else {
      status = "safe";
    }

    return {
      warning,
      percentage: Math.round(percentage * 100) / 100,
      spent,
      limit,
      remaining,
      status,
      periodEnd,
    };
  }

  async getTransactionById(accountId: string, id: string) {
    try {
      const transaction = await this.transactionRepo.findTransactionByIdAndAccountId(
        id,
        accountId
      );
      if (!transaction) {
        return ApiResponse.error(
          "Transaction not found",
          HTTP_STATUS.NOT_FOUND
        );
      }
      return ApiResponse.success(
        transaction,
        "Transaction retrieved successfully",
        HTTP_STATUS.OK
      );
    } catch (error) {
      console.error("Error in getTransactionById method:", error);
      return ApiResponse.error(
        "Failed to retrieve transaction",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getTransactionsByAccountId(accountId: string) {
    try {
      const transactions =
        await this.transactionRepo.findTransactionsByAccountId(accountId);
      if (!transactions || transactions.length === 0) {
        return ApiResponse.error(
          "No transactions found for this account",
          HTTP_STATUS.NOT_FOUND
        );
      }
      return ApiResponse.success(
        transactions,
        "Transactions retrieved successfully",
        HTTP_STATUS.OK
      );
    } catch (error) {
      console.error("Error in getTransactionsByAccountId method:", error);
      return ApiResponse.error(
        "Failed to retrieve transactions",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  private getCsvValue(row: CsvRow, keys: string[]): string {
    for (const key of keys) {
      const value = row[key];
      if (value !== undefined && value !== null && String(value).trim() !== "") {
        return String(value).trim();
      }
    }
    return "";
  }

  private parseCsvAmount(value: string): number | null {
    const normalized = value.replace(/[^\d,.-]/g, "").replace(/,/g, "");
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  }

  private parseCsvDate(value: string): Date | null {
    const trimmed = value.trim();

    const direct = new Date(trimmed);
    if (!Number.isNaN(direct.getTime())) {
      return direct;
    }

    const slashParts = trimmed.split("/");
    if (slashParts.length === 3) {
      const [d, m, y] = slashParts;
      const constructed = new Date(`${y}-${m}-${d}`);
      if (!Number.isNaN(constructed.getTime())) {
        return constructed;
      }
    }

    const dashParts = trimmed.split("-");
    if (dashParts.length === 3 && dashParts[0].length <= 2) {
      const [d, m, y] = dashParts;
      const constructed = new Date(`${y}-${m}-${d}`);
      if (!Number.isNaN(constructed.getTime())) {
        return constructed;
      }
    }

    return null;
  }

  private resolveCsvType(rawType: string, amount: number): TransactionType {
    const normalizedType = rawType.toLowerCase();
    if (normalizedType === "income") {
      return "income";
    }
    if (normalizedType === "expense") {
      return "expense";
    }
    return amount < 0 ? "expense" : "income";
  }

  private normalizeText(value: string): string {
    return value.toLowerCase().trim().replace(/\s+/g, " ");
  }
}

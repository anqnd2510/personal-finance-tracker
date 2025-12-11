import { HTTP_STATUS } from "../constants/httpStatus";
import { ApiResponse } from "../utils/apiResponse";
import { TransactionRepository } from "../repositories/transaction.repository";
import { BudgetRepository } from "../repositories/budget.repository";
import { ITransactionRequest } from "interfaces/transaction.interface";

export class TransactionService {
  constructor(
    private transactionRepo = new TransactionRepository(),
    private budgetRepo = new BudgetRepository()
  ) {}

  async createTransaction(transactionData: ITransactionRequest) {
    try {
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
    id: string,
    updateData: Partial<ITransactionRequest>
  ) {
    try {
      const existing = await this.transactionRepo.findTransactionById(id);
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

  async getTransactionById(id: string) {
    try {
      const transaction = await this.transactionRepo.findTransactionById(id);
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
}

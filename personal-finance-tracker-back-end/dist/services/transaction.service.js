"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const httpStatus_1 = require("../constants/httpStatus");
const apiResponse_1 = require("../utils/apiResponse");
const transaction_repository_1 = require("../repositories/transaction.repository");
const budget_repository_1 = require("../repositories/budget.repository");
const category_repository_1 = require("../repositories/category.repository");
const rule_service_1 = require("./rule.service");
const sync_1 = require("csv-parse/sync");
class TransactionService {
    constructor(transactionRepo = new transaction_repository_1.TransactionRepository(), budgetRepo = new budget_repository_1.BudgetRepository(), ruleService = new rule_service_1.RuleService(), categoryRepo = new category_repository_1.CategoryRepository()) {
        this.transactionRepo = transactionRepo;
        this.budgetRepo = budgetRepo;
        this.ruleService = ruleService;
        this.categoryRepo = categoryRepo;
    }
    async importTransactionsFromCsv(accountId, fileBuffer) {
        try {
            const bankingCategory = await this.categoryRepo.findCategoryByName("Banking");
            if (!bankingCategory) {
                return apiResponse_1.ApiResponse.error('Fallback category "Banking" not found', httpStatus_1.HTTP_STATUS.BAD_REQUEST);
            }
            const csvText = fileBuffer.toString("utf-8");
            const rows = (0, sync_1.parse)(csvText, {
                columns: true,
                skip_empty_lines: true,
                trim: true,
            });
            const summary = {
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
                    const finalAmount = type === "expense"
                        ? -Math.abs(parsedAmount)
                        : Math.abs(parsedAmount);
                    const normalizedDescription = this.normalizeText(description || "");
                    const resolvedCategoryId = await this.ruleService.resolveCategoryFromRules(accountId, normalizedDescription);
                    const categoryId = resolvedCategoryId ?? bankingCategory.id;
                    if (resolvedCategoryId) {
                        summary.matchedByRule += 1;
                    }
                    else {
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
                }
                catch (error) {
                    summary.failed.push({
                        rowNumber: i + 1,
                        reason: error instanceof Error ? error.message : "Unknown error",
                    });
                }
            }
            return apiResponse_1.ApiResponse.success(summary, "CSV import completed", httpStatus_1.HTTP_STATUS.OK);
        }
        catch (error) {
            console.error("Error in importTransactionsFromCsv method:", error);
            return apiResponse_1.ApiResponse.error("Failed to import CSV transactions", httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }
    async createTransaction(transactionData) {
        try {
            if (!transactionData.categoryId) {
                const resolvedCategoryId = await this.ruleService.resolveCategoryFromRules(transactionData.accountId, transactionData.description);
                const fallbackCategoryId = resolvedCategoryId ?? undefined;
                if (!fallbackCategoryId) {
                    return apiResponse_1.ApiResponse.error("categoryId is required when no matching rule is found", httpStatus_1.HTTP_STATUS.BAD_REQUEST);
                }
                transactionData.categoryId = fallbackCategoryId;
            }
            const transaction = await this.transactionRepo.createTransaction(transactionData);
            if (!transaction) {
                return apiResponse_1.ApiResponse.error("Failed to create transaction", httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR);
            }
            await this.budgetRepo.adjustBudgetAmount({
                accountId: transaction.accountId,
                categoryId: transaction.categoryId,
                amount: transaction.amount,
                type: transaction.type,
            });
            const budgetStatus = await this.getBudgetStatus(transaction.accountId.toString(), transaction.categoryId.toString());
            return apiResponse_1.ApiResponse.success({ transaction, budgetStatus: budgetStatus || undefined }, "Transaction created", httpStatus_1.HTTP_STATUS.CREATED);
        }
        catch (error) {
            console.error("Error in createTransaction method:", error);
            return apiResponse_1.ApiResponse.error("Failed to create transaction", httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }
    async updateTransaction(accountId, id, updateData) {
        try {
            const existing = await this.transactionRepo.findTransactionByIdAndAccountId(id, accountId);
            if (!existing) {
                return apiResponse_1.ApiResponse.error("Transaction not found", httpStatus_1.HTTP_STATUS.NOT_FOUND);
            }
            await this.budgetRepo.adjustBudgetAmount({
                accountId: existing.accountId,
                categoryId: existing.categoryId,
                amount: -existing.amount,
                type: existing.type,
            });
            const updated = await this.transactionRepo.updateTransaction(id, accountId, updateData);
            if (!updated) {
                return apiResponse_1.ApiResponse.error("Failed to update transaction", httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR);
            }
            await this.budgetRepo.adjustBudgetAmount({
                accountId: updated.accountId,
                categoryId: updated.categoryId,
                amount: updated.amount,
                type: updated.type,
            });
            const budgetStatus = await this.getBudgetStatus(updated.accountId.toString(), updated.categoryId.toString());
            return apiResponse_1.ApiResponse.success({ transaction: updated, budgetStatus: budgetStatus || undefined }, "Transaction updated successfully", httpStatus_1.HTTP_STATUS.OK);
        }
        catch (error) {
            console.error("Error in updateTransaction method:", error);
            return apiResponse_1.ApiResponse.error("Failed to update transaction", httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteTransaction(accountId, id) {
        try {
            const existing = await this.transactionRepo.findTransactionByIdAndAccountId(id, accountId);
            if (!existing) {
                return apiResponse_1.ApiResponse.error("Transaction not found", httpStatus_1.HTTP_STATUS.NOT_FOUND);
            }
            await this.budgetRepo.adjustBudgetAmount({
                accountId: existing.accountId,
                categoryId: existing.categoryId,
                amount: -existing.amount,
                type: existing.type,
            });
            const deleted = await this.transactionRepo.deleteTransaction(id, accountId);
            if (!deleted) {
                return apiResponse_1.ApiResponse.error("Failed to delete transaction", httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR);
            }
            return apiResponse_1.ApiResponse.success(deleted, "Transaction deleted successfully", httpStatus_1.HTTP_STATUS.OK);
        }
        catch (error) {
            console.error("Error in deleteTransaction method:", error);
            return apiResponse_1.ApiResponse.error("Failed to delete transaction", httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }
    async getBudgetStatus(accountId, categoryId) {
        const budget = await this.budgetRepo.findByAccountAndCategory(accountId, categoryId);
        if (!budget || budget.limitAmount === 0)
            return null;
        const updatedBudget = await this.budgetRepo.resetBudgetIfNeeded(budget);
        const spent = updatedBudget.amount;
        const limit = updatedBudget.limitAmount;
        const remaining = Math.max(0, limit - spent);
        const percentage = (spent / limit) * 100;
        const periodEnd = this.budgetRepo.getPeriodEndDate(updatedBudget.period, updatedBudget.periodStartDate);
        let status;
        let warning = null;
        if (percentage >= 100) {
            status = "exceeded";
            warning = `⚠️ Budget exceeded! You've spent ${spent.toLocaleString()} out of ${limit.toLocaleString()} (${percentage.toFixed(1)}%) for this ${updatedBudget.period}.`;
        }
        else if (percentage >= 80) {
            status = "warning";
            warning = `⚠️ Budget warning! You've spent ${spent.toLocaleString()} out of ${limit.toLocaleString()} (${percentage.toFixed(1)}%) for this ${updatedBudget.period}. ${remaining.toLocaleString()} remaining.`;
        }
        else {
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
    async getTransactionById(accountId, id) {
        try {
            const transaction = await this.transactionRepo.findTransactionByIdAndAccountId(id, accountId);
            if (!transaction) {
                return apiResponse_1.ApiResponse.error("Transaction not found", httpStatus_1.HTTP_STATUS.NOT_FOUND);
            }
            return apiResponse_1.ApiResponse.success(transaction, "Transaction retrieved successfully", httpStatus_1.HTTP_STATUS.OK);
        }
        catch (error) {
            console.error("Error in getTransactionById method:", error);
            return apiResponse_1.ApiResponse.error("Failed to retrieve transaction", httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }
    async getTransactionsByAccountId(accountId) {
        try {
            const transactions = await this.transactionRepo.findTransactionsByAccountId(accountId);
            if (!transactions || transactions.length === 0) {
                return apiResponse_1.ApiResponse.error("No transactions found for this account", httpStatus_1.HTTP_STATUS.NOT_FOUND);
            }
            return apiResponse_1.ApiResponse.success(transactions, "Transactions retrieved successfully", httpStatus_1.HTTP_STATUS.OK);
        }
        catch (error) {
            console.error("Error in getTransactionsByAccountId method:", error);
            return apiResponse_1.ApiResponse.error("Failed to retrieve transactions", httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }
    getCsvValue(row, keys) {
        for (const key of keys) {
            const value = row[key];
            if (value !== undefined && value !== null && String(value).trim() !== "") {
                return String(value).trim();
            }
        }
        return "";
    }
    parseCsvAmount(value) {
        const normalized = value.replace(/[^\d,.-]/g, "").replace(/,/g, "");
        const parsed = Number(normalized);
        return Number.isFinite(parsed) ? parsed : null;
    }
    parseCsvDate(value) {
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
    resolveCsvType(rawType, amount) {
        const normalizedType = rawType.toLowerCase();
        if (normalizedType === "income") {
            return "income";
        }
        if (normalizedType === "expense") {
            return "expense";
        }
        return amount < 0 ? "expense" : "income";
    }
    normalizeText(value) {
        return value.toLowerCase().trim().replace(/\s+/g, " ");
    }
}
exports.TransactionService = TransactionService;
//# sourceMappingURL=transaction.service.js.map
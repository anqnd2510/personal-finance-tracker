"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const httpStatus_1 = require("../constants/httpStatus");
const apiResponse_1 = require("../utils/apiResponse");
const transaction_repository_1 = require("../repositories/transaction.repository");
const budget_repository_1 = require("../repositories/budget.repository");
class TransactionService {
    constructor(transactionRepo = new transaction_repository_1.TransactionRepository(), budgetRepo = new budget_repository_1.BudgetRepository()) {
        this.transactionRepo = transactionRepo;
        this.budgetRepo = budgetRepo;
    }
    async createTransaction(transactionData) {
        try {
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
    async updateTransaction(id, updateData) {
        try {
            const existing = await this.transactionRepo.findTransactionById(id);
            if (!existing) {
                return apiResponse_1.ApiResponse.error("Transaction not found", httpStatus_1.HTTP_STATUS.NOT_FOUND);
            }
            await this.budgetRepo.adjustBudgetAmount({
                accountId: existing.accountId,
                categoryId: existing.categoryId,
                amount: -existing.amount,
                type: existing.type,
            });
            const updated = await this.transactionRepo.updateTransaction(id, updateData);
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
    async getTransactionById(id) {
        try {
            const transaction = await this.transactionRepo.findTransactionById(id);
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
}
exports.TransactionService = TransactionService;
//# sourceMappingURL=transaction.service.js.map
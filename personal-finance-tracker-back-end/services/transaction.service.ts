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

  /**
   * Creates a new transaction.
   * @param {ITransactionRequest} transactionData - The data for the transaction.
   * @returns {Promise<ApiResponse>} - A promise that resolves to an ApiResponse object.
   * @throws {Error} - Throws an error if the transaction creation fails.
   */
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
      // Adjust the budget amount if the transaction is related to a budget
      await this.budgetRepo.adjustBudgetAmount({
        accountId: transaction.accountId,
        categoryId: transaction.categoryId,
        date: transaction.date,
        amount: transaction.amount,
        type: transaction.type,
      });
      return ApiResponse.success(
        transaction,
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
  /**
   * Retrieves a transaction by its ID.
   * @param {string} id - The ID of the transaction.
   * @returns {Promise<ApiResponse>} - A promise that resolves to an ApiResponse object.
   */
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
  /**
   * Retrieves all transactions for a specific account.
   * @param {string} accountId - The ID of the account.
   * @returns {Promise<ApiResponse>} - A promise that resolves to an ApiResponse object.
   */
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
  /**
   * Updates a transaction by its ID.
   * @param {string} id - The ID of the transaction.
   * @param {Partial<ITransactionRequest>} updateData - The data to update the transaction with.
   * @returns {Promise<ApiResponse>} - A promise that resolves to an ApiResponse object.
   */
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

      // Rollback old transaction from budget
      await this.budgetRepo.adjustBudgetAmount({
        accountId: existing.accountId,
        categoryId: existing.categoryId,
        date: existing.date,
        amount: -existing.amount, // Reverse
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

      // Apply new transaction effect to budget
      await this.budgetRepo.adjustBudgetAmount({
        accountId: updated.accountId,
        categoryId: updated.categoryId,
        date: updated.date,
        amount: updated.amount,
        type: updated.type,
      });

      return ApiResponse.success(
        updated,
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
}

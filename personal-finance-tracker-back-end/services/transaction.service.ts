import { HTTP_STATUS } from "../constants/httpStatus";
import { ApiResponse } from "../utils/apiResponse";
import { TransactionRepository } from "../repositories/transaction.repository";
import { ITransactionRequest } from "interfaces/transaction.interface";

export class TransactionService {
  constructor(private transactionRepo = new TransactionRepository()) {}

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
}

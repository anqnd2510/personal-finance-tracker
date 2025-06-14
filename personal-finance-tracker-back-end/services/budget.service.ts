import { HTTP_STATUS } from "../constants/httpStatus";
import { ApiResponse } from "../utils/apiResponse";
import { BudgetRepository } from "../repositories/budget.repository";
import { IBudgetRequest } from "../interfaces/budget.interface";

export class BudgetService {
  constructor(private budgetRepo = new BudgetRepository()) {}

  /**
   * Creates a new budget.
   * @param {IBudgetRequest} budgetData - The data for the budget.
   * @returns {Promise<ApiResponse>} - A promise that resolves to an ApiResponse object.
   * @throws {Error} - Throws an error if the budget creation fails.
   */
  async createBudget(budgetData: IBudgetRequest) {
    try {
      const budget = await this.budgetRepo.createBudget(budgetData);
      if (!budget) {
        return ApiResponse.error(
          "Failed to create budget",
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
      }
      return ApiResponse.success(
        budget,
        "Budget created successfully",
        HTTP_STATUS.CREATED
      );
    } catch (error) {
      console.error("Error in createBudget method:", error);
      return ApiResponse.error(
        "Failed to create budget",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }
  /**
   * Retrieves a budget by its ID.
   * @param {string} id - The ID of the budget.
   * @returns {Promise<ApiResponse>} - A promise that resolves to an ApiResponse object.
   */
  async getBudgetById(id: string) {
    try {
      const budget = await this.budgetRepo.findBudgetById(id);
      if (!budget) {
        return ApiResponse.error("Budget not found", HTTP_STATUS.NOT_FOUND);
      }
      return ApiResponse.success(
        budget,
        "Budget retrieved successfully",
        HTTP_STATUS.OK
      );
    } catch (error) {
      console.error("Error in getBudgetById method:", error);
      return ApiResponse.error(
        "Failed to retrieve budget",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }
  /**
   * Retrieves all budgets for a specific account.
   * @param {string} accountId - The ID of the account.
   * @returns {Promise<ApiResponse>} - A promise that resolves to an ApiResponse object.
   */
  async getBudgetsByAccountId(accountId: string) {
    try {
      const budgets = await this.budgetRepo.findBudgetsByAccountId(accountId);
      if (!budgets || budgets.length === 0) {
        return ApiResponse.error("No budgets found", HTTP_STATUS.NOT_FOUND);
      }
      return ApiResponse.success(
        budgets,
        "Budgets retrieved successfully",
        HTTP_STATUS.OK
      );
    } catch (error) {
      console.error("Error in getBudgetsByAccountId method:", error);
      return ApiResponse.error(
        "Failed to retrieve budgets",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }
  /**
   * Updates a budget by its ID.
   * @param {string} id - The ID of the budget.
   * @param {Partial<IBudgetRequest>} updateData - The data to update the budget with.
   * @returns {Promise<ApiResponse>} - A promise that resolves to an ApiResponse object.
   */
  async updateBudget(id: string, updateData: Partial<IBudgetRequest>) {
    try {
      const updatedBudget = await this.budgetRepo.updateBudget(id, updateData);
      if (!updatedBudget) {
        return ApiResponse.error("Budget not found", HTTP_STATUS.NOT_FOUND);
      }
      return ApiResponse.success(
        updatedBudget,
        "Budget updated successfully",
        HTTP_STATUS.OK
      );
    } catch (error) {
      console.error("Error in updateBudget method:", error);
      return ApiResponse.error(
        "Failed to update budget",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }
  /**
   * Deletes a budget by its ID.
   * @param {string} id - The ID of the budget.
   * @returns {Promise<ApiResponse>} - A promise that resolves to an ApiResponse object.
   */
  async deleteBudget(id: string) {
    try {
      const deletedBudget = await this.budgetRepo.deleteBudget(id);
      if (!deletedBudget) {
        return ApiResponse.error("Budget not found", HTTP_STATUS.NOT_FOUND);
      }
      return ApiResponse.success(
        deletedBudget,
        "Budget deleted successfully",
        HTTP_STATUS.OK
      );
    } catch (error) {
      console.error("Error in deleteBudget method:", error);
      return ApiResponse.error(
        "Failed to delete budget",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }
}

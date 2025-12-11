"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetService = void 0;
const httpStatus_1 = require("../constants/httpStatus");
const apiResponse_1 = require("../utils/apiResponse");
const budget_repository_1 = require("../repositories/budget.repository");
class BudgetService {
    constructor(budgetRepo = new budget_repository_1.BudgetRepository()) {
        this.budgetRepo = budgetRepo;
    }
    async createBudget(budgetData) {
        try {
            const budget = await this.budgetRepo.createBudget(budgetData);
            if (!budget) {
                return apiResponse_1.ApiResponse.error("Failed to create budget", httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR);
            }
            return apiResponse_1.ApiResponse.success(budget, "Budget created successfully", httpStatus_1.HTTP_STATUS.CREATED);
        }
        catch (error) {
            console.error("Error in createBudget method:", error);
            return apiResponse_1.ApiResponse.error("Failed to create budget", httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }
    async getBudgetById(id) {
        try {
            const budget = await this.budgetRepo.findBudgetById(id);
            if (!budget) {
                return apiResponse_1.ApiResponse.error("Budget not found", httpStatus_1.HTTP_STATUS.NOT_FOUND);
            }
            return apiResponse_1.ApiResponse.success(budget, "Budget retrieved successfully", httpStatus_1.HTTP_STATUS.OK);
        }
        catch (error) {
            console.error("Error in getBudgetById method:", error);
            return apiResponse_1.ApiResponse.error("Failed to retrieve budget", httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }
    async getBudgetsByAccountId(accountId) {
        try {
            const budgets = await this.budgetRepo.findBudgetsByAccountId(accountId);
            if (!budgets || budgets.length === 0) {
                return apiResponse_1.ApiResponse.error("No budgets found", httpStatus_1.HTTP_STATUS.NOT_FOUND);
            }
            return apiResponse_1.ApiResponse.success(budgets, "Budgets retrieved successfully", httpStatus_1.HTTP_STATUS.OK);
        }
        catch (error) {
            console.error("Error in getBudgetsByAccountId method:", error);
            return apiResponse_1.ApiResponse.error("Failed to retrieve budgets", httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }
    async updateBudget(id, updateData) {
        try {
            const updatedBudget = await this.budgetRepo.updateBudget(id, updateData);
            if (!updatedBudget) {
                return apiResponse_1.ApiResponse.error("Budget not found", httpStatus_1.HTTP_STATUS.NOT_FOUND);
            }
            return apiResponse_1.ApiResponse.success(updatedBudget, "Budget updated successfully", httpStatus_1.HTTP_STATUS.OK);
        }
        catch (error) {
            console.error("Error in updateBudget method:", error);
            return apiResponse_1.ApiResponse.error("Failed to update budget", httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteBudget(id) {
        try {
            const deletedBudget = await this.budgetRepo.deleteBudget(id);
            if (!deletedBudget) {
                return apiResponse_1.ApiResponse.error("Budget not found", httpStatus_1.HTTP_STATUS.NOT_FOUND);
            }
            return apiResponse_1.ApiResponse.success(deletedBudget, "Budget deleted successfully", httpStatus_1.HTTP_STATUS.OK);
        }
        catch (error) {
            console.error("Error in deleteBudget method:", error);
            return apiResponse_1.ApiResponse.error("Failed to delete budget", httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }
}
exports.BudgetService = BudgetService;
//# sourceMappingURL=budget.service.js.map
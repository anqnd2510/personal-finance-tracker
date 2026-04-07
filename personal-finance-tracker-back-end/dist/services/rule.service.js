"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuleService = void 0;
const httpStatus_1 = require("../constants/httpStatus");
const apiResponse_1 = require("../utils/apiResponse");
const rule_repository_1 = require("../repositories/rule.repository");
const category_repository_1 = require("../repositories/category.repository");
class RuleService {
    constructor(ruleRepo = new rule_repository_1.RuleRepository(), categoryRepo = new category_repository_1.CategoryRepository()) {
        this.ruleRepo = ruleRepo;
        this.categoryRepo = categoryRepo;
    }
    async createRule(ruleData) {
        try {
            const category = await this.categoryRepo.findCategoryById(ruleData.categoryId);
            if (!category) {
                return apiResponse_1.ApiResponse.error("Category not found", httpStatus_1.HTTP_STATUS.NOT_FOUND);
            }
            const rule = await this.ruleRepo.createRule(ruleData);
            return apiResponse_1.ApiResponse.success(rule, "Rule created successfully", httpStatus_1.HTTP_STATUS.CREATED);
        }
        catch (error) {
            console.error("Error in createRule method:", error);
            return apiResponse_1.ApiResponse.error("Failed to create rule", httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }
    async getRulesByAccountId(accountId) {
        try {
            const rules = await this.ruleRepo.findRulesByAccountId(accountId);
            return apiResponse_1.ApiResponse.success(rules, "Rules retrieved successfully", httpStatus_1.HTTP_STATUS.OK);
        }
        catch (error) {
            console.error("Error in getRulesByAccountId method:", error);
            return apiResponse_1.ApiResponse.error("Failed to retrieve rules", httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }
    async updateRule(accountId, id, updateData) {
        try {
            if (updateData.categoryId) {
                const category = await this.categoryRepo.findCategoryById(updateData.categoryId);
                if (!category) {
                    return apiResponse_1.ApiResponse.error("Category not found", httpStatus_1.HTTP_STATUS.NOT_FOUND);
                }
            }
            const updated = await this.ruleRepo.updateRule(id, accountId, updateData);
            if (!updated) {
                return apiResponse_1.ApiResponse.error("Rule not found", httpStatus_1.HTTP_STATUS.NOT_FOUND);
            }
            return apiResponse_1.ApiResponse.success(updated, "Rule updated successfully", httpStatus_1.HTTP_STATUS.OK);
        }
        catch (error) {
            console.error("Error in updateRule method:", error);
            return apiResponse_1.ApiResponse.error("Failed to update rule", httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteRule(accountId, id) {
        try {
            const deleted = await this.ruleRepo.deleteRule(id, accountId);
            if (!deleted) {
                return apiResponse_1.ApiResponse.error("Rule not found", httpStatus_1.HTTP_STATUS.NOT_FOUND);
            }
            return apiResponse_1.ApiResponse.success(deleted, "Rule deleted successfully", httpStatus_1.HTTP_STATUS.OK);
        }
        catch (error) {
            console.error("Error in deleteRule method:", error);
            return apiResponse_1.ApiResponse.error("Failed to delete rule", httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }
    async resolveCategoryFromRules(accountId, description) {
        if (!description) {
            return null;
        }
        const matched = await this.ruleRepo.findBestMatchingRule(accountId, description);
        return matched?.categoryId || null;
    }
}
exports.RuleService = RuleService;
//# sourceMappingURL=rule.service.js.map
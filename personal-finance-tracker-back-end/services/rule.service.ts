import { HTTP_STATUS } from "../constants/httpStatus";
import { ApiResponse } from "../utils/apiResponse";
import { RuleRepository } from "../repositories/rule.repository";
import { CategoryRepository } from "../repositories/category.repository";
import { IRuleRequest, IRuleUpdateRequest } from "../interfaces/rule.interface";

export class RuleService {
  constructor(
    private ruleRepo = new RuleRepository(),
    private categoryRepo = new CategoryRepository()
  ) {}

  async createRule(ruleData: IRuleRequest) {
    try {
      const category = await this.categoryRepo.findCategoryById(ruleData.categoryId);
      if (!category) {
        return ApiResponse.error("Category not found", HTTP_STATUS.NOT_FOUND);
      }

      const rule = await this.ruleRepo.createRule(ruleData);

      return ApiResponse.success(rule, "Rule created successfully", HTTP_STATUS.CREATED);
    } catch (error) {
      console.error("Error in createRule method:", error);
      return ApiResponse.error("Failed to create rule", HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  async getRulesByAccountId(accountId: string) {
    try {
      const rules = await this.ruleRepo.findRulesByAccountId(accountId);
      return ApiResponse.success(rules, "Rules retrieved successfully", HTTP_STATUS.OK);
    } catch (error) {
      console.error("Error in getRulesByAccountId method:", error);
      return ApiResponse.error("Failed to retrieve rules", HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  async updateRule(accountId: string, id: string, updateData: IRuleUpdateRequest) {
    try {
      if (updateData.categoryId) {
        const category = await this.categoryRepo.findCategoryById(updateData.categoryId);
        if (!category) {
          return ApiResponse.error("Category not found", HTTP_STATUS.NOT_FOUND);
        }
      }

      const updated = await this.ruleRepo.updateRule(id, accountId, updateData);
      if (!updated) {
        return ApiResponse.error("Rule not found", HTTP_STATUS.NOT_FOUND);
      }

      return ApiResponse.success(updated, "Rule updated successfully", HTTP_STATUS.OK);
    } catch (error) {
      console.error("Error in updateRule method:", error);
      return ApiResponse.error("Failed to update rule", HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteRule(accountId: string, id: string) {
    try {
      const deleted = await this.ruleRepo.deleteRule(id, accountId);
      if (!deleted) {
        return ApiResponse.error("Rule not found", HTTP_STATUS.NOT_FOUND);
      }

      return ApiResponse.success(deleted, "Rule deleted successfully", HTTP_STATUS.OK);
    } catch (error) {
      console.error("Error in deleteRule method:", error);
      return ApiResponse.error("Failed to delete rule", HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  async resolveCategoryFromRules(accountId: string, description?: string): Promise<string | null> {
    if (!description) {
      return null;
    }

    const matched = await this.ruleRepo.findBestMatchingRule(accountId, description);
    return matched?.categoryId || null;
  }
}

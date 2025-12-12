import { Request, Response } from "express";
import { RuleEngine } from "../rules/engine";
import { ApiResponse } from "../utils/apiResponse";
import { HTTP_STATUS } from "../constants/httpStatus";

export class RuleController {
  /**
   * Get all insights and alerts for the authenticated user
   * @route GET /api/insights
   */
  async getInsights(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.account?.accountId;

      if (!userId) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json(
          ApiResponse.error("Unauthorized", HTTP_STATUS.UNAUTHORIZED)
        );
        return;
      }

      const results = await RuleEngine.runAll(userId);

      res.status(HTTP_STATUS.OK).json(
        ApiResponse.success(
          {
            insights: results,
            count: results.length
          },
          "Insights retrieved successfully"
        )
      );
    } catch (error: any) {
      console.error("Get insights error:", error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
        ApiResponse.error(
          error.message || "Failed to get insights",
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        )
      );
    }
  }

  /**
   * Get available rules
   * @route GET /api/insights/rules
   */
  async getRules(req: Request, res: Response): Promise<void> {
    try {
      const rules = RuleEngine.getRules();

      res.status(HTTP_STATUS.OK).json(
        ApiResponse.success({ rules }, "Rules retrieved successfully")
      );
    } catch (error: any) {
      console.error("Get rules error:", error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
        ApiResponse.error(
          error.message || "Failed to get rules",
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        )
      );
    }
  }

  /**
   * Run a specific rule
   * @route GET /api/insights/rules/:ruleName
   */
  async runSpecificRule(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.account?.accountId;
      const { ruleName } = req.params;

      if (!userId) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json(
          ApiResponse.error("Unauthorized", HTTP_STATUS.UNAUTHORIZED)
        );
        return;
      }

      const results = await RuleEngine.runRule(ruleName, userId);

      res.status(HTTP_STATUS.OK).json(
        ApiResponse.success(
          {
            rule: ruleName,
            insights: results,
            count: results.length
          },
          `Rule "${ruleName}" executed successfully`
        )
      );
    } catch (error: any) {
      console.error("Run rule error:", error);
      
      if (error.message.includes("not found")) {
        res.status(HTTP_STATUS.NOT_FOUND).json(
          ApiResponse.error(error.message, HTTP_STATUS.NOT_FOUND)
        );
      } else {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
          ApiResponse.error(
            error.message || "Failed to run rule",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        )
    );
      }
    }
  }
}
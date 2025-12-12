"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuleController = void 0;
const engine_1 = require("../rules/engine");
const apiResponse_1 = require("../utils/apiResponse");
const httpStatus_1 = require("../constants/httpStatus");
class RuleController {
    async getInsights(req, res) {
        try {
            const userId = req.account?.accountId;
            if (!userId) {
                res.status(httpStatus_1.HTTP_STATUS.UNAUTHORIZED).json(apiResponse_1.ApiResponse.error("Unauthorized", httpStatus_1.HTTP_STATUS.UNAUTHORIZED));
                return;
            }
            const results = await engine_1.RuleEngine.runAll(userId);
            res.status(httpStatus_1.HTTP_STATUS.OK).json(apiResponse_1.ApiResponse.success({
                insights: results,
                count: results.length
            }, "Insights retrieved successfully"));
        }
        catch (error) {
            console.error("Get insights error:", error);
            res.status(httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json(apiResponse_1.ApiResponse.error(error.message || "Failed to get insights", httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR));
        }
    }
    async getRules(req, res) {
        try {
            const rules = engine_1.RuleEngine.getRules();
            res.status(httpStatus_1.HTTP_STATUS.OK).json(apiResponse_1.ApiResponse.success({ rules }, "Rules retrieved successfully"));
        }
        catch (error) {
            console.error("Get rules error:", error);
            res.status(httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json(apiResponse_1.ApiResponse.error(error.message || "Failed to get rules", httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR));
        }
    }
    async runSpecificRule(req, res) {
        try {
            const userId = req.account?.accountId;
            const { ruleName } = req.params;
            if (!userId) {
                res.status(httpStatus_1.HTTP_STATUS.UNAUTHORIZED).json(apiResponse_1.ApiResponse.error("Unauthorized", httpStatus_1.HTTP_STATUS.UNAUTHORIZED));
                return;
            }
            const results = await engine_1.RuleEngine.runRule(ruleName, userId);
            res.status(httpStatus_1.HTTP_STATUS.OK).json(apiResponse_1.ApiResponse.success({
                rule: ruleName,
                insights: results,
                count: results.length
            }, `Rule "${ruleName}" executed successfully`));
        }
        catch (error) {
            console.error("Run rule error:", error);
            if (error.message.includes("not found")) {
                res.status(httpStatus_1.HTTP_STATUS.NOT_FOUND).json(apiResponse_1.ApiResponse.error(error.message, httpStatus_1.HTTP_STATUS.NOT_FOUND));
            }
            else {
                res.status(httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json(apiResponse_1.ApiResponse.error(error.message || "Failed to run rule", httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR));
            }
        }
    }
}
exports.RuleController = RuleController;
//# sourceMappingURL=insight.controller.js.map
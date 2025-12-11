"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatWithAI = void 0;
const ai_service_1 = require("../services/ai.service");
const apiResponse_1 = require("../utils/apiResponse");
const httpStatus_1 = require("../constants/httpStatus");
const chatWithAI = async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt || typeof prompt !== "string") {
            res
                .status(httpStatus_1.HTTP_STATUS.BAD_REQUEST)
                .json(apiResponse_1.ApiResponse.error("Invalid prompt", httpStatus_1.HTTP_STATUS.BAD_REQUEST));
        }
        const aiService = new ai_service_1.AIService();
        const response = await aiService.generateResponse(prompt);
        if (!response) {
            res
                .status(httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .json(apiResponse_1.ApiResponse.error("Failed to generate AI response"));
        }
        res.status(httpStatus_1.HTTP_STATUS.OK).json(apiResponse_1.ApiResponse.success(response));
    }
    catch (error) {
        console.error("❌ Controller error:", {
            message: error?.message,
            stack: error?.stack,
            userId: req.account?.accountId || "unknown",
            requestBody: req.body,
        });
        let errorMessage = "Internal server error";
        let statusCode = httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR;
        res.status(statusCode).json(apiResponse_1.ApiResponse.error(errorMessage, statusCode));
    }
};
exports.chatWithAI = chatWithAI;
//# sourceMappingURL=ai.controller.js.map
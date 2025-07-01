import { Request, Response } from "express";
import { AIService } from "../services/ai.service";
import { ApiResponse } from "../utils/apiResponse";
import { HTTP_STATUS } from "../constants/httpStatus";

export const chatWithAI = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { prompt } = req.body;

    // Validate input
    if (!prompt || typeof prompt !== "string") {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(ApiResponse.error("Invalid prompt", HTTP_STATUS.BAD_REQUEST));
    }

    // Call AI service to generate response
    const aiService = new AIService();
    const response = await aiService.generateResponse(prompt);

    if (!response) {
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(ApiResponse.error("Failed to generate AI response"));
    }

    // Send successful response
    res.status(HTTP_STATUS.OK).json(ApiResponse.success(response));
  } catch (error: any) {
    console.error("❌ Controller error:", {
      message: error?.message,
      stack: error?.stack,
      userId: req.account?.accountId || "unknown",
      requestBody: req.body,
    });

    // Determine appropriate error response
    let errorMessage = "Internal server error";
    let statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;

    // Handle specific error types

    res.status(statusCode).json(ApiResponse.error(errorMessage, statusCode));
  }
};

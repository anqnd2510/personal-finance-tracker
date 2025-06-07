import { Request, Response, NextFunction } from "express";
import { TransactionService } from "../services/transaction.service";
import { HTTP_STATUS } from "constants/httpStatus";
import { ApiResponse } from "../utils/apiResponse";
const service = new TransactionService();
export const createTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const transactionData = req.body;
    if (!req.account || !req.account.accountId) {
      res.status(401).json({ message: "Unauthorized" });
    }
    const userId = req.account?.accountId;
    transactionData.accountId = userId;
    const response = await service.createTransaction(transactionData);
    res.status(response.statusCode).json(response);
  } catch (err) {
    next(err);
  }
};
export const getTransactionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const response = await service.getTransactionById(id);
    res.status(response.statusCode).json(response);
  } catch (err) {
    next(err);
  }
};
export const getTransactionsByAccountId = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.account?.accountId;
    if (!userId) {
      res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json(ApiResponse.error("User not authenticated", 401));
      return;
    }
    const response = await service.getTransactionsByAccountId(userId);
    res.json(
      ApiResponse.success(response, "Transactions retrieved successfully")
    );
  } catch (error: any) {
    console.error("Transactions retrieved error:", error);
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json(
        ApiResponse.error(
          error.message || "Failed to retrieved transactions",
          500
        )
      );
  }
};

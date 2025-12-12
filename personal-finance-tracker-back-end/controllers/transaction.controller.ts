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
    
    // Convert date string to Date object if it's a string
    if (transactionData.date && typeof transactionData.date === 'string') {
      transactionData.date = new Date(transactionData.date);
    }
    
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
  res: Response,
  next: NextFunction
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
    res.status(response.statusCode).json(response);
  } catch (error: any) {
    next(error);
  }
};
export const updateTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const response = await service.updateTransaction(id, updateData);
    res.status(response.statusCode).json(response);
  } catch (err) {
    next(err);
  }
};

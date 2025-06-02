import { Request, Response, NextFunction } from "express";
import { TransactionService } from "../services/transaction.service";

const service = new TransactionService();
export const createTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const transactionData = req.body;
    const response = await service.createTransaction(transactionData);
    res.status(response.statusCode).json(response);
  } catch (err) {
    next(err);
  }
};

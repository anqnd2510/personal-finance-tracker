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

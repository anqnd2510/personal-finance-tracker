import { Request, Response, NextFunction } from "express";
import { BudgetService } from "../services/budget.service";
const service = new BudgetService();
export const createBudget = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const budgetData = req.body;
    if (!req.account || !req.account.accountId) {
      res.status(401).json({ message: "Unauthorized" });
    }
    const userId = req.account?.accountId;
    budgetData.accountId = userId;
    const response = await service.createBudget(budgetData);
    res.status(response.statusCode).json(response);
  } catch (err) {
    next(err);
  }
};
export const getBudgetById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const response = await service.getBudgetById(id);
    res.status(response.statusCode).json(response);
  } catch (err) {
    next(err);
  }
};
export const getBudgetsByAccountId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.account?.accountId;
    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }
    const response = await service.getBudgetsByAccountId(userId);
    res.status(response.statusCode).json(response);
  } catch (error: any) {
    next(error);
  }
};
export const updateBudget = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const response = await service.updateBudget(id, updateData);
    res.status(response.statusCode).json(response);
  } catch (err) {
    next(err);
  }
};
export const deleteBudget = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const response = await service.deleteBudget(id);
    res.status(response.statusCode).json(response);
  } catch (err) {
    next(err);
  }
};

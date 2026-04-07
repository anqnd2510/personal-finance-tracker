import { Request, Response, NextFunction } from "express";
import { RuleService } from "../services/rule.service";
import { IRuleRequest, IRuleUpdateRequest } from "../interfaces/rule.interface";

const service = new RuleService();

export const createRule = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accountId = req.account?.accountId;
    if (!accountId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const ruleData = req.body as Omit<IRuleRequest, "accountId">;

    if (!ruleData.name || !ruleData.descriptionContains || !ruleData.categoryId) {
      res.status(400).json({ message: "name, descriptionContains, and categoryId are required" });
      return;
    }

    const response = await service.createRule({ ...ruleData, accountId });
    res.status(response.statusCode).json(response);
  } catch (err) {
    next(err);
  }
};

export const getMyRules = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accountId = req.account?.accountId;
    if (!accountId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const response = await service.getRulesByAccountId(accountId);
    res.status(response.statusCode).json(response);
  } catch (err) {
    next(err);
  }
};

export const updateRule = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accountId = req.account?.accountId;
    if (!accountId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { id } = req.params;
    const updateData = req.body as IRuleUpdateRequest;
    const response = await service.updateRule(accountId, id, updateData);
    res.status(response.statusCode).json(response);
  } catch (err) {
    next(err);
  }
};

export const deleteRule = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accountId = req.account?.accountId;
    if (!accountId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { id } = req.params;
    const response = await service.deleteRule(accountId, id);
    res.status(response.statusCode).json(response);
  } catch (err) {
    next(err);
  }
};

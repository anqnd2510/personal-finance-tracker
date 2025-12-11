import { Request, Response, NextFunction } from "express";
import { AnalyticService } from "../services/analytic.service";
import { Period } from "../constants/period.enum";

const service = new AnalyticService();

export const getAnalyticsOverview = async (
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
    const periodParam = (req.query.period as string).toLowerCase() || "month";
    const dateParam = req.query.dateas as string;
    const period = Object.values(Period).includes(periodParam as Period)
      ? (periodParam as Period)
      : Period.Month;
    const customDate = dateParam ? new Date(dateParam as string) : undefined;
    const response = await service.getOverviewData(
      userId,
      period,
      customDate
    );
    res.status(response.statusCode).json(response);
  } catch (err) {
    next(err);
  }
};

export const getCategoryAnalysisByPeriod = async (
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
    const periodParam = (req.query.period as string).toLowerCase() || "month";
    const dateParam = req.query.dateas as string;
    const period = Object.values(Period).includes(periodParam as Period)
      ? (periodParam as Period)
      : Period.Month;
    const customDate = dateParam ? new Date(dateParam as string) : undefined;
    const response = await service.getCategoryAnalysis(
      userId,
      period,
      customDate
    );
    res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
};

import Transaction from "../models/transaction.model";
import { Types } from "mongoose";
export class AnalyticRepository {
  async getTotalExpenses(accountId: Types.ObjectId, start: Date, end: Date) {
    const result = await Transaction.aggregate([
      {
        $match: {
          accountId,
          type: "expense",
          date: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);
    return result[0]?.total || 0;
  }
  async getTotalIncome(
    accountId: Types.ObjectId,
    startDate: Date,
    endDate: Date
  ) {
    const result = await Transaction.aggregate([
      {
        $match: {
          accountId,
          type: "income",
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);
    return result[0]?.total || 0;
  }
  async getTransactionCount(
    accountId: Types.ObjectId,
    startDate: Date,
    endDate: Date
  ) {
    return await Transaction.countDocuments({
      accountId,
      date: { $gte: startDate, $lte: endDate },
    });
  }

  async getTotalExpensesByCategory(
    accountId: Types.ObjectId,
    categoryId: Types.ObjectId
  ): Promise<number> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const result = await Transaction.aggregate([
      {
        $match: {
          accountId,
          categoryId,
          type: "expense",
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    return result[0]?.total || 0;
  }
}

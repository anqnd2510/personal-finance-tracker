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
  async getMonthlyCategoryAnalysis(
    accountId: Types.ObjectId,
    start: Date,
    end: Date
  ) {
    return Transaction.aggregate([
      {
        $match: {
          accountId,
          date: { $gte: start, $lte: end },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $group: {
          _id: {
            categoryId: "$categoryId",
            categoryName: "$category.name",
            type: "$type",
          },
          totalAmount: { $sum: "$amount" },
          transactionCount: { $sum: 1 },
        },
      },
      { $sort: { totalAmount: -1 } },
    ]);
  }
}

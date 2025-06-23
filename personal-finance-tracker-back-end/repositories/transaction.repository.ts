import Transaction from "../models/transaction.model";
import {
  ITransaction,
  ITransactionRequest,
} from "../interfaces/transaction.interface";
import { Types } from "mongoose";

export class TransactionRepository {
  async createTransaction(
    transactionData: ITransactionRequest
  ): Promise<ITransaction> {
    const transaction = new Transaction(transactionData);
    return await transaction.save();
  }

  async findTransactionById(id: string): Promise<ITransaction | null> {
    return await Transaction.findById(id);
  }

  async findTransactionsByAccountId(
    accountId: string | Types.ObjectId
  ): Promise<ITransaction[]> {
    return await Transaction.find({ accountId });
  }

  async updateTransaction(
    id: string,
    updateData: Partial<ITransaction>
  ): Promise<ITransaction | null> {
    return await Transaction.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteTransaction(id: string): Promise<ITransaction | null> {
    return await Transaction.findByIdAndDelete(id);
  }

  async getTotalExpenses(
    accountId: Types.ObjectId,
    categoryId: Types.ObjectId,
    start: Date,
    end: Date
  ) {
    const result = await Transaction.aggregate([
      {
        $match: {
          accountId,
          categoryId,
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

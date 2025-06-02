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
    accountId: Types.ObjectId
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
}

import { prisma } from "../config/database";
import {
  ITransaction,
  ITransactionRequest,
} from "../interfaces/transaction.interface";

export class TransactionRepository {
  async createTransaction(
    transactionData: ITransactionRequest
  ): Promise<ITransaction> {
    return await prisma.transaction.create({
      data: {
        accountId: transactionData.accountId,
        categoryId: transactionData.categoryId,
        amount: transactionData.amount,
        type: transactionData.type,
        date: transactionData.date,
        description: transactionData.description || "",
      },
    });
  }

  async findTransactionById(id: string): Promise<ITransaction | null> {
    return await prisma.transaction.findUnique({
      where: { id },
    });
  }

  async findTransactionsByAccountId(accountId: string): Promise<ITransaction[]> {
    return await prisma.transaction.findMany({
      where: { accountId },
    });
  }

  async updateTransaction(
    id: string,
    updateData: Partial<ITransaction>
  ): Promise<ITransaction | null> {
    return await prisma.transaction.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteTransaction(id: string): Promise<ITransaction | null> {
    return await prisma.transaction.delete({
      where: { id },
    });
  }
}

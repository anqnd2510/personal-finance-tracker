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

  /**
   * Get total spent in a period for a category
   */
  async getTotalSpentInPeriod(
    accountId: string,
    categoryId: string,
    startDate: Date,
    endDate: Date
  ): Promise<number> {
    const result = await prisma.transaction.aggregate({
      where: {
        accountId,
        categoryId,
        type: "expense",
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        amount: true,
      },
    });

    return result._sum.amount || 0;
  }

  /**
   * Get category spending in a period
   */
  async getCategorySpending(
    accountId: string,
    categoryId: string,
    startDate: Date,
    endDate: Date
  ): Promise<number> {
    return this.getTotalSpentInPeriod(accountId, categoryId, startDate, endDate);
  }

  /**
   * Get monthly spending total
   */
  async getMonthlySpending(
    accountId: string,
    startDate: Date,
    endDate: Date
  ): Promise<number> {
    const result = await prisma.transaction.aggregate({
      where: {
        accountId,
        type: "expense",
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        amount: true,
      },
    });

    return result._sum.amount || 0;
  }

  /**
   * Get total income in a period
   */
  async getTotalIncome(
    accountId: string,
    startDate: Date,
    endDate: Date
  ): Promise<number> {
    const result = await prisma.transaction.aggregate({
      where: {
        accountId,
        type: "income",
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        amount: true,
      },
    });

    return result._sum.amount || 0;
  }

  /**
   * Get total expense in a period
   */
  async getTotalExpense(
    accountId: string,
    startDate: Date,
    endDate: Date
  ): Promise<number> {
    return this.getMonthlySpending(accountId, startDate, endDate);
  }

  /**
   * Get monthly spending history
   */
  async getMonthlySpendingHistory(
    accountId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Array<{ month: string; total: number }>> {
    const transactions = await prisma.transaction.findMany({
      where: {
        accountId,
        type: "expense",
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    // Group by month
    const monthlyData = new Map<string, number>();

    transactions.forEach((tx) => {
      const monthKey = `${tx.date.getFullYear()}-${String(tx.date.getMonth() + 1).padStart(2, "0")}`;
      const current = monthlyData.get(monthKey) || 0;
      monthlyData.set(monthKey, current + tx.amount);
    });

    return Array.from(monthlyData.entries()).map(([month, total]) => ({
      month,
      total,
    }));
  }

  /**
   * Find recurring transactions (same amount, similar dates across months)
   */
  async findRecurringTransactions(accountId: string): Promise<any[]> {
    // Get last 3 months of transactions
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const transactions = await prisma.transaction.findMany({
      where: {
        accountId,
        date: {
          gte: threeMonthsAgo,
        },
      },
      include: {
        category: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    // Group by amount and category
    const groups = new Map<string, any[]>();

    transactions.forEach((tx) => {
      const key = `${tx.amount}-${tx.categoryId}`;
      const existing = groups.get(key) || [];
      existing.push(tx);
      groups.set(key, existing);
    });

    // Find groups that appear in multiple months
    const recurring: any[] = [];

    groups.forEach((txs, key) => {
      if (txs.length >= 2) {
        const months = new Set(txs.map((t) => `${t.date.getFullYear()}-${t.date.getMonth()}`));
        if (months.size >= 2) {
          recurring.push({
            amount: txs[0].amount,
            category: txs[0].category?.name,
            count: txs.length,
            description: txs[0].description,
          });
        }
      }
    });

    return recurring;
  }
}

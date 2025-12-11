import { prisma } from "../config/database";

export class AnalyticRepository {
  async getTotalExpenses(accountId: string, start: Date, end: Date) {
    const result = await prisma.transaction.aggregate({
      where: {
        accountId,
        type: "expense",
        date: {
          gte: start,
          lte: end,
        },
      },
      _sum: {
        amount: true,
      },
    });
    return result._sum.amount || 0;
  }

  async getTotalIncome(accountId: string, startDate: Date, endDate: Date) {
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

  async getTransactionCount(accountId: string, startDate: Date, endDate: Date) {
    return await prisma.transaction.count({
      where: {
        accountId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }

  async getMonthlyCategoryAnalysis(accountId: string, start: Date, end: Date) {
    const transactions = await prisma.transaction.findMany({
      where: {
        accountId,
        date: {
          gte: start,
          lte: end,
        },
      },
      include: {
        category: true,
      },
    });

    // Group by category and type
    const grouped = transactions.reduce((acc: any, transaction) => {
      const key = `${transaction.categoryId}-${transaction.type}`;
      if (!acc[key]) {
        acc[key] = {
          _id: {
            categoryId: transaction.categoryId,
            categoryName: transaction.category.name,
            type: transaction.type,
          },
          totalAmount: 0,
          transactionCount: 0,
        };
      }
      acc[key].totalAmount += transaction.amount;
      acc[key].transactionCount += 1;
      return acc;
    }, {});

    // Convert to array and sort by totalAmount descending
    return Object.values(grouped).sort(
      (a: any, b: any) => b.totalAmount - a.totalAmount
    );
  }
}

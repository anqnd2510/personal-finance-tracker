"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticRepository = void 0;
const database_1 = require("../config/database");
class AnalyticRepository {
    async getTotalExpenses(accountId, start, end) {
        const result = await database_1.prisma.transaction.aggregate({
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
    async getTotalIncome(accountId, startDate, endDate) {
        const result = await database_1.prisma.transaction.aggregate({
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
    async getTransactionCount(accountId, startDate, endDate) {
        return await database_1.prisma.transaction.count({
            where: {
                accountId,
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });
    }
    async getMonthlyCategoryAnalysis(accountId, start, end) {
        const transactions = await database_1.prisma.transaction.findMany({
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
        const grouped = transactions.reduce((acc, transaction) => {
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
        return Object.values(grouped).sort((a, b) => b.totalAmount - a.totalAmount);
    }
}
exports.AnalyticRepository = AnalyticRepository;
//# sourceMappingURL=analytic.repository.js.map
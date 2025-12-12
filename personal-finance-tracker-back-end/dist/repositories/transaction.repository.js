"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRepository = void 0;
const database_1 = require("../config/database");
class TransactionRepository {
    async createTransaction(transactionData) {
        return await database_1.prisma.transaction.create({
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
    async findTransactionById(id) {
        return await database_1.prisma.transaction.findUnique({
            where: { id },
        });
    }
    async findTransactionsByAccountId(accountId) {
        return await database_1.prisma.transaction.findMany({
            where: { accountId },
        });
    }
    async updateTransaction(id, updateData) {
        return await database_1.prisma.transaction.update({
            where: { id },
            data: updateData,
        });
    }
    async deleteTransaction(id) {
        return await database_1.prisma.transaction.delete({
            where: { id },
        });
    }
    async getTotalSpentInPeriod(accountId, categoryId, startDate, endDate) {
        const result = await database_1.prisma.transaction.aggregate({
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
    async getCategorySpending(accountId, categoryId, startDate, endDate) {
        return this.getTotalSpentInPeriod(accountId, categoryId, startDate, endDate);
    }
    async getMonthlySpending(accountId, startDate, endDate) {
        const result = await database_1.prisma.transaction.aggregate({
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
    async getTotalExpense(accountId, startDate, endDate) {
        return this.getMonthlySpending(accountId, startDate, endDate);
    }
    async getMonthlySpendingHistory(accountId, startDate, endDate) {
        const transactions = await database_1.prisma.transaction.findMany({
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
        const monthlyData = new Map();
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
    async findRecurringTransactions(accountId) {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        const transactions = await database_1.prisma.transaction.findMany({
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
        const groups = new Map();
        transactions.forEach((tx) => {
            const key = `${tx.amount}-${tx.categoryId}`;
            const existing = groups.get(key) || [];
            existing.push(tx);
            groups.set(key, existing);
        });
        const recurring = [];
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
exports.TransactionRepository = TransactionRepository;
//# sourceMappingURL=transaction.repository.js.map
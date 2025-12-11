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
}
exports.TransactionRepository = TransactionRepository;
//# sourceMappingURL=transaction.repository.js.map
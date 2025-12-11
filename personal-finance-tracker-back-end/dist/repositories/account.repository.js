"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountRepository = void 0;
const database_1 = require("../config/database");
class AccountRepository {
    async createAccount(accountData) {
        return await database_1.prisma.account.create({
            data: accountData,
        });
    }
    async findAccountByEmail(email) {
        return await database_1.prisma.account.findUnique({
            where: { email },
        });
    }
    async findAccountById(id) {
        return await database_1.prisma.account.findUnique({
            where: { id },
        });
    }
    async updateAccount(id, updateData) {
        return await database_1.prisma.account.update({
            where: { id },
            data: updateData,
        });
    }
    async deleteAccount(id) {
        return await database_1.prisma.account.delete({
            where: { id },
        });
    }
    async findActiveAccountByEmail(email) {
        return await database_1.prisma.account.findFirst({
            where: {
                email,
                isActive: true,
            },
        });
    }
    async findAllAccounts(limit, skip) {
        return await database_1.prisma.account.findMany({
            skip,
            take: limit,
        });
    }
    async countAccounts() {
        return await database_1.prisma.account.count();
    }
    async deactivateAccount(id) {
        return await database_1.prisma.account.update({
            where: { id },
            data: { isActive: false },
        });
    }
    async activateAccount(id) {
        return await database_1.prisma.account.update({
            where: { id },
            data: { isActive: true },
        });
    }
}
exports.AccountRepository = AccountRepository;
//# sourceMappingURL=account.repository.js.map
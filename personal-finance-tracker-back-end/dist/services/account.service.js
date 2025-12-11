"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountService = void 0;
const account_repository_1 = require("../repositories/account.repository");
class AccountService {
    constructor() {
        this.accountRepository = new account_repository_1.AccountRepository();
    }
    async getAllAccounts(page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;
            const accounts = await this.accountRepository.findAllAccounts(limit, skip);
            const totalAccounts = await this.accountRepository.countAccounts();
            const privatedAccounts = accounts.map((account) => {
                const { password, ...safeAccount } = account;
                return safeAccount;
            });
            return {
                accounts: privatedAccounts,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalAccounts / limit),
                    totalItems: totalAccounts,
                    itemsPerPage: limit,
                },
            };
        }
        catch (error) {
            console.error("Get all accounts service error:", error);
            throw new Error(error.message || "Failed to get accounts");
        }
    }
    async getAccountById(id) {
        try {
            const account = await this.accountRepository.findAccountById(id);
            if (!account) {
                throw new Error("Account not found");
            }
            const { password, ...safeAccount } = account;
            return safeAccount;
        }
        catch (error) {
            console.error("Get account by ID service error:", error);
            throw new Error(error.message || "Failed to get account");
        }
    }
    async updateAccount(id, updateData) {
        try {
            const updatedAccount = await this.accountRepository.updateAccount(id, updateData);
            if (!updatedAccount) {
                throw new Error("Account not found");
            }
            const { password, ...safeAccount } = updatedAccount;
            return safeAccount;
        }
        catch (error) {
            console.error("Update account service error:", error);
            throw new Error(error.message || "Failed to update account");
        }
    }
    async deactivateAccount(id) {
        try {
            const deactivatedAccount = await this.accountRepository.deactivateAccount(id);
            if (!deactivatedAccount) {
                throw new Error("Account not found");
            }
            const { password, ...safeAccount } = deactivatedAccount;
            return safeAccount;
        }
        catch (error) {
            console.error("Deactivate account service error:", error);
            throw new Error(error.message || "Failed to deactivate account");
        }
    }
    async activateAccount(id) {
        try {
            const activatedAccount = await this.accountRepository.activateAccount(id);
            if (!activatedAccount) {
                throw new Error("Account not found");
            }
            const { password, ...safeAccount } = activatedAccount;
            return safeAccount;
        }
        catch (error) {
            console.error("Activate account service error:", error);
            throw new Error(error.message || "Failed to activate account");
        }
    }
    async deleteAccount(id) {
        try {
            const deletedAccount = await this.accountRepository.deleteAccount(id);
            if (!deletedAccount) {
                throw new Error("Account not found");
            }
            return { message: "Account deleted successfully" };
        }
        catch (error) {
            console.error("Delete account service error:", error);
            throw new Error(error.message || "Failed to delete account");
        }
    }
}
exports.AccountService = AccountService;
//# sourceMappingURL=account.service.js.map
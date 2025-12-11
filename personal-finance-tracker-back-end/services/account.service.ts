import { AccountRepository } from "../repositories/account.repository";
import { IUpdateAccountRequest } from "../interfaces/account.interface";
import { PasswordService } from "../utils/password";
export class AccountService {
  private accountRepository: AccountRepository;
  constructor() {
    this.accountRepository = new AccountRepository();
  }
  /**
   * Retrieves all Accounts
   * @param {number} page - The page number for pagination (default is 1).
   * @param {number} limit - The number of accounts to retrieve per page (default is 10).
   * @returns {Promise<{ accounts: IAccount[], pagination: { currentPage: number, totalPages: number, totalItems: number, itemsPerPage: number } }>} - A promise that resolves to an object containing the accounts and pagination information.
   * @throws {Error} - Throws an error if there is an issue retrieving accounts.
   */
  async getAllAccounts(page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;
      const accounts = await this.accountRepository.findAllAccounts(
        limit,
        skip
      );
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
    } catch (error: any) {
      console.error("Get all accounts service error:", error);
      throw new Error(error.message || "Failed to get accounts");
    }
  }

  /**
   * Retrieves accounts by Id.
   * @param {string} id - The ID of the account to retrieve.
   * @returns {Promise<IAccount>} - A promise that resolves to the account object without the password field.
   * @throws {Error} - Throws an error if the account is not found or if there is an issue retrieving the account.
   */
  async getAccountById(id: string) {
    try {
      const account = await this.accountRepository.findAccountById(id);
      if (!account) {
        throw new Error("Account not found");
      }

      const { password, ...safeAccount } = account;
      return safeAccount;
    } catch (error: any) {
      console.error("Get account by ID service error:", error);
      throw new Error(error.message || "Failed to get account");
    }
  }

  /**
   * Update accounts by Id.
   * @param {string} id - The ID of the account to update.
   * @param {IUpdateAccountRequest} updateData - The data to update the account with.
   * @returns {Promise<IAccount>} - A promise that resolves to the updated account object without the password field.
   * @throws {Error} - Throws an error if the account is not found or if there is an issue updating the account.
   */
  async updateAccount(id: string, updateData: IUpdateAccountRequest) {
    try {
      const updatedAccount = await this.accountRepository.updateAccount(id, updateData);

      if (!updatedAccount) {
        throw new Error("Account not found");
      }

      const { password, ...safeAccount } = updatedAccount;
      return safeAccount;
    } catch (error: any) {
      console.error("Update account service error:", error);
      throw new Error(error.message || "Failed to update account");
    }
  }
  /**
   * Deactivate Account by Id.
   * @param {string} id - The ID of the account to deactivate.
   * @returns {Promise<IAccount>} - A promise that resolves to the deactivated account object without the password field.
   * @throws {Error} - Throws an error if the account is not found or if there is an issue deactivating the account.
   */
  async deactivateAccount(id: string) {
    try {
      const deactivatedAccount = await this.accountRepository.deactivateAccount(
        id
      );
      if (!deactivatedAccount) {
        throw new Error("Account not found");
      }

      const { password, ...safeAccount } = deactivatedAccount;
      return safeAccount;
    } catch (error: any) {
      console.error("Deactivate account service error:", error);
      throw new Error(error.message || "Failed to deactivate account");
    }
  }
  /**
   * Activate Account by Id.
   * @param {string} id - The ID of the account to activate.
   * @returns {Promise<IAccount>} - A promise that resolves to the deactivated account object without the password field.
   * @throws {Error} - Throws an error if the account is not found or if there is an issue deactivating the account.
   */
  async activateAccount(id: string) {
    try {
      const activatedAccount = await this.accountRepository.activateAccount(id);
      if (!activatedAccount) {
        throw new Error("Account not found");
      }

      const { password, ...safeAccount } = activatedAccount;
      return safeAccount;
    } catch (error: any) {
      console.error("Activate account service error:", error);
      throw new Error(error.message || "Failed to activate account");
    }
  }
  /**
   * Deletes an account by its ID.
   * @param {string} id - The ID of the account to delete.
   * @returns {Promise<{ message: string }>} - A promise that resolves to a success message.
   * @throws {Error} - Throws an error if the account is not found or if there is an issue deleting the account.
   */
  async deleteAccount(id: string) {
    try {
      const deletedAccount = await this.accountRepository.deleteAccount(id);
      if (!deletedAccount) {
        throw new Error("Account not found");
      }

      return { message: "Account deleted successfully" };
    } catch (error: any) {
      console.error("Delete account service error:", error);
      throw new Error(error.message || "Failed to delete account");
    }
  }
}

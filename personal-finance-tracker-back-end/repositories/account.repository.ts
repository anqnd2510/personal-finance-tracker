import Account from "../models/account.model";
import { IAccount, IAccountRequest } from "../interfaces/account.interface";

export class AccountRepository {
  async createAccount(accountData: IAccountRequest): Promise<IAccount> {
    const account = new Account(accountData);
    return await account.save();
  }

  async findAccountByEmail(email: string): Promise<IAccount | null> {
    return await Account.findOne({ email });
  }

  async findAccountById(id: string): Promise<IAccount | null> {
    return await Account.findById(id);
  }

  async updateAccount(
    id: string,
    updateData: Partial<IAccount>
  ): Promise<IAccount | null> {
    return await Account.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteAccount(id: string): Promise<IAccount | null> {
    return await Account.findByIdAndDelete(id);
  }
}

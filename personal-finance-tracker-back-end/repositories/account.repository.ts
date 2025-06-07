import Account from "../models/account.model";
import {
  IAccount,
  ICreateAccountRequest,
  IUpdateAccountRequest,
} from "../interfaces/account.interface";

export class AccountRepository {
  async createAccount(accountData: ICreateAccountRequest): Promise<IAccount> {
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
    updateData: IUpdateAccountRequest
  ): Promise<IAccount | null> {
    return await Account.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteAccount(id: string): Promise<IAccount | null> {
    return await Account.findByIdAndDelete(id);
  }

  async findActiveAccountByEmail(email: string): Promise<IAccount | null> {
    return await Account.findOne({ email, isActive: true });
  }

  async findAllAccounts(limit?: number, skip?: number): Promise<IAccount[]> {
    const query = Account.find();

    if (skip) {
      query.skip(skip);
    }

    if (limit) {
      query.limit(limit);
    }

    return await query.exec();
  }
  async countAccounts(): Promise<number> {
    return await Account.countDocuments();
  }
  async deactivateAccount(id: string): Promise<IAccount | null> {
    return await Account.findByIdAndUpdate(
      id,
      { isActive: false, updatedAt: new Date() },
      { new: true }
    );
  }

  async activateAccount(id: string): Promise<IAccount | null> {
    return await Account.findByIdAndUpdate(
      id,
      { isActive: true, updatedAt: new Date() },
      { new: true }
    );
  }
}

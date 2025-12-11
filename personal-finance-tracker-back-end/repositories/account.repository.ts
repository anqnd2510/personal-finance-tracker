import { prisma } from "../config/database";
import {
  IAccount,
  ICreateAccountRequest,
  IUpdateAccountRequest,
} from "../interfaces/account.interface";

export class AccountRepository {
  async createAccount(accountData: ICreateAccountRequest): Promise<IAccount> {
    return await prisma.account.create({
      data: accountData,
    });
  }

  async findAccountByEmail(email: string): Promise<IAccount | null> {
    return await prisma.account.findUnique({
      where: { email },
    });
  }

  async findAccountById(id: string): Promise<IAccount | null> {
    return await prisma.account.findUnique({
      where: { id },
    });
  }

  async updateAccount(
    id: string,
    updateData: IUpdateAccountRequest
  ): Promise<IAccount | null> {
    return await prisma.account.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteAccount(id: string): Promise<IAccount | null> {
    return await prisma.account.delete({
      where: { id },
    });
  }

  async findActiveAccountByEmail(email: string): Promise<IAccount | null> {
    return await prisma.account.findFirst({
      where: {
        email,
        isActive: true,
      },
    });
  }

  async findAllAccounts(limit?: number, skip?: number): Promise<IAccount[]> {
    return await prisma.account.findMany({
      skip,
      take: limit,
    });
  }

  async countAccounts(): Promise<number> {
    return await prisma.account.count();
  }

  async deactivateAccount(id: string): Promise<IAccount | null> {
    return await prisma.account.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async activateAccount(id: string): Promise<IAccount | null> {
    return await prisma.account.update({
      where: { id },
      data: { isActive: true },
    });
  }
}

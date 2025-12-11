import { IAccount, ICreateAccountRequest, IUpdateAccountRequest } from "../interfaces/account.interface";
export declare class AccountRepository {
    createAccount(accountData: ICreateAccountRequest): Promise<IAccount>;
    findAccountByEmail(email: string): Promise<IAccount | null>;
    findAccountById(id: string): Promise<IAccount | null>;
    updateAccount(id: string, updateData: IUpdateAccountRequest): Promise<IAccount | null>;
    deleteAccount(id: string): Promise<IAccount | null>;
    findActiveAccountByEmail(email: string): Promise<IAccount | null>;
    findAllAccounts(limit?: number, skip?: number): Promise<IAccount[]>;
    countAccounts(): Promise<number>;
    deactivateAccount(id: string): Promise<IAccount | null>;
    activateAccount(id: string): Promise<IAccount | null>;
}
//# sourceMappingURL=account.repository.d.ts.map
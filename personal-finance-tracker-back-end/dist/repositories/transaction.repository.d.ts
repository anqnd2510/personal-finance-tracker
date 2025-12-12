import { ITransaction, ITransactionRequest } from "../interfaces/transaction.interface";
export declare class TransactionRepository {
    createTransaction(transactionData: ITransactionRequest): Promise<ITransaction>;
    findTransactionById(id: string): Promise<ITransaction | null>;
    findTransactionsByAccountId(accountId: string): Promise<ITransaction[]>;
    updateTransaction(id: string, updateData: Partial<ITransaction>): Promise<ITransaction | null>;
    deleteTransaction(id: string): Promise<ITransaction | null>;
    getTotalSpentInPeriod(accountId: string, categoryId: string, startDate: Date, endDate: Date): Promise<number>;
    getCategorySpending(accountId: string, categoryId: string, startDate: Date, endDate: Date): Promise<number>;
    getMonthlySpending(accountId: string, startDate: Date, endDate: Date): Promise<number>;
    getTotalIncome(accountId: string, startDate: Date, endDate: Date): Promise<number>;
    getTotalExpense(accountId: string, startDate: Date, endDate: Date): Promise<number>;
    getMonthlySpendingHistory(accountId: string, startDate: Date, endDate: Date): Promise<Array<{
        month: string;
        total: number;
    }>>;
    findRecurringTransactions(accountId: string): Promise<any[]>;
}
//# sourceMappingURL=transaction.repository.d.ts.map
import { ITransaction, ITransactionRequest } from "../interfaces/transaction.interface";
export declare class TransactionRepository {
    createTransaction(transactionData: ITransactionRequest): Promise<ITransaction>;
    findTransactionById(id: string): Promise<ITransaction | null>;
    findTransactionsByAccountId(accountId: string): Promise<ITransaction[]>;
    updateTransaction(id: string, updateData: Partial<ITransaction>): Promise<ITransaction | null>;
    deleteTransaction(id: string): Promise<ITransaction | null>;
}
//# sourceMappingURL=transaction.repository.d.ts.map
import { Transaction, TransactionType } from "@prisma/client";
export type ITransaction = Transaction;
export { TransactionType };
export interface ITransactionRequest {
    accountId: string;
    amount: number;
    type: TransactionType;
    categoryId: string;
    date: Date;
    description?: string;
}
export interface ITransactionResponse {
    id?: string;
    accountId: string;
    amount: number;
    type: "income" | "expense";
    categoryId: string;
    date: Date;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
//# sourceMappingURL=transaction.interface.d.ts.map
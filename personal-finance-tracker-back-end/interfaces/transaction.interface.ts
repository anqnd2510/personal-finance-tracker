import { Transaction, TransactionType } from "@prisma/client";

// Use Prisma's generated Transaction type
export type ITransaction = Transaction;

// Re-export TransactionType for backward compatibility
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

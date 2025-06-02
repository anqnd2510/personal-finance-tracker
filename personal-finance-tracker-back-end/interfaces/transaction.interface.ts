import { Document, Types } from "mongoose";
export interface ITransaction extends Document {
  accountId: Types.ObjectId;
  amount: number;
  type: "income" | "expense";
  categoryId: Types.ObjectId;
  status: string; // e.g., "pending", "completed", "failed"
  date: Date;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface ITransactionRequest {
  accountId: Types.ObjectId;
  amount: number;
  type: "income" | "expense";
  categoryId: Types.ObjectId;
  date: Date;
  status: string; // e.g., "pending", "completed", "failed"
  description?: string;
}

export interface ITransactionResponse {
  accountId: Types.ObjectId;
  amount: number;
  type: "income" | "expense";
  categoryId: Types.ObjectId;
  date: Date;
  description?: string;
  status: string; // e.g., "pending", "completed", "failed"
  createdAt?: Date;
  updatedAt?: Date;
}

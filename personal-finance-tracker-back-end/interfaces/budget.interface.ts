import { Document, Types } from "mongoose";
export interface IBudget extends Document {
  accountId: Types.ObjectId;
  categoryId: Types.ObjectId;
  amount: number;
  limitAmount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface IBudgetRequest {
  accountId: Types.ObjectId;
  categoryId: Types.ObjectId;
  limitAmount?: number;
}
export interface IBudgetResponse {
  accountId: Types.ObjectId;
  categoryId: Types.ObjectId;
  amount: number;
  limitAmount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface IAdjustBudgetAmount {
  accountId: Types.ObjectId;
  categoryId: Types.ObjectId;
  amount: number;
  type: "income" | "expense";
}

import { Document, Types } from "mongoose";
export interface IBudget extends Document {
  accountId: Types.ObjectId;
  categoryId: Types.ObjectId;
  amount: number;
  startDate: Date;
  endDate: Date;
  limitAmount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface IBudgetRequest {
  accountId: Types.ObjectId;
  categoryId: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  limitAmount?: number;
}
export interface IBudgetResponse {
  accountId: Types.ObjectId;
  categoryId: Types.ObjectId;
  amount: number;
  startDate: Date;
  endDate: Date;
  limitAmount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface IAdjustBudgetAmount {
  accountId: Types.ObjectId;
  categoryId: Types.ObjectId;
  amount: number;
  date: Date;
  type: "income" | "expense";
}

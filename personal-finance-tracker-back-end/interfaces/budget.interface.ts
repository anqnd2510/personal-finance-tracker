import { Document, Types } from "mongoose";
export interface IBudget extends Document {
  accountId: Types.ObjectId;
  categoryId: Types.ObjectId;
  amount: number;
  limitAmount: number;
  period: "daily" | "weekly" | "monthly" | "yearly";
  periodStartDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface IBudgetRequest {
  accountId: Types.ObjectId;
  categoryId: Types.ObjectId;
  limitAmount: number;
  period: "daily" | "weekly" | "monthly" | "yearly";
}
export interface IBudgetResponse {
  accountId: Types.ObjectId;
  categoryId: Types.ObjectId;
  amount: number;
  limitAmount?: number;
  period: string;
  periodStartDate: Date;
  status?: "safe" | "warning" | "exceeded";
  percentage?: number;
  remaining?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface IBudgetStatus {
  status: "safe" | "warning" | "exceeded";
  percentage: number;
  remaining: number;
}
export interface IAdjustBudgetAmount {
  accountId: Types.ObjectId;
  categoryId: Types.ObjectId;
  amount: number;
  type: "income" | "expense";
}

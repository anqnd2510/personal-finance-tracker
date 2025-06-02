import { Document } from "mongoose";
export interface IBudget extends Document {
  accountId: string;
  category: string;
  amount: number;
  startDate: Date;
  endDate: Date;
  limitAmount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface IBudgetRequest {
  accountId: string;
  category: string;
  amount: number;
  startDate: Date;
  endDate: Date;
  limitAmount?: number;
}
export interface IBudgetResponse {
  accountId: string;
  category: string;
  amount: number;
  startDate: Date;
  endDate: Date;
  limitAmount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

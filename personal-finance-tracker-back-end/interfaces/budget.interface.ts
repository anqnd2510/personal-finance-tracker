import { Budget, Period, Category } from "@prisma/client";

export type IBudget = Budget;

export type IBudgetWithCategory = Budget & {
  category: Category;
};

export { Period };

export interface IBudgetRequest {
  accountId: string;
  categoryId: string;
  limitAmount: number;
  period: Period;
}

export interface IBudgetResponse {
  id?: string;
  accountId: string;
  categoryId: string;
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
  accountId: string;
  categoryId: string;
  amount: number;
  type: "income" | "expense";
}

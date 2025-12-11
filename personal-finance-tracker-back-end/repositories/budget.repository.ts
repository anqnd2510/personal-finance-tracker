import { prisma } from "../config/database";
import {
  IBudget,
  IBudgetRequest,
  IAdjustBudgetAmount,
} from "../interfaces/budget.interface";

export class BudgetRepository {
  async createBudget(budgetData: IBudgetRequest): Promise<IBudget> {
    return await prisma.budget.create({
      data: {
        accountId: budgetData.accountId,
        categoryId: budgetData.categoryId,
        limitAmount: budgetData.limitAmount,
        period: budgetData.period,
        amount: 0,
        periodStartDate: this.getNewPeriodStartDate(
          budgetData.period,
          new Date()
        ),
      },
    });
  }

  async findBudgetById(id: string): Promise<IBudget | null> {
    return await prisma.budget.findUnique({
      where: { id },
    });
  }

  async findBudgetsByAccountId(accountId: string): Promise<IBudget[]> {
    return await prisma.budget.findMany({
      where: { accountId },
    });
  }

  async findByAccountAndCategory(
    accountId: string,
    categoryId: string
  ): Promise<IBudget | null> {
    return await prisma.budget.findFirst({
      where: {
        accountId,
        categoryId,
      },
    });
  }

  async updateBudget(
    id: string,
    updateData: Partial<IBudget>
  ): Promise<IBudget | null> {
    return await prisma.budget.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteBudget(id: string): Promise<IBudget | null> {
    return await prisma.budget.delete({
      where: { id },
    });
  }

  async adjustBudgetAmount({
    accountId,
    categoryId,
    amount,
    type,
  }: IAdjustBudgetAmount): Promise<void> {
    const budget = await prisma.budget.findFirst({
      where: { accountId, categoryId },
    });
    if (!budget) return;

    const updatedBudget = await this.resetBudgetIfNeeded(budget);

    if (type === "expense") {
      await prisma.budget.update({
        where: { id: updatedBudget.id },
        data: { amount: updatedBudget.amount + amount },
      });
    }
  }

  async resetBudgetIfNeeded(budget: IBudget): Promise<IBudget> {
    const now = new Date();
    const shouldReset = this.shouldResetBudget(
      budget.period,
      budget.periodStartDate,
      now
    );

    if (shouldReset) {
      return await prisma.budget.update({
        where: { id: budget.id },
        data: {
          amount: 0,
          periodStartDate: this.getNewPeriodStartDate(budget.period, now),
        },
      });
    }

    return budget;
  }

  private shouldResetBudget(
    period: string,
    startDate: Date,
    now: Date
  ): boolean {
    switch (period) {
      case "daily":
        return !this.isSameDay(startDate, now);
      case "weekly":
        return this.getWeeksDiff(startDate, now) >= 1;
      case "monthly":
        return (
          startDate.getMonth() !== now.getMonth() ||
          startDate.getFullYear() !== now.getFullYear()
        );
      case "yearly":
        return startDate.getFullYear() !== now.getFullYear();
      default:
        return false;
    }
  }

  private getNewPeriodStartDate(period: string, now: Date): Date {
    const startDate = new Date(now);
    switch (period) {
      case "daily":
        startDate.setHours(0, 0, 0, 0);
        break;
      case "weekly":
        const dayOfWeek = now.getDay();
        startDate.setDate(now.getDate() - dayOfWeek);
        startDate.setHours(0, 0, 0, 0);
        break;
      case "monthly":
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        break;
      case "yearly":
        startDate.setMonth(0, 1);
        startDate.setHours(0, 0, 0, 0);
        break;
      default:
        startDate.setHours(0, 0, 0, 0);
    }
    return startDate;
  }

  getPeriodEndDate(period: string, startDate: Date): Date {
    const endDate = new Date(startDate);
    switch (period) {
      case "daily":
        endDate.setDate(startDate.getDate() + 1);
        endDate.setMilliseconds(-1);
        break;
      case "weekly":
        endDate.setDate(startDate.getDate() + 7);
        endDate.setMilliseconds(-1);
        break;
      case "monthly":
        endDate.setMonth(startDate.getMonth() + 1);
        endDate.setMilliseconds(-1);
        break;
      case "yearly":
        endDate.setFullYear(startDate.getFullYear() + 1);
        endDate.setMilliseconds(-1);
        break;
      default:
        endDate.setDate(startDate.getDate() + 1);
        endDate.setMilliseconds(-1);
    }
    return endDate;
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  private getWeeksDiff(startDate: Date, endDate: Date): number {
    const msPerWeek = 7 * 24 * 60 * 60 * 1000;
    return Math.floor((endDate.getTime() - startDate.getTime()) / msPerWeek);
  }
}

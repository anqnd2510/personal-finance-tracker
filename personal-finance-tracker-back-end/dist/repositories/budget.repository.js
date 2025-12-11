"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetRepository = void 0;
const database_1 = require("../config/database");
class BudgetRepository {
    async createBudget(budgetData) {
        return await database_1.prisma.budget.create({
            data: {
                accountId: budgetData.accountId,
                categoryId: budgetData.categoryId,
                limitAmount: budgetData.limitAmount,
                period: budgetData.period,
                amount: 0,
                periodStartDate: this.getNewPeriodStartDate(budgetData.period, new Date()),
            },
        });
    }
    async findBudgetById(id) {
        return await database_1.prisma.budget.findUnique({
            where: { id },
        });
    }
    async findBudgetsByAccountId(accountId) {
        return await database_1.prisma.budget.findMany({
            where: { accountId },
        });
    }
    async findByAccountAndCategory(accountId, categoryId) {
        return await database_1.prisma.budget.findFirst({
            where: {
                accountId,
                categoryId,
            },
        });
    }
    async updateBudget(id, updateData) {
        return await database_1.prisma.budget.update({
            where: { id },
            data: updateData,
        });
    }
    async deleteBudget(id) {
        return await database_1.prisma.budget.delete({
            where: { id },
        });
    }
    async adjustBudgetAmount({ accountId, categoryId, amount, type, }) {
        const budget = await database_1.prisma.budget.findFirst({
            where: { accountId, categoryId },
        });
        if (!budget)
            return;
        const updatedBudget = await this.resetBudgetIfNeeded(budget);
        if (type === "expense") {
            await database_1.prisma.budget.update({
                where: { id: updatedBudget.id },
                data: { amount: updatedBudget.amount + amount },
            });
        }
    }
    async resetBudgetIfNeeded(budget) {
        const now = new Date();
        const shouldReset = this.shouldResetBudget(budget.period, budget.periodStartDate, now);
        if (shouldReset) {
            return await database_1.prisma.budget.update({
                where: { id: budget.id },
                data: {
                    amount: 0,
                    periodStartDate: this.getNewPeriodStartDate(budget.period, now),
                },
            });
        }
        return budget;
    }
    shouldResetBudget(period, startDate, now) {
        switch (period) {
            case "daily":
                return !this.isSameDay(startDate, now);
            case "weekly":
                return this.getWeeksDiff(startDate, now) >= 1;
            case "monthly":
                return (startDate.getMonth() !== now.getMonth() ||
                    startDate.getFullYear() !== now.getFullYear());
            case "yearly":
                return startDate.getFullYear() !== now.getFullYear();
            default:
                return false;
        }
    }
    getNewPeriodStartDate(period, now) {
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
    getPeriodEndDate(period, startDate) {
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
    isSameDay(date1, date2) {
        return (date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate());
    }
    getWeeksDiff(startDate, endDate) {
        const msPerWeek = 7 * 24 * 60 * 60 * 1000;
        return Math.floor((endDate.getTime() - startDate.getTime()) / msPerWeek);
    }
}
exports.BudgetRepository = BudgetRepository;
//# sourceMappingURL=budget.repository.js.map
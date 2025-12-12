import { IBudget, IBudgetWithCategory, IBudgetRequest, IAdjustBudgetAmount } from "../interfaces/budget.interface";
export declare class BudgetRepository {
    createBudget(budgetData: IBudgetRequest): Promise<IBudget>;
    findBudgetById(id: string): Promise<IBudget | null>;
    findBudgetsByAccountId(accountId: string): Promise<IBudgetWithCategory[]>;
    findByAccountAndCategory(accountId: string, categoryId: string): Promise<IBudget | null>;
    updateBudget(id: string, updateData: Partial<IBudget>): Promise<IBudget | null>;
    deleteBudget(id: string): Promise<IBudget | null>;
    adjustBudgetAmount({ accountId, categoryId, amount, type, }: IAdjustBudgetAmount): Promise<void>;
    resetBudgetIfNeeded(budget: IBudget): Promise<IBudget>;
    private shouldResetBudget;
    private getNewPeriodStartDate;
    getPeriodEndDate(period: string, startDate: Date): Date;
    private isSameDay;
    private getWeeksDiff;
}
//# sourceMappingURL=budget.repository.d.ts.map
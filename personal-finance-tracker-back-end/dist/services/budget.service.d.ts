import { ApiResponse } from "../utils/apiResponse";
import { BudgetRepository } from "../repositories/budget.repository";
import { IBudgetRequest } from "../interfaces/budget.interface";
export declare class BudgetService {
    private budgetRepo;
    constructor(budgetRepo?: BudgetRepository);
    createBudget(budgetData: IBudgetRequest): Promise<ApiResponse<null> | ApiResponse<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        accountId: string;
        amount: number;
        categoryId: string;
        period: import(".prisma/client").$Enums.Period;
        limitAmount: number;
        periodStartDate: Date;
    }>>;
    getBudgetById(id: string): Promise<ApiResponse<null> | ApiResponse<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        accountId: string;
        amount: number;
        categoryId: string;
        period: import(".prisma/client").$Enums.Period;
        limitAmount: number;
        periodStartDate: Date;
    }>>;
    getBudgetsByAccountId(accountId: string): Promise<ApiResponse<null> | ApiResponse<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        accountId: string;
        amount: number;
        categoryId: string;
        period: import(".prisma/client").$Enums.Period;
        limitAmount: number;
        periodStartDate: Date;
    }[]>>;
    updateBudget(id: string, updateData: Partial<IBudgetRequest>): Promise<ApiResponse<null> | ApiResponse<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        accountId: string;
        amount: number;
        categoryId: string;
        period: import(".prisma/client").$Enums.Period;
        limitAmount: number;
        periodStartDate: Date;
    }>>;
    deleteBudget(id: string): Promise<ApiResponse<null> | ApiResponse<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        accountId: string;
        amount: number;
        categoryId: string;
        period: import(".prisma/client").$Enums.Period;
        limitAmount: number;
        periodStartDate: Date;
    }>>;
}
//# sourceMappingURL=budget.service.d.ts.map
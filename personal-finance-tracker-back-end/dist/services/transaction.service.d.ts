import { ApiResponse } from "../utils/apiResponse";
import { TransactionRepository } from "../repositories/transaction.repository";
import { BudgetRepository } from "../repositories/budget.repository";
import { ITransactionRequest } from "interfaces/transaction.interface";
import { RuleService } from "./rule.service";
export declare class TransactionService {
    private transactionRepo;
    private budgetRepo;
    private ruleService;
    constructor(transactionRepo?: TransactionRepository, budgetRepo?: BudgetRepository, ruleService?: RuleService);
    createTransaction(transactionData: ITransactionRequest): Promise<ApiResponse<null> | ApiResponse<{
        transaction: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import(".prisma/client").$Enums.TransactionType;
            accountId: string;
            amount: number;
            categoryId: string;
            date: Date;
            description: string;
        };
        budgetStatus: {
            warning: string | null;
            percentage: number;
            spent: number;
            limit: number;
            remaining: number;
            status: "safe" | "warning" | "exceeded";
            periodEnd: Date;
        } | undefined;
    }>>;
    updateTransaction(accountId: string, id: string, updateData: Partial<ITransactionRequest>): Promise<ApiResponse<null> | ApiResponse<{
        transaction: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import(".prisma/client").$Enums.TransactionType;
            accountId: string;
            amount: number;
            categoryId: string;
            date: Date;
            description: string;
        };
        budgetStatus: {
            warning: string | null;
            percentage: number;
            spent: number;
            limit: number;
            remaining: number;
            status: "safe" | "warning" | "exceeded";
            periodEnd: Date;
        } | undefined;
    }>>;
    deleteTransaction(accountId: string, id: string): Promise<ApiResponse<null> | ApiResponse<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.TransactionType;
        accountId: string;
        amount: number;
        categoryId: string;
        date: Date;
        description: string;
    }>>;
    private getBudgetStatus;
    getTransactionById(accountId: string, id: string): Promise<ApiResponse<null> | ApiResponse<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.TransactionType;
        accountId: string;
        amount: number;
        categoryId: string;
        date: Date;
        description: string;
    }>>;
    getTransactionsByAccountId(accountId: string): Promise<ApiResponse<null> | ApiResponse<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.TransactionType;
        accountId: string;
        amount: number;
        categoryId: string;
        date: Date;
        description: string;
    }[]>>;
}
//# sourceMappingURL=transaction.service.d.ts.map
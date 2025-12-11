import { ApiResponse } from "../utils/apiResponse";
import { TransactionRepository } from "../repositories/transaction.repository";
import { BudgetRepository } from "../repositories/budget.repository";
import { ITransactionRequest } from "interfaces/transaction.interface";
export declare class TransactionService {
    private transactionRepo;
    private budgetRepo;
    constructor(transactionRepo?: TransactionRepository, budgetRepo?: BudgetRepository);
    createTransaction(transactionData: ITransactionRequest): Promise<ApiResponse<null> | ApiResponse<{
        transaction: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            accountId: string;
            type: import(".prisma/client").$Enums.TransactionType;
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
    updateTransaction(id: string, updateData: Partial<ITransactionRequest>): Promise<ApiResponse<null> | ApiResponse<{
        transaction: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            accountId: string;
            type: import(".prisma/client").$Enums.TransactionType;
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
    private getBudgetStatus;
    getTransactionById(id: string): Promise<ApiResponse<null> | ApiResponse<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        accountId: string;
        type: import(".prisma/client").$Enums.TransactionType;
        amount: number;
        categoryId: string;
        date: Date;
        description: string;
    }>>;
    getTransactionsByAccountId(accountId: string): Promise<ApiResponse<null> | ApiResponse<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        accountId: string;
        type: import(".prisma/client").$Enums.TransactionType;
        amount: number;
        categoryId: string;
        date: Date;
        description: string;
    }[]>>;
}
//# sourceMappingURL=transaction.service.d.ts.map
import { ApiResponse } from "../utils/apiResponse";
import { TransactionRepository } from "../repositories/transaction.repository";
import { BudgetRepository } from "../repositories/budget.repository";
import { CategoryRepository } from "../repositories/category.repository";
import { ITransactionRequest } from "interfaces/transaction.interface";
import { RuleService } from "./rule.service";
interface ImportFailure {
    rowNumber: number;
    reason: string;
}
interface ImportSummary {
    totalRows: number;
    created: number;
    matchedByRule: number;
    fallbackBanking: number;
    failed: ImportFailure[];
}
export declare class TransactionService {
    private transactionRepo;
    private budgetRepo;
    private ruleService;
    private categoryRepo;
    constructor(transactionRepo?: TransactionRepository, budgetRepo?: BudgetRepository, ruleService?: RuleService, categoryRepo?: CategoryRepository);
    importTransactionsFromCsv(accountId: string, fileBuffer: Buffer): Promise<ApiResponse<null> | ApiResponse<ImportSummary>>;
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
    private getCsvValue;
    private parseCsvAmount;
    private parseCsvDate;
    private resolveCsvType;
    private normalizeText;
}
export {};
//# sourceMappingURL=transaction.service.d.ts.map
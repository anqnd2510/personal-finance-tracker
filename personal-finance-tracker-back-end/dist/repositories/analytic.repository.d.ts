export declare class AnalyticRepository {
    getTotalExpenses(accountId: string, start: Date, end: Date): Promise<number>;
    getTotalIncome(accountId: string, startDate: Date, endDate: Date): Promise<number>;
    getTransactionCount(accountId: string, startDate: Date, endDate: Date): Promise<number>;
    getMonthlyCategoryAnalysis(accountId: string, start: Date, end: Date): Promise<unknown[]>;
}
//# sourceMappingURL=analytic.repository.d.ts.map
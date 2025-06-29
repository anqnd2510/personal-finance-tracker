export interface IOverviewData {
  totalIncome: number;
  totalExpense: number;
  transactionCount: number;
  savingPercentage: number;
}

export interface ICategoryAnalysisResult {
  categoryId: string;
  categoryName: string;
  type: "income" | "expense";
  totalAmount: number;
  transactionCount: number;
}

/**
 * Rule result types
 */
export enum RuleAlertType {
  DANGER = 'danger',
  WARNING = 'warning',
  INFO = 'info',
  SUCCESS = 'success',
  META = 'meta'
}

export interface RuleResult {
  type: RuleAlertType;
  category?: string;
  message: string;
  data?: any;
  action?: string;
}

export interface Rule {
  name: string;
  description: string;
  run: (userId: string) => Promise<RuleResult[]>;
}

export interface FinancialHealthMetrics {
  expenseIncomeRatio: number;
  budgetOverrunCount: number;
  savingsRate: number;
  spendingVariability: number;
  score: number;
}

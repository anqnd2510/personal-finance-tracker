import { BudgetRepository } from "../repositories/budget.repository";
import { TransactionRepository } from "../repositories/transaction.repository";
import { Rule, RuleResult, RuleAlertType } from "./types";
import { IBudgetWithCategory } from "../interfaces/budget.interface";

/**
 * Budget Rules - Monitor budget usage and send warnings
 * 
 * Rules:
 * 1. Red Alert: Spending exceeds 100% of budget
 * 2. Yellow Warning: Spending exceeds 70% of budget
 * 3. Near Limit: Spending exceeds 90% of budget
 */
export const budgetRule: Rule = {
  name: "Budget Monitoring",
  description: "Monitors budget usage and alerts when thresholds are exceeded",
  
  run: async (userId: string): Promise<RuleResult[]> => {
    const warnings: RuleResult[] = [];

    try {
      const budgetRepo = new BudgetRepository();
      const transactionRepo = new TransactionRepository();
      
      const budgets = await budgetRepo.findBudgetsByAccountId(userId);

      for (const budget of budgets) {
        // Get current period spending
        const spent = await transactionRepo.getTotalSpentInPeriod(
          userId,
          budget.categoryId,
          budget.periodStartDate,
          new Date()
        );

        const percentage = (spent / budget.limitAmount) * 100;
        const remaining = budget.limitAmount - spent;

        if (percentage >= 100) {
          warnings.push({
            type: RuleAlertType.DANGER,
            category: budget.category?.name,
            message: `🚨 Bạn đã vượt ngân sách ${budget.category?.name}! Đã chi ${spent.toLocaleString()}đ / ${budget.limitAmount.toLocaleString()}đ (${percentage.toFixed(0)}%)`,
            data: {
              spent,
              limit: budget.limitAmount,
              percentage,
              overspent: spent - budget.limitAmount
            },
            action: "Xem chi tiết chi tiêu"
          });
        } else if (percentage >= 90) {
          warnings.push({
            type: RuleAlertType.WARNING,
            category: budget.category?.name,
            message: `⚠️ Ngân sách ${budget.category?.name} sắp hết! Còn ${remaining.toLocaleString()}đ (${(100 - percentage).toFixed(0)}%)`,
            data: {
              spent,
              limit: budget.limitAmount,
              percentage,
              remaining
            },
            action: "Cân nhắc giảm chi tiêu"
          });
        } else if (percentage >= 70) {
          warnings.push({
            type: RuleAlertType.INFO,
            category: budget.category?.name,
            message: `💡 Bạn đã sử dụng ${percentage.toFixed(0)}% ngân sách ${budget.category?.name}. Còn ${remaining.toLocaleString()}đ`,
            data: {
              spent,
              limit: budget.limitAmount,
              percentage,
              remaining
            }
          });
        }
      }
    } catch (error) {
      console.error("Budget rule error:", error);
    }

    return warnings;
  }
};
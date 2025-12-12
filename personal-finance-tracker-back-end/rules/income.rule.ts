import { TransactionRepository } from "../repositories/transaction.repository";
import { Rule, RuleResult, RuleAlertType } from "./types";

/**
 * Income vs Expense Rule
 * 
 * Rules:
 * 1. Spending exceeds income for 3 consecutive months
 * 2. Income decreased significantly
 * 3. No income detected
 */
export const incomeRule: Rule = {
  name: "Income Monitoring",
  description: "Monitors income patterns and warns about financial risks",
  
  run: async (userId: string): Promise<RuleResult[]> => {
    const alerts: RuleResult[] = [];

    try {
      const transactionRepo = new TransactionRepository();
      const now = new Date();

      // Check last 3 months
      const months: { income: number; expense: number; deficit: boolean }[] = [];

      for (let i = 0; i < 3; i++) {
        const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);

        const income = await transactionRepo.getTotalIncome(userId, monthStart, monthEnd);
        const expense = await transactionRepo.getTotalExpense(userId, monthStart, monthEnd);

        months.push({
          income,
          expense,
          deficit: expense > income
        });
      }

      // Rule 1: Check for 3 consecutive months of deficit
      const consecutiveDeficits = months.every(m => m.deficit);

      if (consecutiveDeficits && months[0].income > 0) {
        const totalDeficit = months.reduce((sum, m) => sum + (m.expense - m.income), 0);
        alerts.push({
          type: RuleAlertType.DANGER,
          message: `🚨 Chi tiêu vượt thu nhập 3 tháng liên tiếp! Tổng thiếu hụt: ${totalDeficit.toLocaleString()}đ`,
          data: {
            months: months.map((m, i) => ({
              month: i,
              income: m.income,
              expense: m.expense,
              deficit: m.expense - m.income
            }))
          },
          action: "Tạo ngân sách khẩn cấp"
        });
      }

      // Rule 2: Income decreased significantly
      if (months.length >= 2) {
        const [current, previous] = months;
        
        if (previous.income > 0) {
          const decrease = ((previous.income - current.income) / previous.income) * 100;

          if (decrease > 30) {
            alerts.push({
              type: RuleAlertType.WARNING,
              message: `📉 Thu nhập giảm ${decrease.toFixed(0)}% so với tháng trước (${current.income.toLocaleString()}đ → ${previous.income.toLocaleString()}đ)`,
              data: {
                currentIncome: current.income,
                previousIncome: previous.income,
                decrease
              },
              action: "Cân nhắc giảm chi tiêu"
            });
          }
        }
      }

      // Rule 3: No income this month
      if (months[0].income === 0 && months[0].expense > 0) {
        alerts.push({
          type: RuleAlertType.WARNING,
          message: `⚠️ Chưa có thu nhập nào được ghi nhận tháng này nhưng đã có chi tiêu ${months[0].expense.toLocaleString()}đ`,
          action: "Thêm nguồn thu nhập"
        });
      }

    } catch (error) {
      console.error("Income rule error:", error);
    }

    return alerts;
  }
};
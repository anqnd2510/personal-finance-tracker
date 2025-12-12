import { TransactionRepository } from "../repositories/transaction.repository";
import { CategoryRepository } from "../repositories/category.repository";
import { Rule, RuleResult, RuleAlertType } from "./types";

/**
 * Spending Behavior Rules - Analyze spending patterns and provide insights
 * 
 * Rules:
 * 1. Overspending Spike: Category spending increased > 30%
 * 2. Saving Opportunity: Total spending decreased > 20%
 * 3. Consistent Spending: Detect potential subscriptions
 */
export const spendingRule: Rule = {
  name: "Spending Behavior Analysis",
  description: "Analyzes spending patterns and provides personalized insights",
  
  run: async (userId: string): Promise<RuleResult[]> => {
    const alerts: RuleResult[] = [];

    try {
      const transactionRepo = new TransactionRepository();
      const categoryRepo = new CategoryRepository();

      // Get current and previous month data
      const now = new Date();
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

      // Rule 1: Check overall monthly spending spike
      const thisMonthTotal = await transactionRepo.getMonthlySpending(userId, currentMonthStart, now);
      const lastMonthTotal = await transactionRepo.getMonthlySpending(userId, lastMonthStart, lastMonthEnd);

      if (lastMonthTotal > 0) {
        const increasePercent = ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;

        if (increasePercent > 30) {
          alerts.push({
            type: RuleAlertType.WARNING,
            message: `📈 Chi tiêu tháng này tăng ${increasePercent.toFixed(0)}% so với tháng trước (${thisMonthTotal.toLocaleString()}đ so với ${lastMonthTotal.toLocaleString()}đ)`,
            data: {
              thisMonth: thisMonthTotal,
              lastMonth: lastMonthTotal,
              increase: increasePercent
            },
            action: "Xem chi tiết để tìm nguyên nhân"
          });
        }
      }

      // Rule 2: Category-level spike detection
      const categories = await categoryRepo.findAllCategories();
      
      for (const category of categories) {
        const thisMonthCat = await transactionRepo.getCategorySpending(
          userId,
          category.id,
          currentMonthStart,
          now
        );
        
        const lastMonthCat = await transactionRepo.getCategorySpending(
          userId,
          category.id,
          lastMonthStart,
          lastMonthEnd
        );

        if (lastMonthCat > 0 && thisMonthCat > 0) {
          const catIncrease = ((thisMonthCat - lastMonthCat) / lastMonthCat) * 100;

          if (catIncrease > 40) {
            alerts.push({
              type: RuleAlertType.INFO,
              category: category.name,
              message: `🔔 Chi tiêu cho "${category.name}" tăng ${catIncrease.toFixed(0)}% so với tháng trước. Bạn có muốn điều chỉnh ngân sách?`,
              data: {
                category: category.name,
                thisMonth: thisMonthCat,
                lastMonth: lastMonthCat,
                increase: catIncrease
              },
              action: "Tạo/Điều chỉnh ngân sách"
            });
          }
        }
      }

      // Rule 3: Saving opportunity detection
      if (lastMonthTotal > 0 && thisMonthTotal > 0) {
        const decreasePercent = ((lastMonthTotal - thisMonthTotal) / lastMonthTotal) * 100;

        if (decreasePercent > 20) {
          const saved = lastMonthTotal - thisMonthTotal;
          alerts.push({
            type: RuleAlertType.SUCCESS,
            message: `🎉 Tuyệt vời! Bạn đã tiết kiệm được ${saved.toLocaleString()}đ (${decreasePercent.toFixed(0)}%) so với tháng trước!`,
            data: {
              saved,
              percentage: decreasePercent
            },
            action: "Chuyển vào tiết kiệm"
          });
        }
      }

      // Rule 4: Detect potential subscriptions (consistent spending)
      const recurringTransactions = await transactionRepo.findRecurringTransactions(userId);
      
      if (recurringTransactions.length > 0) {
        alerts.push({
          type: RuleAlertType.INFO,
          message: `🔄 Phát hiện ${recurringTransactions.length} khoản chi tiêu định kỳ. Bạn có muốn đánh dấu là đăng ký?`,
          data: {
            transactions: recurringTransactions
          },
          action: "Quản lý đăng ký"
        });
      }

    } catch (error) {
      console.error("Spending rule error:", error);
    }

    return alerts;
  }
};
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.budgetRule = void 0;
const budget_repository_1 = require("../repositories/budget.repository");
const transaction_repository_1 = require("../repositories/transaction.repository");
const types_1 = require("./types");
exports.budgetRule = {
    name: "Budget Monitoring",
    description: "Monitors budget usage and alerts when thresholds are exceeded",
    run: async (userId) => {
        const warnings = [];
        try {
            const budgetRepo = new budget_repository_1.BudgetRepository();
            const transactionRepo = new transaction_repository_1.TransactionRepository();
            const budgets = await budgetRepo.findBudgetsByAccountId(userId);
            for (const budget of budgets) {
                const spent = await transactionRepo.getTotalSpentInPeriod(userId, budget.categoryId, budget.periodStartDate, new Date());
                const percentage = (spent / budget.limitAmount) * 100;
                const remaining = budget.limitAmount - spent;
                if (percentage >= 100) {
                    warnings.push({
                        type: types_1.RuleAlertType.DANGER,
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
                }
                else if (percentage >= 90) {
                    warnings.push({
                        type: types_1.RuleAlertType.WARNING,
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
                }
                else if (percentage >= 70) {
                    warnings.push({
                        type: types_1.RuleAlertType.INFO,
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
        }
        catch (error) {
            console.error("Budget rule error:", error);
        }
        return warnings;
    }
};
//# sourceMappingURL=budget.rule.js.map
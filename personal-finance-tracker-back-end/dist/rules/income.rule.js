"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.incomeRule = void 0;
const transaction_repository_1 = require("../repositories/transaction.repository");
const types_1 = require("./types");
exports.incomeRule = {
    name: "Income Monitoring",
    description: "Monitors income patterns and warns about financial risks",
    run: async (userId) => {
        const alerts = [];
        try {
            const transactionRepo = new transaction_repository_1.TransactionRepository();
            const now = new Date();
            const months = [];
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
            const consecutiveDeficits = months.every(m => m.deficit);
            if (consecutiveDeficits && months[0].income > 0) {
                const totalDeficit = months.reduce((sum, m) => sum + (m.expense - m.income), 0);
                alerts.push({
                    type: types_1.RuleAlertType.DANGER,
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
            if (months.length >= 2) {
                const [current, previous] = months;
                if (previous.income > 0) {
                    const decrease = ((previous.income - current.income) / previous.income) * 100;
                    if (decrease > 30) {
                        alerts.push({
                            type: types_1.RuleAlertType.WARNING,
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
            if (months[0].income === 0 && months[0].expense > 0) {
                alerts.push({
                    type: types_1.RuleAlertType.WARNING,
                    message: `⚠️ Chưa có thu nhập nào được ghi nhận tháng này nhưng đã có chi tiêu ${months[0].expense.toLocaleString()}đ`,
                    action: "Thêm nguồn thu nhập"
                });
            }
        }
        catch (error) {
            console.error("Income rule error:", error);
        }
        return alerts;
    }
};
//# sourceMappingURL=income.rule.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthRule = void 0;
const transaction_repository_1 = require("../repositories/transaction.repository");
const budget_repository_1 = require("../repositories/budget.repository");
const types_1 = require("./types");
exports.healthRule = {
    name: "Financial Health Score",
    description: "Calculates overall financial health based on spending patterns",
    run: async (userId) => {
        const alerts = [];
        try {
            const transactionRepo = new transaction_repository_1.TransactionRepository();
            const budgetRepo = new budget_repository_1.BudgetRepository();
            const now = new Date();
            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
            const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
            const totalIncome = await transactionRepo.getTotalIncome(userId, monthStart, now);
            const totalExpense = await transactionRepo.getTotalExpense(userId, monthStart, now);
            let expenseIncomeScore = 0;
            let expenseIncomeRatio = 0;
            if (totalIncome > 0) {
                expenseIncomeRatio = (totalExpense / totalIncome) * 100;
                if (expenseIncomeRatio <= 50)
                    expenseIncomeScore = 30;
                else if (expenseIncomeRatio <= 70)
                    expenseIncomeScore = 25;
                else if (expenseIncomeRatio <= 90)
                    expenseIncomeScore = 15;
                else if (expenseIncomeRatio <= 100)
                    expenseIncomeScore = 5;
                else
                    expenseIncomeScore = 0;
            }
            const budgets = await budgetRepo.findBudgetsByAccountId(userId);
            let budgetScore = 0;
            let budgetOverrunCount = 0;
            if (budgets.length > 0) {
                let withinBudgetCount = 0;
                for (const budget of budgets) {
                    const spent = await transactionRepo.getTotalSpentInPeriod(userId, budget.categoryId, budget.periodStartDate, now);
                    if (spent <= budget.limitAmount) {
                        withinBudgetCount++;
                    }
                    else {
                        budgetOverrunCount++;
                    }
                }
                const adherenceRate = (withinBudgetCount / budgets.length) * 100;
                if (adherenceRate >= 90)
                    budgetScore = 25;
                else if (adherenceRate >= 75)
                    budgetScore = 20;
                else if (adherenceRate >= 50)
                    budgetScore = 15;
                else if (adherenceRate >= 25)
                    budgetScore = 10;
                else
                    budgetScore = 5;
            }
            else {
                budgetScore = 10;
            }
            const savingsAmount = totalIncome - totalExpense;
            let savingsScore = 0;
            let savingsRate = 0;
            if (totalIncome > 0) {
                savingsRate = (savingsAmount / totalIncome) * 100;
                if (savingsRate >= 30)
                    savingsScore = 25;
                else if (savingsRate >= 20)
                    savingsScore = 20;
                else if (savingsRate >= 10)
                    savingsScore = 15;
                else if (savingsRate >= 5)
                    savingsScore = 10;
                else if (savingsRate > 0)
                    savingsScore = 5;
                else
                    savingsScore = 0;
            }
            const monthlySpending = await transactionRepo.getMonthlySpendingHistory(userId, threeMonthsAgo, now);
            let consistencyScore = 0;
            let spendingVariability = 0;
            if (monthlySpending.length >= 2) {
                const amounts = monthlySpending.map(m => m.total);
                const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length;
                const variance = amounts.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / amounts.length;
                const stdDev = Math.sqrt(variance);
                spendingVariability = avg > 0 ? (stdDev / avg) * 100 : 0;
                if (spendingVariability <= 15)
                    consistencyScore = 20;
                else if (spendingVariability <= 30)
                    consistencyScore = 15;
                else if (spendingVariability <= 50)
                    consistencyScore = 10;
                else
                    consistencyScore = 5;
            }
            else {
                consistencyScore = 15;
            }
            const totalScore = expenseIncomeScore + budgetScore + savingsScore + consistencyScore;
            let healthMessage = "";
            let healthType = types_1.RuleAlertType.META;
            if (totalScore >= 80) {
                healthMessage = `🌟 Xuất sắc! Điểm tài chính: ${totalScore}/100. Bạn đang quản lý tài chính rất tốt!`;
                healthType = types_1.RuleAlertType.SUCCESS;
            }
            else if (totalScore >= 60) {
                healthMessage = `✅ Tốt! Điểm tài chính: ${totalScore}/100. Đang trên đà phát triển tích cực.`;
                healthType = types_1.RuleAlertType.SUCCESS;
            }
            else if (totalScore >= 40) {
                healthMessage = `⚠️ Trung bình. Điểm tài chính: ${totalScore}/100. Cần cải thiện một số khía cạnh.`;
                healthType = types_1.RuleAlertType.WARNING;
            }
            else {
                healthMessage = `🚨 Cần chú ý! Điểm tài chính: ${totalScore}/100. Hãy xem xét lại kế hoạch tài chính.`;
                healthType = types_1.RuleAlertType.DANGER;
            }
            const metrics = {
                expenseIncomeRatio,
                budgetOverrunCount,
                savingsRate,
                spendingVariability,
                score: totalScore
            };
            alerts.push({
                type: healthType,
                message: healthMessage,
                data: {
                    score: totalScore,
                    breakdown: {
                        expenseIncome: { score: expenseIncomeScore, max: 30, ratio: expenseIncomeRatio },
                        budgetAdherence: { score: budgetScore, max: 25, overruns: budgetOverrunCount },
                        savings: { score: savingsScore, max: 25, rate: savingsRate },
                        consistency: { score: consistencyScore, max: 20, variability: spendingVariability }
                    },
                    metrics
                }
            });
            if (expenseIncomeRatio > 90) {
                alerts.push({
                    type: types_1.RuleAlertType.DANGER,
                    message: `💰 Chi tiêu đang chiếm ${expenseIncomeRatio.toFixed(0)}% thu nhập. Cần giảm chi tiêu hoặc tăng thu nhập!`,
                    action: "Xem chi tiết chi tiêu"
                });
            }
            if (budgetOverrunCount >= 3) {
                alerts.push({
                    type: types_1.RuleAlertType.WARNING,
                    message: `📊 Bạn đã vượt ngân sách ở ${budgetOverrunCount} hạng mục. Hãy xem xét điều chỉnh ngân sách hoặc cắt giảm chi tiêu.`,
                    action: "Quản lý ngân sách"
                });
            }
            if (savingsRate < 10 && totalIncome > 0) {
                alerts.push({
                    type: types_1.RuleAlertType.INFO,
                    message: `💡 Tỷ lệ tiết kiệm của bạn là ${savingsRate.toFixed(1)}%. Mục tiêu nên đạt ít nhất 10-20% thu nhập.`,
                    action: "Tạo kế hoạch tiết kiệm"
                });
            }
        }
        catch (error) {
            console.error("Health rule error:", error);
            alerts.push({
                type: types_1.RuleAlertType.META,
                message: "⚙️ Không thể tính điểm tài chính. Cần thêm dữ liệu giao dịch."
            });
        }
        return alerts;
    }
};
//# sourceMappingURL=health.rule.js.map
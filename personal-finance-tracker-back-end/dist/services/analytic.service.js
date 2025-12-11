"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticService = void 0;
const analytic_repository_1 = require("../repositories/analytic.repository");
const period_enum_1 = require("../constants/period.enum");
const apiResponse_1 = require("../utils/apiResponse");
const httpStatus_1 = require("../constants/httpStatus");
class AnalyticService {
    constructor(analyticRepo = new analytic_repository_1.AnalyticRepository()) {
        this.analyticRepo = analyticRepo;
    }
    async getOverviewData(accountId, period, customDate) {
        try {
            const targetDate = customDate || new Date();
            const { startDate, endDate } = this.getStartAndEndDate(period, targetDate);
            const [totalIncome, totalExpense, transactionCount] = await Promise.all([
                this.analyticRepo.getTotalIncome(accountId, startDate, endDate),
                this.analyticRepo.getTotalExpenses(accountId, startDate, endDate),
                this.analyticRepo.getTransactionCount(accountId, startDate, endDate),
            ]);
            const savingPercentage = totalIncome > 0
                ? ((totalIncome - totalExpense) / totalIncome) * 100
                : 0;
            const data = {
                totalIncome,
                totalExpense,
                transactionCount,
                savingPercentage: parseFloat(savingPercentage.toFixed(2)),
            };
            return apiResponse_1.ApiResponse.success(data, "Overview data retrieved successfully", httpStatus_1.HTTP_STATUS.OK);
        }
        catch (error) {
            console.error("Error in getOverviewData method:", error);
            return apiResponse_1.ApiResponse.error("Failed to retrieve overview data", httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }
    async getCategoryAnalysis(accountId, period, customDate) {
        try {
            const date = customDate || new Date();
            const { startDate, endDate } = this.getStartAndEndDate(period, date);
            const rawResult = await this.analyticRepo.getMonthlyCategoryAnalysis(accountId, startDate, endDate);
            const formatted = rawResult.map((item) => ({
                categoryId: item._id.categoryId.toString(),
                categoryName: item._id.categoryName,
                type: item._id.type,
                totalAmount: item.totalAmount,
                transactionCount: item.transactionCount,
            }));
            return apiResponse_1.ApiResponse.success(formatted, `Category analysis retrieved for period: ${period}`, httpStatus_1.HTTP_STATUS.OK);
        }
        catch (error) {
            console.error("Error in getCategoryAnalysisByPeriod:", error);
            return apiResponse_1.ApiResponse.error("Failed to retrieve category analysis", httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }
    getStartAndEndDate(period, date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        switch (period) {
            case period_enum_1.Period.Day: {
                const startDate = new Date(year, month, day, 0, 0, 0, 0);
                const endDate = new Date(year, month, day, 23, 59, 59, 999);
                return { startDate, endDate };
            }
            case period_enum_1.Period.Week: {
                const dayOfWeek = date.getDay();
                const diffToMonday = (dayOfWeek + 6) % 7;
                const monday = new Date(date);
                monday.setDate(day - diffToMonday);
                monday.setHours(0, 0, 0, 0);
                const sunday = new Date(monday);
                sunday.setDate(monday.getDate() + 6);
                sunday.setHours(23, 59, 59, 999);
                return { startDate: monday, endDate: sunday };
            }
            case period_enum_1.Period.Month: {
                const startDate = new Date(year, month, 1);
                const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);
                return { startDate, endDate };
            }
            case period_enum_1.Period.Year: {
                const startDate = new Date(year, 0, 1);
                const endDate = new Date(year, 11, 31, 23, 59, 59, 999);
                return { startDate, endDate };
            }
            default:
                throw new Error("Invalid period");
        }
    }
}
exports.AnalyticService = AnalyticService;
//# sourceMappingURL=analytic.service.js.map
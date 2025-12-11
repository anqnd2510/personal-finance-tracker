import {
  IOverviewData,
  ICategoryAnalysisResult,
} from "../interfaces/analytic.interface";
import { AnalyticRepository } from "../repositories/analytic.repository";
import { Period } from "../constants/period.enum";
import { ApiResponse } from "../utils/apiResponse";
import { HTTP_STATUS } from "../constants/httpStatus";

export class AnalyticService {
  constructor(private analyticRepo = new AnalyticRepository()) {}

  /**
   * Gets an overview of the account's financial data.
   * @param {string} accountId - The ID of the account.
   * @param {Period} period - Period to summarize (week, month, year).
   * @param {Date} [customDate] - Optional custom date (default is now).
   * @returns {Promise<ApiResponse>} - ApiResponse with overview data.
   *  @throws {Error} - If an error occurs while retrieving data.
   */
  async getOverviewData(
    accountId: string,
    period: Period,
    customDate?: Date
  ): Promise<ApiResponse<IOverviewData | null>> {
    try {
      const targetDate = customDate || new Date();
      const { startDate, endDate } = this.getStartAndEndDate(
        period,
        targetDate
      );

      const [totalIncome, totalExpense, transactionCount] = await Promise.all([
        this.analyticRepo.getTotalIncome(accountId, startDate, endDate),
        this.analyticRepo.getTotalExpenses(accountId, startDate, endDate),
        this.analyticRepo.getTransactionCount(accountId, startDate, endDate),
      ]);

      const savingPercentage =
        totalIncome > 0
          ? ((totalIncome - totalExpense) / totalIncome) * 100
          : 0;

      const data: IOverviewData = {
        totalIncome,
        totalExpense,
        transactionCount,
        savingPercentage: parseFloat(savingPercentage.toFixed(2)),
      };

      return ApiResponse.success(
        data,
        "Overview data retrieved successfully",
        HTTP_STATUS.OK
      );
    } catch (error) {
      console.error("Error in getOverviewData method:", error);
      return ApiResponse.error(
        "Failed to retrieve overview data",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }
  /**
   * Gets an overview of the account's financial data.
   * @param {string} accountId - The ID of the account.
   * @param {Period} period - Period to summarize (week, month, year).
   * @param {Date} [customDate] - Optional custom date (default is now).
   * @returns {Promise<ApiResponse>} - ApiResponse with overview data.
   * @throws {Error} - If an error occurs while retrieving data.
   */
  async getCategoryAnalysis(
    accountId: string,
    period: Period,
    customDate?: Date
  ): Promise<ApiResponse<ICategoryAnalysisResult[] | null>> {
    try {
      const date = customDate || new Date();
      const { startDate, endDate } = this.getStartAndEndDate(period, date);

      const rawResult = await this.analyticRepo.getMonthlyCategoryAnalysis(
        accountId,
        startDate,
        endDate
      );
      const formatted: ICategoryAnalysisResult[] = rawResult.map((item: any) => ({
        categoryId: item._id.categoryId.toString(),
        categoryName: item._id.categoryName,
        type: item._id.type,
        totalAmount: item.totalAmount,
        transactionCount: item.transactionCount,
      }));
      return ApiResponse.success(
        formatted,
        `Category analysis retrieved for period: ${period}`,
        HTTP_STATUS.OK
      );
    } catch (error) {
      console.error("Error in getCategoryAnalysisByPeriod:", error);
      return ApiResponse.error(
        "Failed to retrieve category analysis",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  private getStartAndEndDate(
    period: Period,
    date: Date
  ): { startDate: Date; endDate: Date } {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    switch (period) {
      case Period.Day: {
        const startDate = new Date(year, month, day, 0, 0, 0, 0);
        const endDate = new Date(year, month, day, 23, 59, 59, 999);
        return { startDate, endDate };
      }
      case Period.Week: {
        const dayOfWeek = date.getDay(); // 0 (Sun) - 6 (Sat)
        const diffToMonday = (dayOfWeek + 6) % 7;
        const monday = new Date(date);
        monday.setDate(day - diffToMonday);
        monday.setHours(0, 0, 0, 0);

        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        sunday.setHours(23, 59, 59, 999);

        return { startDate: monday, endDate: sunday };
      }

      case Period.Month: {
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);
        return { startDate, endDate };
      }

      case Period.Year: {
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31, 23, 59, 59, 999);
        return { startDate, endDate };
      }

      default:
        throw new Error("Invalid period");
    }
  }
}

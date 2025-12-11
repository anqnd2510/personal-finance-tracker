import { IOverviewData, ICategoryAnalysisResult } from "../interfaces/analytic.interface";
import { AnalyticRepository } from "../repositories/analytic.repository";
import { Period } from "../constants/period.enum";
import { ApiResponse } from "../utils/apiResponse";
export declare class AnalyticService {
    private analyticRepo;
    constructor(analyticRepo?: AnalyticRepository);
    getOverviewData(accountId: string, period: Period, customDate?: Date): Promise<ApiResponse<IOverviewData | null>>;
    getCategoryAnalysis(accountId: string, period: Period, customDate?: Date): Promise<ApiResponse<ICategoryAnalysisResult[] | null>>;
    private getStartAndEndDate;
}
//# sourceMappingURL=analytic.service.d.ts.map
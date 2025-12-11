"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoryAnalysisByPeriod = exports.getAnalyticsOverview = void 0;
const analytic_service_1 = require("../services/analytic.service");
const period_enum_1 = require("../constants/period.enum");
const service = new analytic_service_1.AnalyticService();
const getAnalyticsOverview = async (req, res, next) => {
    try {
        const userId = req.account?.accountId;
        if (!userId) {
            res.status(401).json({ message: "User not authenticated" });
            return;
        }
        const periodParam = req.query.period.toLowerCase() || "month";
        const dateParam = req.query.dateas;
        const period = Object.values(period_enum_1.Period).includes(periodParam)
            ? periodParam
            : period_enum_1.Period.Month;
        const customDate = dateParam ? new Date(dateParam) : undefined;
        const response = await service.getOverviewData(userId, period, customDate);
        res.status(response.statusCode).json(response);
    }
    catch (err) {
        next(err);
    }
};
exports.getAnalyticsOverview = getAnalyticsOverview;
const getCategoryAnalysisByPeriod = async (req, res, next) => {
    try {
        const userId = req.account?.accountId;
        if (!userId) {
            res.status(401).json({ message: "User not authenticated" });
            return;
        }
        const periodParam = req.query.period.toLowerCase() || "month";
        const dateParam = req.query.dateas;
        const period = Object.values(period_enum_1.Period).includes(periodParam)
            ? periodParam
            : period_enum_1.Period.Month;
        const customDate = dateParam ? new Date(dateParam) : undefined;
        const response = await service.getCategoryAnalysis(userId, period, customDate);
        res.status(response.statusCode).json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.getCategoryAnalysisByPeriod = getCategoryAnalysisByPeriod;
//# sourceMappingURL=analytic.controller.js.map
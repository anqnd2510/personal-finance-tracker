"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHealthStatus = void 0;
const database_1 = require("../config/database");
const redis_1 = require("../config/redis");
const apiResponse_1 = require("../utils/apiResponse");
const httpStatus_1 = require("../constants/httpStatus");
const getHealthStatus = async (_req, res) => {
    const startedAt = Date.now();
    try {
        const databaseHealthy = await database_1.prisma
            .$queryRawUnsafe("SELECT 1")
            .then(() => true)
            .catch(() => false);
        const redisHealthy = await (0, redis_1.checkRedisHealth)();
        const isHealthy = databaseHealthy && redisHealthy;
        const statusCode = isHealthy
            ? httpStatus_1.HTTP_STATUS.OK
            : httpStatus_1.HTTP_STATUS.SERVICE_UNAVAILABLE;
        res.status(statusCode).json(apiResponse_1.ApiResponse.success({
            status: isHealthy ? "healthy" : "unhealthy",
            services: {
                api: true,
                database: databaseHealthy,
                redis: redisHealthy,
            },
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            responseTimeMs: Date.now() - startedAt,
        }, isHealthy
            ? "Health check completed successfully"
            : "One or more services are unhealthy", statusCode));
    }
    catch (error) {
        res.status(httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json(apiResponse_1.ApiResponse.error(`Failed to retrieve health status: ${error.message}`, httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
};
exports.getHealthStatus = getHealthStatus;
//# sourceMappingURL=health.controller.js.map
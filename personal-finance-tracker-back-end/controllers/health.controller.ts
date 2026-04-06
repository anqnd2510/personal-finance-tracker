import { Request, Response } from "express";
import { prisma } from "../config/database";
import { checkRedisHealth } from "../config/redis";
import { ApiResponse } from "../utils/apiResponse";
import { HTTP_STATUS } from "../constants/httpStatus";

export const getHealthStatus = async (
	_req: Request,
	res: Response
): Promise<void> => {
	const startedAt = Date.now();

	try {
		const databaseHealthy = await prisma
			.$queryRawUnsafe("SELECT 1")
			.then(() => true)
			.catch(() => false);

		const redisHealthy = await checkRedisHealth();
		const isHealthy = databaseHealthy && redisHealthy;

		const statusCode = isHealthy
			? HTTP_STATUS.OK
			: HTTP_STATUS.SERVICE_UNAVAILABLE;

		res.status(statusCode).json(
			ApiResponse.success(
				{
					status: isHealthy ? "healthy" : "unhealthy",
					services: {
						api: true,
						database: databaseHealthy,
						redis: redisHealthy,
					},
					timestamp: new Date().toISOString(),
					uptime: process.uptime(),
					responseTimeMs: Date.now() - startedAt,
				},
				isHealthy
					? "Health check completed successfully"
					: "One or more services are unhealthy",
				statusCode
			)
		);
	} catch (error) {
		res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
			ApiResponse.error(
				`Failed to retrieve health status: ${(error as Error).message}`,
				HTTP_STATUS.INTERNAL_SERVER_ERROR
			)
		);
	}
};

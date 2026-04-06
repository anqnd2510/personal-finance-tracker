import { Router } from "express";
import { getHealthStatus } from "../controllers/health.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Health
 *   description: Service health checks
 */
/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Check API, database, and redis health status
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: All services are healthy
 *       503:
 *         description: One or more services are unhealthy
 */
router.get("/", getHealthStatus);

export default router;

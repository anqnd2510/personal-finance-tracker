import { Router } from "express";
import * as analyticController from "../controllers/analytic.controller";
import { authenticate } from "../middlewares/authenticate";
const router = Router();
/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: API for retrieving financial analytics
 */

/**
 * @swagger
 * /api/analytics/overview:
 *   get:
 *     summary: Get financial overview for a specific period
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         required: false
 *         schema:
 *           type: string
 *           enum: [day, week, month, year]
 *           default: month
 *         description: Time period to analyze (week, month, or year)
 *       - in: query
 *         name: date
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *           example: 2025-06-25
 *         description: Custom date to calculate the period from
 *     responses:
 *       200:
 *         description: Overview data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalIncome:
 *                       type: number
 *                       example: 10000000
 *                     totalExpense:
 *                       type: number
 *                       example: 7500000
 *                     transactionCount:
 *                       type: number
 *                       example: 12
 *                     savingPercentage:
 *                       type: number
 *                       example: 25
 *                 message:
 *                   type: string
 *                   example: Overview data retrieved successfully
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User not authenticated
 *                 statusCode:
 *                   type: number
 *                   example: 401
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 *                 statusCode:
 *                   type: number
 *                   example: 500
 */
router.get("/overview", authenticate, analyticController.getAnalyticsOverview);
/**
 * @swagger
 * /api/analytics/category-analysis:
 *   get:
 *     summary: Get financial analysis by category for a given period
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         required: false
 *         schema:
 *           type: string
 *           enum: [day, week, month, year]
 *           default: month
 *         description: Time period to analyze (week, month, or year)
 *       - in: query
 *         name: date
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *           example: 2025-06-25
 *         description: Optional date to calculate the range from
 *     responses:
 *       200:
 *         description: Category analysis retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Category analysis retrieved for period: month"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       categoryId:
 *                         type: string
 *                         format: objectId
 *                         example: "665f3c54fabcde7890ab1234"
 *                       categoryName:
 *                         type: string
 *                         example: "Food & Drinks"
 *                       type:
 *                         type: string
 *                         enum: [income, expense]
 *                         example: "expense"
 *                       totalAmount:
 *                         type: number
 *                         example: 3000000
 *                       transactionCount:
 *                         type: number
 *                         example: 5
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *       401:
 *         description: Unauthorized - JWT token missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "User not authenticated"
 *                 statusCode:
 *                   type: number
 *                   example: 401
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Failed to retrieve category analysis"
 *                 statusCode:
 *                   type: number
 *                   example: 500
 */
router.get(
  "/category-analysis",
  authenticate,
  analyticController.getCategoryAnalysisByPeriod
);

export default router;

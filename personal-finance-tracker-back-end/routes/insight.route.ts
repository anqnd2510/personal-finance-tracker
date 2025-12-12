import { Router } from "express";
import { RuleController } from "../controllers/insight.controller";
import { authenticate } from "../middlewares/authenticate";

const router = Router();
const controller = new RuleController();

/**
 * @swagger
 * tags:
 *   name: Insights
 *   description: Financial insights and alerts based on spending patterns
 */

/**
 * @swagger
 * /api/insights:
 *   get:
 *     summary: Get all financial insights and alerts
 *     tags: [Insights]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Insights retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     insights:
 *                       type: array
 *                       items:
 *                         type: object
 *                     count:
 *                       type: integer
 */
router.get("/", authenticate, controller.getInsights);

/**
 * @swagger
 * /api/insights/rules:
 *   get:
 *     summary: Get list of available rules
 *     tags: [Insights]
 *     responses:
 *       200:
 *         description: Rules retrieved successfully
 */
router.get("/rules", controller.getRules);

/**
 * @swagger
 * /api/insights/rules/{ruleName}:
 *   get:
 *     summary: Run a specific rule
 *     tags: [Insights]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ruleName
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rule executed successfully
 *       404:
 *         description: Rule not found
 */
router.get("/rules/:ruleName", authenticate, controller.runSpecificRule);

export default router;
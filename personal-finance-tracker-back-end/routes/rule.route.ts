import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import * as ruleController from "../controllers/rule.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Rules
 *   description: User-defined automation rules for transaction categorization
 */

/**
 * @swagger
 * /api/rules/create-rule:
 *   post:
 *     summary: Create a new rule for the authenticated user
 *     tags: [Rules]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RuleCreateRequest'
 *     responses:
 *       201:
 *         description: Rule created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RuleResponse'
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */
router.post("/create-rule", authenticate, ruleController.createRule);

/**
 * @swagger
 * /api/rules:
 *   get:
 *     summary: Get all rules of the authenticated user
 *     tags: [Rules]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Rules retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 isSuccess:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Rules retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/RuleData'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/", authenticate, ruleController.getMyRules);

/**
 * @swagger
 * /api/rules/{id}:
 *   put:
 *     summary: Update a rule owned by the authenticated user
 *     tags: [Rules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Rule ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RuleUpdateRequest'
 *     responses:
 *       200:
 *         description: Rule updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RuleResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Rule or category not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", authenticate, ruleController.updateRule);

/**
 * @swagger
 * /api/rules/{id}:
 *   delete:
 *     summary: Delete a rule owned by the authenticated user
 *     tags: [Rules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Rule ID
 *     responses:
 *       200:
 *         description: Rule deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RuleResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Rule not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", authenticate, ruleController.deleteRule);

/**
 * @swagger
 * components:
 *   schemas:
 *     RuleCreateRequest:
 *       type: object
 *       required:
 *         - name
 *         - descriptionContains
 *         - categoryId
 *       properties:
 *         name:
 *           type: string
 *           example: Shopee Shopping Rule
 *         descriptionContains:
 *           type: string
 *           example: Shopee
 *         categoryId:
 *           type: string
 *           format: uuid
 *           example: f9f4048e-a445-4fb0-8614-eeb77f364ed1
 *         priority:
 *           type: integer
 *           example: 200
 *           description: Higher priority wins when multiple rules match
 *         isActive:
 *           type: boolean
 *           example: true
 *
 *     RuleUpdateRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Updated Shopping Rule
 *         descriptionContains:
 *           type: string
 *           example: Lazada
 *         categoryId:
 *           type: string
 *           format: uuid
 *           example: f9f4048e-a445-4fb0-8614-eeb77f364ed1
 *         priority:
 *           type: integer
 *           example: 150
 *         isActive:
 *           type: boolean
 *           example: false
 *
 *     RuleData:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         accountId:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         descriptionContains:
 *           type: string
 *         categoryId:
 *           type: string
 *           format: uuid
 *         priority:
 *           type: integer
 *         isActive:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     RuleResponse:
 *       type: object
 *       properties:
 *         statusCode:
 *           type: integer
 *           example: 200
 *         isSuccess:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Rule updated successfully
 *         data:
 *           $ref: '#/components/schemas/RuleData'
 */

export default router;

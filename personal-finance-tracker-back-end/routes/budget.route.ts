import { Router } from "express";
import * as budgetController from "../controllers/budget.controller";
import { authenticate } from "../middlewares/authenticate";
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Budgets
 *   description: API for managing user budgets
 */

/**
 * @swagger
 * /api/budgets/create-budget:
 *   post:
 *     summary: Create a new budget
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BudgetCreateRequest'
 *     responses:
 *       201:
 *         description: Budget created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BudgetResponse'
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: User not authenticated
 *       500:
 *         description: Internal server error
 */
router.post("/create-budget", authenticate, budgetController.createBudget);

/**
 * @swagger
 * /api/budgets:
 *   get:
 *     summary: Get all budgets for the current account
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Budgets retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BudgetResponse'
 *       401:
 *         description: User not authenticated
 *       500:
 *         description: Internal server error
 */
router.get("/", authenticate, budgetController.getBudgetsByAccountId);

/**
 * @swagger
 * /api/budgets/{id}:
 *   get:
 *     summary: Get a budget by ID
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the budget
 *     responses:
 *       200:
 *         description: Budget retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BudgetResponse'
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: Budget not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", authenticate, budgetController.getBudgetById);

/**
 * @swagger
 * /api/budgets/update-budget:
 *   put:
 *     summary: Update a budget
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BudgetUpdateRequest'
 *     responses:
 *       200:
 *         description: Budget updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BudgetResponse'
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: Budget not found
 *       500:
 *         description: Internal server error
 */
router.put("/update-budget", authenticate, budgetController.updateBudget);

/**
 * @swagger
 * /api/budgets/delete-budget/{id}:
 *   delete:
 *     summary: Delete a budget by ID
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Budget ID to delete
 *     responses:
 *       200:
 *         description: Budget deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Budget deleted successfully"
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: Budget not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  "/delete-budget/:id",
  authenticate,
  budgetController.deleteBudget
);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     BudgetCreateRequest:
 *       type: object
 *       required:
 *         - categoryId
 *         - limitAmount
 *         - period
 *       properties:
 *         categoryId:
 *           type: string
 *           format: objectId
 *           description: The ID of the category to assign the budget to
 *           example: "665b987654321fedcba9876"
 *         limitAmount:
 *           type: number
 *           minimum: 1
 *           description: The spending limit for this budget
 *           example: 1000000
 *         period:
 *           type: string
 *           description: Time period for budget reset
 *           enum: [daily, weekly, monthly, yearly]
 *           example: "monthly"
 *
 *     BudgetUpdateRequest:
 *       type: object
 *       properties:
 *         budgetId:
 *           type: string
 *           format: objectId
 *           description: The ID of the budget to update
 *           example: "665e123456789abcdefabcd"
 *         categoryId:
 *           type: string
 *           format: objectId
 *           description: The ID of the category to assign the budget to
 *           example: "665b987654321fedcba9876"
 *         limitAmount:
 *           type: number
 *           minimum: 1
 *           description: The spending limit for this budget
 *           example: 1000000
 *         period:
 *           type: string
 *           description: Time period for budget reset
 *           enum: [daily, weekly, monthly, yearly]
 *           example: "monthly"
 *
 *     BudgetResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           format: objectId
 *           description: Budget ID
 *           example: "665e123456789abcdefabcd"
 *         accountId:
 *           type: string
 *           format: objectId
 *           description: Account ID that owns this budget
 *           example: "665a123456789abcdef1234"
 *         categoryId:
 *           type: string
 *           format: objectId
 *           description: Category ID this budget is assigned to
 *           example: "665b987654321fedcba9876"
 *         amount:
 *           type: number
 *           minimum: 0
 *           description: Current amount spent/earned in this budget period
 *           example: 300000
 *         limitAmount:
 *           type: number
 *           minimum: 1
 *           description: The spending limit for this budget
 *           example: 1000000
 *         period:
 *           type: string
 *           enum: [daily, weekly, monthly, yearly]
 *           description: Time period for budget reset
 *           example: "monthly"
 *         periodStartDate:
 *           type: string
 *           format: date-time
 *           description: Start date of the current budget period
 *           example: "2025-06-01T00:00:00.000Z"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Budget creation timestamp
 *           example: "2025-06-21T15:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Budget last update timestamp
 *           example: "2025-06-21T15:30:00.000Z"
 *
 *     ApiResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Indicates if the request was successful
 *           example: true
 *         message:
 *           type: string
 *           description: Response message
 *           example: "Budget created successfully"
 *         data:
 *           type: object
 *           description: Response data
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Always false for error responses
 *           example: false
 *         message:
 *           type: string
 *           description: Error message
 *           example: "Budget not found"
 *         error:
 *           type: string
 *           description: Detailed error information
 *           example: "Budget with ID 665e123456789abcdefabcd does not exist"
 *
 *     ValidationError:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Validation failed"
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *                 example: "limitAmount"
 *               message:
 *                 type: string
 *                 example: "Limit amount must be greater than 0"
 */

export default router;

import e, { Router } from "express";
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BudgetRequest'
 *     responses:
 *       201:
 *         description: Budget created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BudgetResponse'
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
 */
router.get("/", authenticate, budgetController.getBudgetsByAccountId);
/**
 * @swagger
 * /api/budgets/{id}:
 *   get:
 *     summary: Get a budget by ID
 *     tags: [Budgets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectId
 *         description: The ID of the budget to retrieve
 *     responses:
 *       200:
 *         description: Budget retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BudgetResponse'
 *       404:
 *         description: Budget not found
 */
router.get("/:id", budgetController.getBudgetById);

/**
 * @swagger
 * /api/budgets/update-budget:
 *   put:
 *     summary: Update an existing budget
 *     tags: [Budgets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BudgetRequest'
 *     responses:
 *       200:
 *         description: Budget updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BudgetResponse'
 *       404:
 *         description: Budget not found
 */
router.put("/update-budget", authenticate, budgetController.updateBudget);

/**
 * @swagger
 * /api/budgets/delete-budget/{id}:
 *   delete:
 *     summary: Delete a budget by ID
 *     tags: [Budgets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectId
 *         description: The ID of the budget to delete
 *     responses:
 *       200:
 *         description: Budget deleted successfully
 *       404:
 *         description: Budget not found
 */
router.delete(
  "/delete-budget/:id",
  authenticate,
  budgetController.deleteBudget
);

/**
 * @swagger
 * components:
 *   schemas:
 *     BudgetRequest:
 *       type: object
 *       required:
 *         - categoryId
 *         - startDate
 *         - endDate
 *       properties:
 *         categoryId:
 *           type: string
 *           format: ObjectId
 *         startDate:
 *           type: string
 *           format: date
 *         endDate:
 *           type: string
 *           format: date
 *         limitAmount:
 *           type: number
 *           default: 0
 *     BudgetResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/BudgetRequest'
 *         - type: object
 *           properties:
 *             _id:
 *               type: string
 *             accountId:
 *               type: string
 *               format: ObjectId
 *             createdAt:
 *               type: string
 *               format: date-time
 *             updatedAt:
 *               type: string
 *               format: date-time
 */

export default router;

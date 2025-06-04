import { Router } from "express";
import * as transactionController from "../controllers/transaction.controller";
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: API for managing user transactions
 */

/**
 * @swagger
 * /api/transactions/create-transaction:
 *   post:
 *     summary: Create a new transaction
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accountId
 *               - amount
 *               - type
 *               - category
 *               - date
 *             properties:
 *               accountId:
 *                 type: string
 *                 format: uuid
 *                 example: 60f6c2d5e1b4e927dcd12345
 *               amount:
 *                 type: number
 *                 example: 100000
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *                 example: income
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *                 example: 60f6c2d5e1b4e927dcd12345
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2025-06-01
 *               description:
 *                 type: string
 *                 example: Monthly salary
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post("/create-transaction", transactionController.createTransaction);
/**
 * @swagger
 * /api/transactions/{id}:
 *   get:
 *     summary: Get a transaction by ID
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the transaction to retrieve
 *     responses:
 *       200:
 *         description: Transaction retrieved successfully
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", transactionController.getTransactionById);
export default router;

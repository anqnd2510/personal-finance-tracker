import { Router } from "express";
import * as transactionController from "../controllers/transaction.controller";
import { authenticate } from "../middlewares/authenticate";
import multer from "multer";
const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

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
router.post(
  "/create-transaction",
  authenticate,
  transactionController.createTransaction
);

/**
 * @swagger
 * /api/transactions/import-csv:
 *   post:
 *     summary: Import multiple transactions from CSV
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: CSV file with transaction rows
 *     responses:
 *       200:
 *         description: CSV import completed
 *       400:
 *         description: Invalid CSV file or missing required fields
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post(
  "/import-csv",
  authenticate,
  upload.single("file"),
  transactionController.importTransactionsFromCsv
);
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
router.get("/:id", authenticate, transactionController.getTransactionById);

/**
 * @swagger
 * /api/transactions/update-transaction/{id}:
 *   put:
 *     summary: Update a transaction by ID
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the transaction to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 150000
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *                 example: expense
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *                 example: 60f6c2d5e1b4e927dcd12345
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2025-06-15
 *               description:
 *                 type: string
 *                 example: Updated monthly salary
 */
router.put(
  "/update-transaction/:id",
  authenticate,
  transactionController.updateTransaction
);

/**
 * @swagger
 * /api/transactions/{id}:
 *   delete:
 *     summary: Delete a transaction by ID
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the transaction to delete
 *     responses:
 *       200:
 *         description: Transaction deleted successfully
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", authenticate, transactionController.deleteTransaction);

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Get all transactions for the authenticated user
 *     tags: [Transactions]
 *     responses:
 *       200:
 *         description: Transactions retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/", authenticate, transactionController.getTransactionsByAccountId);
export default router;

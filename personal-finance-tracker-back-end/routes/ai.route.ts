import { Router } from "express";
import * as aiController from "../controllers/ai.controller";
import { authenticate } from "../middlewares/authenticate";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: AI
 *   description: AI-based personal finance assistant
 */

/**
 * @swagger
 * /api/ai/chat:
 *   post:
 *     summary: Chat with AI
 *     description: Send a prompt to the AI and receive a response
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prompt:
 *                 type: string
 *                 example: "What is the best way to save money?"
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   type: string
 *                   example: "To save money effectively, consider creating a budget, cutting unnecessary expenses, and setting up a savings account with automatic transfers."
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid prompt"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to generate AI response"
 */

router.post("/chat", authenticate, aiController.chatWithAI);

export default router;

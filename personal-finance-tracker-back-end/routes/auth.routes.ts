import { Router } from "express";
import { AccountController } from "../controllers/account.controller";
import { authenticate } from "../middlewares/authenticate";
import {
  authorizeRole,
  authorizeRoleHierarchy,
} from "../middlewares/authorizeRole";
import { Role } from "../constants/role";

const router = Router();
const controller = new AccountController();

// Public routes
/**
 * @swagger
 * tags:
 *   name: Accounts & Authentication
 *   description: API for managing user accounts and authentication
 */

/**
 * @swagger
 * /api/auths/register:
 *   post:
 *     summary: Register a new account
 *     tags: [Accounts & Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/register", controller.register);
/**
 * @swagger
 * /api/auths/login:
 *   post:
 *     summary: Login to an existing account
 *     tags: [Accounts & Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/login", controller.login);
/**
 * @swagger
 * /api/auths/logout:
 *   post:
 *     summary: Logout from the system
 *     tags: [Accounts & Authentication]
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       500:
 *         description: Logout failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/logout", controller.logout);

// Protected routes
/**
 * @swagger
 * /api/auths/profile:
 *   get:
 *     summary: Get the profile of the authenticated user
 *     tags: [Accounts & Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/profile", authenticate, controller.getProfile);
/**
 * @swagger
 * /api/auths/verify:
 *   get:
 *     summary: Verify the authentication token
 *     tags: [Accounts & Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token is valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   $ref: '#/components/schemas/AuthResponse'
 *                 valid:
 *                   type: boolean
 */
router.get("/verify", authenticate, controller.verifyToken);

// Admin routes - Account management
/**
 * @swagger
 * /api/auths/accounts:
 *   get:
 *     summary: Get all accounts (Admin only)
 *     tags: [Accounts & Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of accounts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AuthResponse'
 */
router.get(
  "/accounts",
  authenticate,
  authorizeRole([Role.ADMIN]),
  controller.getAllAccounts
);

/**
 * @swagger
 * /api/auths/accounts/{id}:
 *   get:
 *     summary: Get account by ID (Admin only)
 *     tags: [Accounts & Authentication]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the account to retrieve
 *     responses:
 *       200:
 *         description: Account retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 */
router.get(
  "/accounts/:id",
  authenticate,
  authorizeRoleHierarchy(Role.MANAGER),
  controller.getAccountById
);

/**
 * @swagger
 * /api/auths/accounts/{id}:
 *   put:
 *     summary: Update account by ID (Admin only)
 *     tags: [Accounts & Authentication]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the account to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       200:
 *         description: Account updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 */
router.put(
  "/accounts/:id",
  authenticate,
  authorizeRole([Role.ADMIN]),
  controller.updateAccount
);

/**
 * @swagger
 * /api/auths/accounts/{id}/deactivate:
 *   patch:
 *     summary: Deactivate account by ID (Admin only)
 *     tags: [Accounts & Authentication]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the account to deactivate
 *     responses:
 *       200:
 *         description: Account deactivated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.patch(
  "/accounts/:id/deactivate",
  authenticate,
  authorizeRole([Role.ADMIN]),
  controller.deactivateAccount
);

/**
 * @swagger
 * /api/auths/accounts/{id}/activate:
 *   patch:
 *     summary: Activate account by ID (Admin only)
 *     tags: [Accounts & Authentication]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the account to activate
 *     responses:
 *       200:
 *         description: Account activated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.patch(
  "/accounts/:id/activate",
  authenticate,
  authorizeRole([Role.ADMIN]),
  controller.activateAccount
);

/**
 * @swagger
 * /api/auths/accounts/{id}:
 *   delete:
 *     summary: Delete account by ID (Admin only)
 *     tags: [Accounts & Authentication]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the account to delete
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.delete(
  "/accounts/:id",
  authenticate,
  authorizeRole([Role.ADMIN]),
  controller.deleteAccount
);

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - firstName
 *         - lastName
 *         - dob
 *         - phoneNumber
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         dob:
 *           type: string
 *           format: date
 *         phoneNumber:
 *           type: string
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *     AuthResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             account:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 dob:
 *                   type: string
 *                   format: date
 *                 phoneNumber:
 *                   type: string
 *                 role:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *             token:
 *               type: string
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         data:
 *           type: string
 *           nullable: true
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         errorCode:
 *           type: integer
 */

export default router;

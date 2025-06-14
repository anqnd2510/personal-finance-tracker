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

router.post("/create-budget", budgetController.createBudget);

router.get("/:id", budgetController.getBudgetById);

router.get("/", authenticate, budgetController.getBudgetsByAccountId);
router.put("/update-budget", authenticate, budgetController.updateBudget);
router.delete(
  "/delete-budget/:id",
  authenticate,
  budgetController.deleteBudget
);

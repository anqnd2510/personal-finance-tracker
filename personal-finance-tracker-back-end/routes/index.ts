import { Router } from "express";
import accountRoutes from "./auth.routes";
import transactionRoutes from "./transaction.route";
import categoryRoutes from "./category.route";
import budgetRoutes from "./budget.route";
import analyticRoutes from "./analytic.route";
import aiRoutes from "./ai.route";
const router = Router();

router.use("/auths", accountRoutes);

router.use("/transactions", transactionRoutes);

router.use("/categories", categoryRoutes);

router.use("/budgets", budgetRoutes);

router.use("/analytics", analyticRoutes);

router.use("/ai", aiRoutes);

export default router;

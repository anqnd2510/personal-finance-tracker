import { Router } from "express";
import accountRoutes from "./auth.routes";
import transactionRoutes from "./transaction.route";
import categoryRoutes from "./category.route";
const router = Router();

router.use("/auths", accountRoutes);

router.use("/transactions", transactionRoutes);

router.use("/categories", categoryRoutes);

export default router;

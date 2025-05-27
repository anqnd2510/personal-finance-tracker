import { Router } from "express";
import accountRoutes from "./account.route";
const router = Router();

router.use("/accounts", accountRoutes);

export default router;

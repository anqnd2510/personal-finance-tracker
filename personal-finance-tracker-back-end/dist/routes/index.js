"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const transaction_route_1 = __importDefault(require("./transaction.route"));
const category_route_1 = __importDefault(require("./category.route"));
const budget_route_1 = __importDefault(require("./budget.route"));
const analytic_route_1 = __importDefault(require("./analytic.route"));
const ai_route_1 = __importDefault(require("./ai.route"));
const insight_route_1 = __importDefault(require("./insight.route"));
const router = (0, express_1.Router)();
router.use("/auths", auth_routes_1.default);
router.use("/transactions", transaction_route_1.default);
router.use("/categories", category_route_1.default);
router.use("/budgets", budget_route_1.default);
router.use("/analytics", analytic_route_1.default);
router.use("/ai", ai_route_1.default);
router.use("/insights", insight_route_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map
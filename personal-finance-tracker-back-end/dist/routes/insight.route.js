"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const insight_controller_1 = require("../controllers/insight.controller");
const authenticate_1 = require("../middlewares/authenticate");
const router = (0, express_1.Router)();
const controller = new insight_controller_1.RuleController();
router.get("/", authenticate_1.authenticate, controller.getInsights);
router.get("/rules", controller.getRules);
router.get("/rules/:ruleName", authenticate_1.authenticate, controller.runSpecificRule);
exports.default = router;
//# sourceMappingURL=insight.route.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRule = exports.updateRule = exports.getMyRules = exports.createRule = void 0;
const rule_service_1 = require("../services/rule.service");
const service = new rule_service_1.RuleService();
const createRule = async (req, res, next) => {
    try {
        const accountId = req.account?.accountId;
        if (!accountId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const ruleData = req.body;
        if (!ruleData.name || !ruleData.descriptionContains || !ruleData.categoryId) {
            res.status(400).json({ message: "name, descriptionContains, and categoryId are required" });
            return;
        }
        const response = await service.createRule({ ...ruleData, accountId });
        res.status(response.statusCode).json(response);
    }
    catch (err) {
        next(err);
    }
};
exports.createRule = createRule;
const getMyRules = async (req, res, next) => {
    try {
        const accountId = req.account?.accountId;
        if (!accountId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const response = await service.getRulesByAccountId(accountId);
        res.status(response.statusCode).json(response);
    }
    catch (err) {
        next(err);
    }
};
exports.getMyRules = getMyRules;
const updateRule = async (req, res, next) => {
    try {
        const accountId = req.account?.accountId;
        if (!accountId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const { id } = req.params;
        const updateData = req.body;
        const response = await service.updateRule(accountId, id, updateData);
        res.status(response.statusCode).json(response);
    }
    catch (err) {
        next(err);
    }
};
exports.updateRule = updateRule;
const deleteRule = async (req, res, next) => {
    try {
        const accountId = req.account?.accountId;
        if (!accountId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const { id } = req.params;
        const response = await service.deleteRule(accountId, id);
        res.status(response.statusCode).json(response);
    }
    catch (err) {
        next(err);
    }
};
exports.deleteRule = deleteRule;
//# sourceMappingURL=rule.controller.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBudget = exports.updateBudget = exports.getBudgetsByAccountId = exports.getBudgetById = exports.createBudget = void 0;
const budget_service_1 = require("../services/budget.service");
const service = new budget_service_1.BudgetService();
const createBudget = async (req, res, next) => {
    try {
        const budgetData = req.body;
        if (!req.account || !req.account.accountId) {
            res.status(401).json({ message: "Unauthorized" });
        }
        const userId = req.account?.accountId;
        budgetData.accountId = userId;
        const response = await service.createBudget(budgetData);
        res.status(response.statusCode).json(response);
    }
    catch (err) {
        next(err);
    }
};
exports.createBudget = createBudget;
const getBudgetById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const response = await service.getBudgetById(id);
        res.status(response.statusCode).json(response);
    }
    catch (err) {
        next(err);
    }
};
exports.getBudgetById = getBudgetById;
const getBudgetsByAccountId = async (req, res, next) => {
    try {
        const userId = req.account?.accountId;
        if (!userId) {
            res.status(401).json({ message: "User not authenticated" });
            return;
        }
        const response = await service.getBudgetsByAccountId(userId);
        res.status(response.statusCode).json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.getBudgetsByAccountId = getBudgetsByAccountId;
const updateBudget = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const response = await service.updateBudget(id, updateData);
        res.status(response.statusCode).json(response);
    }
    catch (err) {
        next(err);
    }
};
exports.updateBudget = updateBudget;
const deleteBudget = async (req, res, next) => {
    try {
        const { id } = req.params;
        const response = await service.deleteBudget(id);
        res.status(response.statusCode).json(response);
    }
    catch (err) {
        next(err);
    }
};
exports.deleteBudget = deleteBudget;
//# sourceMappingURL=budget.controller.js.map
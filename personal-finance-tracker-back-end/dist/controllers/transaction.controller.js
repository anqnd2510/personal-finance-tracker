"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTransaction = exports.getTransactionsByAccountId = exports.getTransactionById = exports.createTransaction = void 0;
const transaction_service_1 = require("../services/transaction.service");
const httpStatus_1 = require("constants/httpStatus");
const apiResponse_1 = require("../utils/apiResponse");
const service = new transaction_service_1.TransactionService();
const createTransaction = async (req, res, next) => {
    try {
        const transactionData = req.body;
        if (!req.account || !req.account.accountId) {
            res.status(401).json({ message: "Unauthorized" });
        }
        const userId = req.account?.accountId;
        transactionData.accountId = userId;
        if (transactionData.date && typeof transactionData.date === 'string') {
            transactionData.date = new Date(transactionData.date);
        }
        const response = await service.createTransaction(transactionData);
        res.status(response.statusCode).json(response);
    }
    catch (err) {
        next(err);
    }
};
exports.createTransaction = createTransaction;
const getTransactionById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const response = await service.getTransactionById(id);
        res.status(response.statusCode).json(response);
    }
    catch (err) {
        next(err);
    }
};
exports.getTransactionById = getTransactionById;
const getTransactionsByAccountId = async (req, res, next) => {
    try {
        const userId = req.account?.accountId;
        if (!userId) {
            res
                .status(httpStatus_1.HTTP_STATUS.UNAUTHORIZED)
                .json(apiResponse_1.ApiResponse.error("User not authenticated", 401));
            return;
        }
        const response = await service.getTransactionsByAccountId(userId);
        res.status(response.statusCode).json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.getTransactionsByAccountId = getTransactionsByAccountId;
const updateTransaction = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const response = await service.updateTransaction(id, updateData);
        res.status(response.statusCode).json(response);
    }
    catch (err) {
        next(err);
    }
};
exports.updateTransaction = updateTransaction;
//# sourceMappingURL=transaction.controller.js.map
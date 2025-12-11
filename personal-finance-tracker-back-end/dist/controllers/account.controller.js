"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountController = void 0;
const apiResponse_1 = require("../utils/apiResponse");
const auth_service_1 = require("../services/auth.service");
const account_service_1 = require("../services/account.service");
const httpStatus_1 = require("constants/httpStatus");
class AccountController {
    constructor() {
        this.register = async (req, res) => {
            try {
                const registerData = req.body;
                if (!registerData.email ||
                    !registerData.password ||
                    !registerData.firstName ||
                    !registerData.lastName ||
                    !registerData.dob ||
                    !registerData.phoneNumber) {
                    res
                        .status(httpStatus_1.HTTP_STATUS.BAD_REQUEST)
                        .json(apiResponse_1.ApiResponse.error("Email, password, firstName, and lastName are required", 400));
                    return;
                }
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(registerData.email)) {
                    res
                        .status(httpStatus_1.HTTP_STATUS.BAD_REQUEST)
                        .json(apiResponse_1.ApiResponse.error("Invalid email format", 400));
                    return;
                }
                const result = await this.authService.register(registerData);
                res
                    .status(httpStatus_1.HTTP_STATUS.CREATED)
                    .json(apiResponse_1.ApiResponse.success(result, "Account created successfully"));
            }
            catch (error) {
                console.error("Register controller error:", error);
                res
                    .status(httpStatus_1.HTTP_STATUS.BAD_REQUEST)
                    .json(apiResponse_1.ApiResponse.error(error.message || "Registration failed", 400));
            }
        };
        this.login = async (req, res) => {
            try {
                const loginData = req.body;
                if (!loginData.email || !loginData.password) {
                    res
                        .status(httpStatus_1.HTTP_STATUS.BAD_REQUEST)
                        .json(apiResponse_1.ApiResponse.error("Email and password are required", 400));
                    return;
                }
                const result = await this.authService.login(loginData);
                res.json(apiResponse_1.ApiResponse.success(result, "Login successful"));
            }
            catch (error) {
                console.error("Login controller error:", error);
                res
                    .status(httpStatus_1.HTTP_STATUS.UNAUTHORIZED)
                    .json(apiResponse_1.ApiResponse.error(error.message || "Login failed", 401));
            }
        };
        this.logout = async (req, res) => {
            try {
                res.json(apiResponse_1.ApiResponse.success(null, "Logout successful"));
            }
            catch (error) {
                console.error("Logout controller error:", error);
                res
                    .status(httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR)
                    .json(apiResponse_1.ApiResponse.error("Logout failed", 500));
            }
        };
        this.getProfile = async (req, res) => {
            try {
                const userId = req.account?.accountId;
                if (!userId) {
                    res
                        .status(httpStatus_1.HTTP_STATUS.UNAUTHORIZED)
                        .json(apiResponse_1.ApiResponse.error("User not authenticated", 401));
                    return;
                }
                const userProfile = await this.authService.getCurrentUser(userId);
                res.json(apiResponse_1.ApiResponse.success(userProfile, "Profile retrieved successfully"));
            }
            catch (error) {
                console.error("Get profile controller error:", error);
                res
                    .status(httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR)
                    .json(apiResponse_1.ApiResponse.error(error.message || "Failed to get profile", 500));
            }
        };
        this.verifyToken = async (req, res) => {
            try {
                res.json(apiResponse_1.ApiResponse.success({
                    user: req.account,
                    valid: true,
                }, "Token is valid"));
            }
            catch (error) {
                res
                    .status(httpStatus_1.HTTP_STATUS.UNAUTHORIZED)
                    .json(apiResponse_1.ApiResponse.error("Token verification failed", 401));
            }
        };
        this.getAllAccounts = async (req, res) => {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const result = await this.accountService.getAllAccounts(page, limit);
                res.json(apiResponse_1.ApiResponse.success(result, "Accounts retrieved successfully"));
            }
            catch (error) {
                console.error("Get all accounts controller error:", error);
                res
                    .status(httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR)
                    .json(apiResponse_1.ApiResponse.error(error.message || "Failed to get accounts", 500));
            }
        };
        this.getAccountById = async (req, res) => {
            try {
                const { id } = req.params;
                const account = await this.accountService.getAccountById(id);
                res.json(apiResponse_1.ApiResponse.success(account, "Account retrieved successfully"));
            }
            catch (error) {
                console.error("Get account by ID controller error:", error);
                const statusCode = error.message === "Account not found" ? 404 : 500;
                res
                    .status(statusCode)
                    .json(apiResponse_1.ApiResponse.error(error.message || "Failed to get account", statusCode));
            }
        };
        this.updateAccount = async (req, res) => {
            try {
                const { id } = req.params;
                const updateData = req.body;
                const updatedAccount = await this.accountService.updateAccount(id, updateData);
                res.json(apiResponse_1.ApiResponse.success(updatedAccount, "Account updated successfully"));
            }
            catch (error) {
                console.error("Update account controller error:", error);
                const statusCode = error.message === "Account not found" ? 404 : 500;
                res
                    .status(statusCode)
                    .json(apiResponse_1.ApiResponse.error(error.message || "Failed to update account", statusCode));
            }
        };
        this.deactivateAccount = async (req, res) => {
            try {
                const { id } = req.params;
                const deactivatedAccount = await this.accountService.deactivateAccount(id);
                res.json(apiResponse_1.ApiResponse.success(deactivatedAccount, "Account deactivated successfully"));
            }
            catch (error) {
                console.error("Deactivate account controller error:", error);
                const statusCode = error.message === "Account not found" ? 404 : 500;
                res
                    .status(statusCode)
                    .json(apiResponse_1.ApiResponse.error(error.message || "Failed to deactivate account", statusCode));
            }
        };
        this.activateAccount = async (req, res) => {
            try {
                const { id } = req.params;
                const activatedAccount = await this.accountService.activateAccount(id);
                res.json(apiResponse_1.ApiResponse.success(activatedAccount, "Account activated successfully"));
            }
            catch (error) {
                console.error("Activate account controller error:", error);
                const statusCode = error.message === "Account not found" ? 404 : 500;
                res
                    .status(statusCode)
                    .json(apiResponse_1.ApiResponse.error(error.message || "Failed to activate account", statusCode));
            }
        };
        this.deleteAccount = async (req, res) => {
            try {
                const { id } = req.params;
                const result = await this.accountService.deleteAccount(id);
                res.json(apiResponse_1.ApiResponse.success(result, "Account deleted successfully"));
            }
            catch (error) {
                console.error("Delete account controller error:", error);
                const statusCode = error.message === "Account not found" ? 404 : 500;
                res
                    .status(statusCode)
                    .json(apiResponse_1.ApiResponse.error(error.message || "Failed to delete account", statusCode));
            }
        };
        this.authService = new auth_service_1.AuthService();
        this.accountService = new account_service_1.AccountService();
    }
}
exports.AccountController = AccountController;
//# sourceMappingURL=account.controller.js.map
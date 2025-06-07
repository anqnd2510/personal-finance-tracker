import { Request, Response } from "express";
import { ApiResponse } from "../utils/apiResponse";
import { AuthService } from "../services/auth.service";
import { AccountService } from "../services/account.service";
import { ILoginRequest, IRegisterRequest } from "../interfaces/auth.interface";
import { HTTP_STATUS } from "constants/httpStatus";
import { Role } from "../constants/role";

export class AccountController {
  private authService: AuthService;
  private accountService: AccountService;

  constructor() {
    this.authService = new AuthService();
    this.accountService = new AccountService();
  }

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const registerData: IRegisterRequest = req.body;

      // Basic validation
      if (
        !registerData.email ||
        !registerData.password ||
        !registerData.firstName ||
        !registerData.lastName ||
        !registerData.dob ||
        !registerData.phoneNumber
      ) {
        res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json(
            ApiResponse.error(
              "Email, password, firstName, and lastName are required",
              400
            )
          );
        return;
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(registerData.email)) {
        res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json(ApiResponse.error("Invalid email format", 400));
        return;
      }

      const result = await this.authService.register(registerData);

      res
        .status(HTTP_STATUS.CREATED)
        .json(ApiResponse.success(result, "Account created successfully"));
    } catch (error: any) {
      console.error("Register controller error:", error);
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(ApiResponse.error(error.message || "Registration failed", 400));
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const loginData: ILoginRequest = req.body;

      if (!loginData.email || !loginData.password) {
        res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json(ApiResponse.error("Email and password are required", 400));
        return;
      }

      const result = await this.authService.login(loginData);

      res.json(ApiResponse.success(result, "Login successful"));
    } catch (error: any) {
      console.error("Login controller error:", error);
      res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json(ApiResponse.error(error.message || "Login failed", 401));
    }
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    try {
      // For JWT, logout is handled on client-side by removing token
      res.json(ApiResponse.success(null, "Logout successful"));
    } catch (error: any) {
      console.error("Logout controller error:", error);
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(ApiResponse.error("Logout failed", 500));
    }
  };

  getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.account?.accountId;

      if (!userId) {
        res
          .status(HTTP_STATUS.UNAUTHORIZED)
          .json(ApiResponse.error("User not authenticated", 401));
        return;
      }

      const userProfile = await this.authService.getCurrentUser(userId);

      res.json(
        ApiResponse.success(userProfile, "Profile retrieved successfully")
      );
    } catch (error: any) {
      console.error("Get profile controller error:", error);
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(ApiResponse.error(error.message || "Failed to get profile", 500));
    }
  };

  verifyToken = async (req: Request, res: Response): Promise<void> => {
    try {
      res.json(
        ApiResponse.success(
          {
            user: req.account,
            valid: true,
          },
          "Token is valid"
        )
      );
    } catch (error: any) {
      res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json(ApiResponse.error("Token verification failed", 401));
    }
  };

  // Admin routes
  getAllAccounts = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.accountService.getAllAccounts(page, limit);

      res.json(ApiResponse.success(result, "Accounts retrieved successfully"));
    } catch (error: any) {
      console.error("Get all accounts controller error:", error);
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(
          ApiResponse.error(error.message || "Failed to get accounts", 500)
        );
    }
  };

  getAccountById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const account = await this.accountService.getAccountById(id);

      res.json(ApiResponse.success(account, "Account retrieved successfully"));
    } catch (error: any) {
      console.error("Get account by ID controller error:", error);
      const statusCode = error.message === "Account not found" ? 404 : 500;
      res
        .status(statusCode)
        .json(
          ApiResponse.error(
            error.message || "Failed to get account",
            statusCode
          )
        );
    }
  };

  updateAccount = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const updatedAccount = await this.accountService.updateAccount(
        id,
        updateData
      );

      res.json(
        ApiResponse.success(updatedAccount, "Account updated successfully")
      );
    } catch (error: any) {
      console.error("Update account controller error:", error);
      const statusCode = error.message === "Account not found" ? 404 : 500;
      res
        .status(statusCode)
        .json(
          ApiResponse.error(
            error.message || "Failed to update account",
            statusCode
          )
        );
    }
  };

  deactivateAccount = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const deactivatedAccount = await this.accountService.deactivateAccount(
        id
      );

      res.json(
        ApiResponse.success(
          deactivatedAccount,
          "Account deactivated successfully"
        )
      );
    } catch (error: any) {
      console.error("Deactivate account controller error:", error);
      const statusCode = error.message === "Account not found" ? 404 : 500;
      res
        .status(statusCode)
        .json(
          ApiResponse.error(
            error.message || "Failed to deactivate account",
            statusCode
          )
        );
    }
  };

  activateAccount = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const activatedAccount = await this.accountService.activateAccount(id);

      res.json(
        ApiResponse.success(activatedAccount, "Account activated successfully")
      );
    } catch (error: any) {
      console.error("Activate account controller error:", error);
      const statusCode = error.message === "Account not found" ? 404 : 500;
      res
        .status(statusCode)
        .json(
          ApiResponse.error(
            error.message || "Failed to activate account",
            statusCode
          )
        );
    }
  };

  deleteAccount = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.accountService.deleteAccount(id);

      res.json(ApiResponse.success(result, "Account deleted successfully"));
    } catch (error: any) {
      console.error("Delete account controller error:", error);
      const statusCode = error.message === "Account not found" ? 404 : 500;
      res
        .status(statusCode)
        .json(
          ApiResponse.error(
            error.message || "Failed to delete account",
            statusCode
          )
        );
    }
  };
}

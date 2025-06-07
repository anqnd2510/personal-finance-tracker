import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/apiResponse";
import { JWTService } from "../utils/jwt";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json(ApiResponse.error("Access token is required", 401));
      return;
    }

    const token = authHeader.substring(7);
    const decoded = JWTService.verifyToken(token);

    if (!decoded) {
      res.status(401).json(ApiResponse.error("Invalid or expired token", 401));
      return;
    }

    req.account = {
      accountId: decoded.accountId,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json(ApiResponse.error("Authentication failed", 401));
    return;
  }
};

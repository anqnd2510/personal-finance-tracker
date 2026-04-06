import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/apiResponse";
import { JWTService } from "../utils/jwt";
import { getRedisClient } from "../config/redis";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const processAuth = async (): Promise<void> => {
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

    if (!decoded.sessionId) {
      res.status(401).json(ApiResponse.error("Invalid token session", 401));
      return;
    }

    try {
      const redis = getRedisClient();
      const activeSessionId = await redis.get(
        `auth:session:${decoded.accountId}`
      );

      if (!activeSessionId || activeSessionId !== decoded.sessionId) {
        res
          .status(401)
          .json(ApiResponse.error("Session expired. Please login again", 401));
        return;
      }
    } catch (error) {
      console.error("Session validation skipped due to Redis error:", error);
    }

    req.account = {
      accountId: decoded.accountId,
      email: decoded.email,
      role: decoded.role,
      sessionId: decoded.sessionId,
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json(ApiResponse.error("Authentication failed", 401));
    return;
  }
  };

  void processAuth();
};

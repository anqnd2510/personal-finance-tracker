import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/apiResponse";
import { JwtAccountPayload } from "../interfaces/auth.interface";
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json(ApiResponse.error("Unauthorized: No token provided", 401));
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtAccountPayload;
    req.account = decoded; // Assuming the decoded token contains account info
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res
      .status(401)
      .json(ApiResponse.error("Unauthorized: Invalid token", 401));
  }
};

import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/apiResponse";
import { Role } from "../constants/role";

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      account?: {
        role: Role;
        [key: string]: any;
      };
    }
  }
}

export const authorizeRole = (roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const accountRole = req.account?.role;

    if (!accountRole || !roles.includes(accountRole)) {
      return res
        .status(403)
        .json(
          ApiResponse.error(
            "Forbidden: You do not have permi ssion to access this resource",
            403
          )
        );
    }

    next();
  };
};

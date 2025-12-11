import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/apiResponse";
import { Role } from "@prisma/client";
import { RoleHierarchy } from "../constants/role";

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      account?: {
        accountId: string;
        email: string;
        role: Role;
      };
    }
  }
}

export const authorizeRole = (requiredRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const accountRole = req.account?.role;

    if (!accountRole) {
      res
        .status(401)
        .json(
          ApiResponse.error(
            "Forbidden: You do not have permission to access this resource",
            401
          )
        );
      return;
    }

    const hasPermission = requiredRoles.some((role) => accountRole === role);
    if (!hasPermission) {
      res.status(403).json(ApiResponse.error("Insufficient permissions", 403));
      return;
    }

    next();
  };
};

export const authorizeRoleHierarchy = (minimumRole: Role) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const accountRole = req.account?.role;

    if (!accountRole) {
      res.status(401).json(ApiResponse.error("Authentication required", 401));
      return;
    }

    const userRoleLevel = RoleHierarchy[accountRole];
    const requiredRoleLevel = RoleHierarchy[minimumRole];

    if (userRoleLevel < requiredRoleLevel) {
      res.status(403).json(ApiResponse.error("Insufficient permissions", 403));
      return;
    }

    next();
  };
};

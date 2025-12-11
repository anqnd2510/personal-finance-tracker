import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";
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
export declare const authorizeRole: (requiredRoles: Role[]) => (req: Request, res: Response, next: NextFunction) => void;
export declare const authorizeRoleHierarchy: (minimumRole: Role) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=authorizeRole.d.ts.map
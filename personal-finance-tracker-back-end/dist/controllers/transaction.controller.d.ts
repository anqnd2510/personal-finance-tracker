import { Request, Response, NextFunction } from "express";
export declare const createTransaction: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getTransactionById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getTransactionsByAccountId: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateTransaction: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=transaction.controller.d.ts.map
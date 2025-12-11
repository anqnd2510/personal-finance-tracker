import { Request, Response } from "express";
export declare class AccountController {
    private authService;
    private accountService;
    constructor();
    register: (req: Request, res: Response) => Promise<void>;
    login: (req: Request, res: Response) => Promise<void>;
    logout: (req: Request, res: Response) => Promise<void>;
    getProfile: (req: Request, res: Response) => Promise<void>;
    verifyToken: (req: Request, res: Response) => Promise<void>;
    getAllAccounts: (req: Request, res: Response) => Promise<void>;
    getAccountById: (req: Request, res: Response) => Promise<void>;
    updateAccount: (req: Request, res: Response) => Promise<void>;
    deactivateAccount: (req: Request, res: Response) => Promise<void>;
    activateAccount: (req: Request, res: Response) => Promise<void>;
    deleteAccount: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=account.controller.d.ts.map
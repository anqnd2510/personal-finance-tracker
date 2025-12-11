import { IUpdateAccountRequest } from "../interfaces/account.interface";
export declare class AccountService {
    private accountRepository;
    constructor();
    getAllAccounts(page?: number, limit?: number): Promise<{
        accounts: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            dob: Date;
            phoneNumber: string;
            isActive: boolean;
            role: import(".prisma/client").$Enums.Role;
            createdAt: Date;
            updatedAt: Date;
        }[];
        pagination: {
            currentPage: number;
            totalPages: number;
            totalItems: number;
            itemsPerPage: number;
        };
    }>;
    getAccountById(id: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        dob: Date;
        phoneNumber: string;
        isActive: boolean;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateAccount(id: string, updateData: IUpdateAccountRequest): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        dob: Date;
        phoneNumber: string;
        isActive: boolean;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deactivateAccount(id: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        dob: Date;
        phoneNumber: string;
        isActive: boolean;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    activateAccount(id: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        dob: Date;
        phoneNumber: string;
        isActive: boolean;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteAccount(id: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=account.service.d.ts.map
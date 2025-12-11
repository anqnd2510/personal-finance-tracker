import { Account, Role } from "@prisma/client";
export type IAccount = Account;
export interface ICreateAccountRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    dob: Date;
    phoneNumber: string;
    role?: Role;
}
export { Role };
export interface IUpdateAccountRequest {
    firstName?: string;
    lastName?: string;
    dob?: Date;
    phoneNumber?: string;
}
//# sourceMappingURL=account.interface.d.ts.map
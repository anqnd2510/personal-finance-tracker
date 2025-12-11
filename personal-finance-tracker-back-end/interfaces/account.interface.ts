import { Account, Role } from "@prisma/client";

// Use Prisma's generated Account type as the base
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

// Re-export Role for backward compatibility
export { Role };

export interface IUpdateAccountRequest {
  firstName?: string;
  lastName?: string;
  dob?: Date;
  phoneNumber?: string;
}

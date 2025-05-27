import { Document } from "mongoose";
export interface IAccount extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dob: Date;
  phoneNumber: number;
  isActive?: boolean;
  role?: "user" | "admin";
  createdAt?: Date;
  updatedAt?: Date;
}
export interface IAccountRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dob: Date;
  phoneNumber: number;
}
export interface IAccountResponse {
  email: string;
  firstName: string;
  lastName: string;
  dob: Date;
  phoneNumber: number;
  isActive?: boolean;
  role?: "user" | "admin";
}

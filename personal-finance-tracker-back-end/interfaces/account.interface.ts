import { Document } from "mongoose";
import { Role } from "../constants/role";

export interface IAccount extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dob: Date;
  phoneNumber: number;
  isActive?: boolean;
  role?: Role;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface ICreateAccountRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dob: Date;
  phoneNumber: number;
  role?: Role;
}

export interface IUpdateAccountRequest {
  firstName: string;
  lastName: string;
  dob: Date;
  phoneNumber: number;
  updatedAt?: Date;
}

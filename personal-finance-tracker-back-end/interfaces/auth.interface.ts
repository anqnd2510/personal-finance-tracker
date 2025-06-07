import { Role } from "../constants/role";

export interface ITokenPayload {
  accountId: string;
  email: string;
  role: Role;
  iat?: number;
  exp?: number;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dob: Date;
  phoneNumber: number;
}

export interface IAuthResponse {
  account: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
    dob: Date;
    phoneNumber: number;
    createdAt: Date;
  };
  token: string;
}

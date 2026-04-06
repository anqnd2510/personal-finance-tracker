import { Role } from "./account.interface";

export interface ITokenPayload {
  accountId: string;
  email: string;
  role: Role;
  sessionId: string;
  iat?: number;
  exp?: number;
}

export interface ILoginRequest {
  email: string;
  password: string;
  forceLogin?: boolean;
}

export interface IRegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dob: Date;
  phoneNumber: string;
}

export interface IAuthResponse {
  account: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
    dob: Date;
    phoneNumber: string;
    createdAt: Date;
  };
  token: string;
}

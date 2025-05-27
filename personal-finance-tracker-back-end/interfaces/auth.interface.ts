import { Role } from "../constants/role";

export interface JwtAccountPayload {
  id: string;
  email: string;
  role: Role;
}

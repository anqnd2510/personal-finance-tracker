import jwt from "jsonwebtoken";
import { ITokenPayload } from "../interfaces/auth.interface";

export class JWTService {
  private static getJWTSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }
    return secret;
  }

  private static getJWTExpiresIn(): string | number {
    const expiresIn = process.env.JWT_EXPIRES_IN || "24h";
    // Convert "24h" to seconds if needed, or return as is
    if (expiresIn === "24h") {
      return 24 * 60 * 60; // 24 hours in seconds
    }
    return expiresIn;
  }

  static generateToken(payload: ITokenPayload): string {
    const secret = this.getJWTSecret();
    const expiresIn = this.getJWTExpiresIn();

    return jwt.sign(payload, secret, {
      expiresIn,
      issuer: "personal-finance-tracker",
    });
  }

  static verifyToken(token: string): ITokenPayload | null {
    try {
      const secret = this.getJWTSecret();
      const decoded = jwt.verify(token, secret) as ITokenPayload;
      return decoded;
    } catch (error) {
      console.error("Token verification failed:", error);
      return null;
    }
  }

  static decodeToken(token: string): any {
    try {
      return jwt.decode(token);
    } catch (error) {
      console.error("Token decode failed:", error);
      return null;
    }
  }
}

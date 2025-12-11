import { ITokenPayload } from "../interfaces/auth.interface";
export declare class JWTService {
    private static getJWTSecret;
    private static getJWTExpiresIn;
    static generateToken(payload: ITokenPayload): string;
    static verifyToken(token: string): ITokenPayload | null;
    static decodeToken(token: string): any;
}
//# sourceMappingURL=jwt.d.ts.map
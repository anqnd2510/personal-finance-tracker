"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class JWTService {
    static getJWTSecret() {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET is not defined in environment variables");
        }
        return secret;
    }
    static getJWTExpiresIn() {
        const expiresIn = process.env.JWT_EXPIRES_IN || "24h";
        if (expiresIn === "24h") {
            return 24 * 60 * 60;
        }
        return expiresIn;
    }
    static generateToken(payload) {
        const secret = this.getJWTSecret();
        const expiresIn = this.getJWTExpiresIn();
        return jsonwebtoken_1.default.sign(payload, secret, {
            expiresIn,
            issuer: "personal-finance-tracker",
        });
    }
    static verifyToken(token) {
        try {
            const secret = this.getJWTSecret();
            const decoded = jsonwebtoken_1.default.verify(token, secret);
            return decoded;
        }
        catch (error) {
            console.error("Token verification failed:", error);
            return null;
        }
    }
    static decodeToken(token) {
        try {
            return jsonwebtoken_1.default.decode(token);
        }
        catch (error) {
            console.error("Token decode failed:", error);
            return null;
        }
    }
}
exports.JWTService = JWTService;
//# sourceMappingURL=jwt.js.map
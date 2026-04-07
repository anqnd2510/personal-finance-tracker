"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const crypto_1 = require("crypto");
const account_interface_1 = require("../interfaces/account.interface");
const account_repository_1 = require("../repositories/account.repository");
const jwt_1 = require("../utils/jwt");
const password_1 = require("../utils/password");
const redis_1 = require("../config/redis");
class AuthService {
    constructor() {
        this.accountRepository = new account_repository_1.AccountRepository();
    }
    getSessionKey(accountId) {
        return `${AuthService.SESSION_KEY_PREFIX}${accountId}`;
    }
    async storeActiveSession(accountId, sessionId, token) {
        try {
            const redis = (0, redis_1.getRedisClient)();
            const decoded = jwt_1.JWTService.decodeToken(token);
            const ttlSeconds = decoded?.exp
                ? Math.max(decoded.exp - Math.floor(Date.now() / 1000), 1)
                : 24 * 60 * 60;
            await redis.set(this.getSessionKey(accountId), sessionId, "EX", ttlSeconds);
        }
        catch (error) {
            console.error("Failed to store active session:", error);
        }
    }
    async logout(accountId, sessionId) {
        try {
            const redis = (0, redis_1.getRedisClient)();
            const sessionKey = this.getSessionKey(accountId);
            const activeSessionId = await redis.get(sessionKey);
            if (!activeSessionId) {
                return;
            }
            if (!sessionId || activeSessionId === sessionId) {
                await redis.del(sessionKey);
            }
        }
        catch (error) {
            console.error("Logout session cleanup failed:", error);
        }
    }
    async register(registerData) {
        try {
            const existingAccount = await this.accountRepository.findAccountByEmail(registerData.email);
            if (existingAccount) {
                throw new Error("Email already registered");
            }
            const passwordValidation = password_1.PasswordService.validate(registerData.password);
            if (!passwordValidation.isValid) {
                throw new Error(`Password validation failed: ${passwordValidation.errors.join(", ")}`);
            }
            const hashedPassword = await password_1.PasswordService.hash(registerData.password);
            const accountData = {
                email: registerData.email.toLowerCase().trim(),
                password: hashedPassword,
                firstName: registerData.firstName.trim(),
                lastName: registerData.lastName.trim(),
                dob: new Date(registerData.dob),
                phoneNumber: registerData.phoneNumber,
                role: account_interface_1.Role.USER,
            };
            const newAccount = await this.accountRepository.createAccount(accountData);
            const tokenPayload = {
                accountId: newAccount.id,
                email: newAccount.email,
                role: newAccount.role || account_interface_1.Role.USER,
                sessionId: (0, crypto_1.randomUUID)(),
            };
            const token = jwt_1.JWTService.generateToken(tokenPayload);
            await this.storeActiveSession(newAccount.id, tokenPayload.sessionId, token);
            return {
                account: {
                    id: newAccount.id,
                    email: newAccount.email,
                    firstName: newAccount.firstName,
                    lastName: newAccount.lastName,
                    dob: newAccount.dob,
                    phoneNumber: newAccount.phoneNumber,
                    role: newAccount.role || account_interface_1.Role.USER,
                    createdAt: newAccount.createdAt || new Date(),
                },
                token,
            };
        }
        catch (error) {
            console.error("Register service error:", error);
            throw new Error(error.message || "Registration failed");
        }
    }
    async login(loginData) {
        try {
            const account = await this.accountRepository.findActiveAccountByEmail(loginData.email.toLowerCase().trim());
            if (!account) {
                throw new Error("Invalid email or password");
            }
            const isPasswordValid = await password_1.PasswordService.compare(loginData.password, account.password);
            if (!isPasswordValid) {
                throw new Error("Invalid email or password");
            }
            const redis = (0, redis_1.getRedisClient)();
            const existingSessionId = await redis.get(this.getSessionKey(account.id));
            if (existingSessionId && !loginData.forceLogin) {
                throw new Error("Account is already logged in on another device. Logout first or set forceLogin=true");
            }
            const tokenPayload = {
                accountId: account.id,
                email: account.email,
                role: account.role || account_interface_1.Role.USER,
                sessionId: (0, crypto_1.randomUUID)(),
            };
            const token = jwt_1.JWTService.generateToken(tokenPayload);
            await this.storeActiveSession(account.id, tokenPayload.sessionId, token);
            return {
                account: {
                    id: account.id,
                    email: account.email,
                    firstName: account.firstName,
                    lastName: account.lastName,
                    dob: account.dob,
                    phoneNumber: account.phoneNumber,
                    role: account.role || account_interface_1.Role.USER,
                    createdAt: account.createdAt || new Date(),
                },
                token,
            };
        }
        catch (error) {
            console.error("Login service error:", error);
            throw new Error(error.message || "Login failed");
        }
    }
    async getCurrentUser(userId) {
        try {
            const account = await this.accountRepository.findAccountById(userId);
            if (!account) {
                throw new Error("User not found");
            }
            const { password, ...userProfile } = account;
            return userProfile;
        }
        catch (error) {
            console.error("Get current user service error:", error);
            throw new Error(error.message || "Failed to get user profile");
        }
    }
    async verifyToken(token) {
        try {
            return jwt_1.JWTService.verifyToken(token);
        }
        catch (error) {
            console.error("Token verification service error:", error);
            return null;
        }
    }
}
exports.AuthService = AuthService;
AuthService.SESSION_KEY_PREFIX = "auth:session:";
//# sourceMappingURL=auth.service.js.map
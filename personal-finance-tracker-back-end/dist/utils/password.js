"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
class PasswordService {
    static async hash(password) {
        return bcrypt_1.default.hash(password, this.SALT_ROUNDS);
    }
    static async compare(password, hashedPassword) {
        return bcrypt_1.default.compare(password, hashedPassword);
    }
    static validate(password) {
        const errors = [];
        if (password.length < 8) {
            errors.push("Password must be at least 8 characters long");
        }
        if (!/(?=.*[a-z])/.test(password)) {
            errors.push("Password must contain at least one lowercase letter");
        }
        if (!/(?=.*[A-Z])/.test(password)) {
            errors.push("Password must contain at least one uppercase letter");
        }
        if (!/(?=.*\d)/.test(password)) {
            errors.push("Password must contain at least one number");
        }
        if (!/(?=.*[@$!%*?&])/.test(password)) {
            errors.push("Password must contain at least one special character (@$!%*?&)");
        }
        return {
            isValid: errors.length === 0,
            errors,
        };
    }
}
exports.PasswordService = PasswordService;
PasswordService.SALT_ROUNDS = 12;
//# sourceMappingURL=password.js.map
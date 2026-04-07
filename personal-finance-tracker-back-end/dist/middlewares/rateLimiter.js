"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiRateLimiter = exports.authRateLimiter = exports.globalApiLimiter = void 0;
const express_rate_limit_1 = __importStar(require("express-rate-limit"));
const rate_limit_redis_1 = require("rate-limit-redis");
const redis_1 = require("../config/redis");
const parseEnvNumber = (value, fallback) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};
const buildRedisStore = (prefix) => {
    try {
        const redisClient = (0, redis_1.getRedisClient)();
        return new rate_limit_redis_1.RedisStore({
            prefix,
            sendCommand: (...args) => redisClient.call(args[0], ...args.slice(1)),
        });
    }
    catch {
        return undefined;
    }
};
const defaultKeyGenerator = (req) => {
    return (0, express_rate_limit_1.ipKeyGenerator)(req.ip || req.socket.remoteAddress || "unknown");
};
exports.globalApiLimiter = (0, express_rate_limit_1.default)({
    windowMs: parseEnvNumber(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
    limit: parseEnvNumber(process.env.RATE_LIMIT_MAX, 100),
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: defaultKeyGenerator,
    passOnStoreError: true,
    store: buildRedisStore("rl:global:"),
    message: {
        statusCode: 429,
        isSuccess: false,
        message: "Too many requests, please try again later.",
        data: null,
    },
});
exports.authRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: parseEnvNumber(process.env.AUTH_RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
    limit: parseEnvNumber(process.env.AUTH_RATE_LIMIT_MAX, 10),
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: defaultKeyGenerator,
    passOnStoreError: true,
    store: buildRedisStore("rl:auth:"),
    message: {
        statusCode: 429,
        isSuccess: false,
        message: "Too many authentication attempts. Please try again later.",
        data: null,
    },
});
exports.aiRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: parseEnvNumber(process.env.AI_RATE_LIMIT_WINDOW_MS, 60 * 1000),
    limit: parseEnvNumber(process.env.AI_RATE_LIMIT_MAX, 20),
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: defaultKeyGenerator,
    passOnStoreError: true,
    store: buildRedisStore("rl:ai:"),
    message: {
        statusCode: 429,
        isSuccess: false,
        message: "Too many AI requests. Please slow down and try again.",
        data: null,
    },
});
//# sourceMappingURL=rateLimiter.js.map
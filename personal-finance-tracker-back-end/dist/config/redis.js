"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectRedis = exports.checkRedisHealth = exports.getRedisClient = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
let redisClient = null;
const getRedisOptions = () => {
    const host = process.env.REDIS_HOST || "localhost";
    const port = Number(process.env.REDIS_PORT || 6379);
    const db = Number(process.env.REDIS_DB || 0);
    const password = process.env.REDIS_PASSWORD;
    return {
        host,
        port,
        db,
        password: password && password.trim().length > 0 ? password : undefined,
        maxRetriesPerRequest: null,
        enableReadyCheck: true,
        lazyConnect: true,
    };
};
const getRedisClient = () => {
    if (!redisClient) {
        redisClient = new ioredis_1.default(getRedisOptions());
        redisClient.on("error", (error) => {
            console.error("Redis error:", error.message);
        });
    }
    return redisClient;
};
exports.getRedisClient = getRedisClient;
const checkRedisHealth = async () => {
    try {
        const client = (0, exports.getRedisClient)();
        await client.connect();
        const pong = await client.ping();
        return pong === "PONG";
    }
    catch {
        return false;
    }
};
exports.checkRedisHealth = checkRedisHealth;
const disconnectRedis = async () => {
    if (!redisClient) {
        return;
    }
    try {
        await redisClient.quit();
    }
    catch {
        redisClient.disconnect();
    }
    finally {
        redisClient = null;
    }
};
exports.disconnectRedis = disconnectRedis;
//# sourceMappingURL=redis.js.map
import { Request } from "express";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { getRedisClient } from "../config/redis";
import { RedisReply } from "rate-limit-redis";

const parseEnvNumber = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const buildRedisStore = (prefix: string): RedisStore | undefined => {
  try {
    const redisClient = getRedisClient();

    return new RedisStore({
      prefix,
      sendCommand: (...args: string[]) => redisClient.call(args[0], ...args.slice(1)) as Promise<RedisReply>,
    });
  } catch {
    return undefined;
  }
};

const defaultKeyGenerator = (req: Request): string => {
  return ipKeyGenerator(req.ip || req.socket.remoteAddress || "unknown");
};

export const globalApiLimiter = rateLimit({
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

export const authRateLimiter = rateLimit({
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

export const aiRateLimiter = rateLimit({
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

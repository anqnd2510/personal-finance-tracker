import Redis from "ioredis";
export declare const getRedisClient: () => Redis;
export declare const checkRedisHealth: () => Promise<boolean>;
export declare const disconnectRedis: () => Promise<void>;
//# sourceMappingURL=redis.d.ts.map
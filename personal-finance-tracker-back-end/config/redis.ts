import Redis from "ioredis";

let redisClient: Redis | null = null;

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
    // Keep commands retrying instead of throwing and crashing the process.
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
    lazyConnect: true,
  };
};

export const getRedisClient = (): Redis => {
  if (!redisClient) {
    redisClient = new Redis(getRedisOptions());

    redisClient.on("error", (error) => {
      console.error("Redis error:", error.message);
    });
  }

  return redisClient;
};

export const checkRedisHealth = async (): Promise<boolean> => {
  try {
    const client = getRedisClient();
    await client.connect();
    const pong = await client.ping();
    return pong === "PONG";
  } catch {
    return false;
  }
};

export const disconnectRedis = async (): Promise<void> => {
  if (!redisClient) {
    return;
  }

  try {
    await redisClient.quit();
  } catch {
    redisClient.disconnect();
  } finally {
    redisClient = null;
  }
};

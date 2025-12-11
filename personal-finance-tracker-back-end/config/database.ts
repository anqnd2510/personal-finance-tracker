import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

/**
 * PostgreSQL connection pool
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/**
 * Prisma adapter for PostgreSQL
 */
const adapter = new PrismaPg(pool);

/**
 * Prisma Client instance
 * @description This instance is used to interact with the PostgreSQL database using Prisma ORM
 */
export const prisma = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

/**
 * Connect to PostgreSQL database using Prisma
 * @returns {Promise<void>}
 * @throws {Error} If the connection fails
 * @description This function connects to the PostgreSQL database using Prisma ORM. If the connection is successful, it logs a success message to the console. If the connection fails, it logs the error and exits the process with a failure code.
 */
export const connectDB = async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log("✅ PostgreSQL connected via Prisma");
  } catch (err) {
    console.error("❌ Database connection error:", err);
    process.exit(1);
  }
};

/**
 * Disconnect from PostgreSQL database
 * @returns {Promise<void>}
 * @description This function disconnects from the PostgreSQL database
 */
export const disconnectDB = async (): Promise<void> => {
  try {
    await prisma.$disconnect();
    console.log("✅ PostgreSQL disconnected");
  } catch (err) {
    console.error("❌ Database disconnection error:", err);
  }
};

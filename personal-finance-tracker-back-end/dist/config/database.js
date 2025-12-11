"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDB = exports.connectDB = exports.prisma = void 0;
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
});
const adapter = new adapter_pg_1.PrismaPg(pool);
exports.prisma = new client_1.PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});
const connectDB = async () => {
    try {
        await exports.prisma.$connect();
        console.log("✅ PostgreSQL connected via Prisma");
    }
    catch (err) {
        console.error("❌ Database connection error:", err);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
const disconnectDB = async () => {
    try {
        await exports.prisma.$disconnect();
        console.log("✅ PostgreSQL disconnected");
    }
    catch (err) {
        console.error("❌ Database disconnection error:", err);
    }
};
exports.disconnectDB = disconnectDB;
//# sourceMappingURL=database.js.map
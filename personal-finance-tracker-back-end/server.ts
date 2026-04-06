import "module-alias/register";
import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import { connectDB, disconnectDB } from "./config/database";
import { disconnectRedis } from "./config/redis";

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log(`📚 Swagger UI: http://localhost:${PORT}/api-docs`);
      console.log(`🗄️  Database: PostgreSQL with Prisma ORM`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to PostgreSQL:", err);
    process.exit(1);
  });

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down gracefully...");
  await disconnectRedis();
  await disconnectDB();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n🛑 Shutting down gracefully...");
  await disconnectRedis();
  await disconnectDB();
  process.exit(0);
});

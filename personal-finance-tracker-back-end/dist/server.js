"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = __importDefault(require("./app"));
const database_1 = require("./config/database");
const PORT = process.env.PORT || 5000;
(0, database_1.connectDB)()
    .then(() => {
    app_1.default.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
        console.log(`📚 Swagger UI: http://localhost:${PORT}/api-docs`);
        console.log(`🗄️  Database: PostgreSQL with Prisma ORM`);
    });
})
    .catch((err) => {
    console.error("❌ Failed to connect to PostgreSQL:", err);
    process.exit(1);
});
process.on("SIGINT", async () => {
    console.log("\n🛑 Shutting down gracefully...");
    await (0, database_1.disconnectDB)();
    process.exit(0);
});
process.on("SIGTERM", async () => {
    console.log("\n🛑 Shutting down gracefully...");
    await (0, database_1.disconnectDB)();
    process.exit(0);
});
//# sourceMappingURL=server.js.map
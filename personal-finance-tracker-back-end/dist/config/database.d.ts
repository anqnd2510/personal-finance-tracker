import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
export declare const prisma: PrismaClient<{
    adapter: PrismaPg;
    log: ("query" | "warn" | "error")[];
}, "query" | "warn" | "error", import("@prisma/client/runtime/client").DefaultArgs>;
export declare const connectDB: () => Promise<void>;
export declare const disconnectDB: () => Promise<void>;
//# sourceMappingURL=database.d.ts.map
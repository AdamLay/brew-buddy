import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
import { env } from "./env";

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ quiet: true });
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const mainAdapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
  ssl: false,
});

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter: mainAdapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

import { PrismaClient } from "@prisma/client";

/**
 * Prisma must be instantiated once and reused across hot-reloads in dev,
 * otherwise Next.js dev mode exhausts the Postgres connection pool.
 */
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const prisma =
  global.__prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.__prisma = prisma;
}

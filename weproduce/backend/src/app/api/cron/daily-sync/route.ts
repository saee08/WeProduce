import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncService } from "@/services/syncService";
import { streakService } from "@/services/streakService";
import { logger } from "@/utils/logger";
import { ok, fail, ApiError } from "@/utils/apiResponse";

/**
 * Triggered by Vercel Cron (see vercel.json) once daily, shortly after
 * midnight UTC. Runs sync for every user and resets any streak broken by
 * a missed day. Protected by CRON_SECRET so it can't be invoked publicly.
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      throw ApiError.unauthorized("Invalid cron secret");
    }

    const users = await prisma.user.findMany({ where: { isActive: true }, select: { id: true } });
    const results: Record<string, unknown> = {};

    for (const user of users) {
      try {
        await streakService.resetIfMissedDay(user.id);
        results[user.id] = await syncService.syncUser(user.id);
      } catch (err) {
        logger.error({ userId: user.id, err }, "Daily cron sync failed for user");
        results[user.id] = { error: err instanceof Error ? err.message : "Unknown error" };
      }
    }

    return ok({ usersProcessed: users.length, results });
  } catch (error) {
    return fail(error);
  }
}

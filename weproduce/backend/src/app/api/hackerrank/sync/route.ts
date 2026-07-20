import type { NextRequest } from "next/server";
import { requireAuth } from "@/middleware/withAuth";
import { userRepository } from "@/repositories/userRepository";
import { hackerrankService } from "@/services/hackerrankService";
import { scoringService } from "@/services/scoringService";
import { streakService } from "@/services/streakService";
import { activityRepository } from "@/repositories/activityRepository";
import { todayUtc } from "@/utils/dateUtils";
import { ok, fail, ApiError } from "@/utils/apiResponse";

export async function GET(request: NextRequest) {
  try {
    const { userId } = requireAuth(request);
    const account = await userRepository.getPlatformAccount(userId, "hackerrank");
    if (!account) throw ApiError.badRequest("No HackerRank username linked");

    const result = await hackerrankService.syncSolvesForUser(userId, account.username);

    const todaysActivities = await activityRepository.findForUserOnDate(userId, todayUtc());
    if (todaysActivities.length > 0) {
      await streakService.recordActivityForDay(userId, todayUtc());
    }
    await scoringService.recomputeWeeklyScore(userId);

    return ok(result);
  } catch (error) {
    return fail(error);
  }
}

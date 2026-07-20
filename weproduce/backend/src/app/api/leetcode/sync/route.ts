import type { NextRequest } from "next/server";
import { requireAuth } from "@/middleware/withAuth";
import { userRepository } from "@/repositories/userRepository";
import { leetcodeService } from "@/services/leetcodeService";
import { scoringService } from "@/services/scoringService";
import { streakService } from "@/services/streakService";
import { activityRepository } from "@/repositories/activityRepository";
import { todayUtc } from "@/utils/dateUtils";
import { ok, fail, ApiError } from "@/utils/apiResponse";

export async function GET(request: NextRequest) {
  try {
    const { userId } = requireAuth(request);
    const account = await userRepository.getPlatformAccount(userId, "leetcode");
    if (!account) throw ApiError.badRequest("No LeetCode username linked");

    const result = await leetcodeService.syncSolvesForUser(userId, account.username);

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

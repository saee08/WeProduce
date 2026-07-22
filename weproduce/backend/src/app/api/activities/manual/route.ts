import type { NextRequest } from "next/server";
import { requireAuth } from "@/middleware/withAuth";
import { activityRepository } from "@/repositories/activityRepository";
import { scoringService } from "@/services/scoringService";
import { streakService } from "@/services/streakService";
import { ok, fail, ApiError } from "@/utils/apiResponse";
import type { Platform, Difficulty, ActivityType } from "@/types/domain";

const DIFFICULTY_POINTS: Record<Difficulty, number> = {
  easy: 10,
  medium: 25,
  hard: 50,
  none: 10,
};

export async function POST(request: NextRequest) {
  try {
    const { userId } = requireAuth(request);
    const body = await request.json();

    const platform: Platform = body.platform === "leetcode" ? "leetcode" : "hackerrank";
    const difficulty: Difficulty = (["easy", "medium", "hard"].includes(body.difficulty)
      ? body.difficulty
      : "medium") as Difficulty;
    const title = typeof body.title === "string" ? body.title.trim() : "";

    if (!title) {
      throw ApiError.badRequest("Problem title is required for manual solve logging");
    }

    const points = DIFFICULTY_POINTS[difficulty] ?? 10;
    const activityType: ActivityType =
      platform === "leetcode" ? "leetcode_solve" : "hackerrank_solve";

    const externalId = `manual_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const today = new Date();

    const activity = await activityRepository.createIfNotExists({
      userId,
      platform,
      activityType,
      title,
      difficulty,
      points,
      activityDate: today,
      externalId,
      metadata: {
        manual: true,
        problemUrl: body.problemUrl || null,
        loggedAt: today.toISOString(),
      },
    });

    // Recompute streak and weekly score
    await streakService.recordActivityForDay(userId, today);
    const score = await scoringService.recomputeWeeklyScore(userId, today);
    await scoringService.recomputeLeaderboardRanks(today);

    return ok({
      activity,
      score,
    });
  } catch (error) {
    return fail(error);
  }
}

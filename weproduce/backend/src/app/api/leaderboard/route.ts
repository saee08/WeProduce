import type { NextRequest } from "next/server";
import { requireAuth } from "@/middleware/withAuth";
import { scoreRepository } from "@/repositories/scoreRepository";
import { getIsoWeekStart } from "@/utils/dateUtils";
import { ok, fail } from "@/utils/apiResponse";

export async function GET(request: NextRequest) {
  try {
    requireAuth(request); // any authenticated member of the 3 can view it
    const weekStart = getIsoWeekStart(new Date());
    const leaderboard = await scoreRepository.leaderboardForWeek(weekStart);
    return ok(leaderboard, { weekStart: weekStart.toISOString().slice(0, 10) });
  } catch (error) {
    return fail(error);
  }
}

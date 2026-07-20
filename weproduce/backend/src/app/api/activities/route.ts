import type { NextRequest } from "next/server";
import { requireAuth } from "@/middleware/withAuth";
import { activityRepository } from "@/repositories/activityRepository";
import { ok, fail } from "@/utils/apiResponse";

export async function GET(request: NextRequest) {
  try {
    const { userId } = requireAuth(request);
    const limitParam = request.nextUrl.searchParams.get("limit");
    const limit = limitParam ? Math.min(Number(limitParam), 100) : 20;

    const activities = await activityRepository.findRecentForUser(userId, limit);
    return ok(
      activities.map((a) => ({
        id: a.id,
        platform: a.platform,
        activityType: a.activityType,
        title: a.title,
        difficulty: a.difficulty,
        points: a.points,
        activityDate: a.activityDate.toISOString().slice(0, 10),
        metadata: a.metadata,
      }))
    );
  } catch (error) {
    return fail(error);
  }
}

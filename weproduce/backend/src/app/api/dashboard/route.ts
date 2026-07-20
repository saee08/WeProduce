import type { NextRequest } from "next/server";
import { requireAuth } from "@/middleware/withAuth";
import { dashboardService } from "@/services/dashboardService";
import { ok, fail } from "@/utils/apiResponse";

export async function GET(request: NextRequest) {
  try {
    const { userId } = requireAuth(request);
    const data = await dashboardService.getDashboard(userId);
    return ok(data);
  } catch (error) {
    return fail(error);
  }
}

import type { NextRequest } from "next/server";
import { requireAuth } from "@/middleware/withAuth";
import { syncService } from "@/services/syncService";
import { ok, fail } from "@/utils/apiResponse";

export async function POST(request: NextRequest) {
  try {
    const { userId } = requireAuth(request);
    const result = await syncService.syncUser(userId);
    return ok(result);
  } catch (error) {
    return fail(error);
  }
}

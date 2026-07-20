import type { NextRequest } from "next/server";
import { requireAuth } from "@/middleware/withAuth";
import { profileController } from "@/controllers/profileController";
import { ok, fail } from "@/utils/apiResponse";

export async function GET(request: NextRequest) {
  try {
    const { userId } = requireAuth(request);
    const data = await profileController.getProfile(userId);
    return ok(data);
  } catch (error) {
    return fail(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = requireAuth(request);
    const body = await request.json();
    const data = await profileController.updateProfile(userId, body);
    return ok(data);
  } catch (error) {
    return fail(error);
  }
}

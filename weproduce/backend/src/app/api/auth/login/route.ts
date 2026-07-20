import type { NextRequest } from "next/server";
import { authController } from "@/controllers/authController";
import { ok, fail } from "@/utils/apiResponse";

// GET — mobile app opens this URL (or the returned `url`) to start Google consent.
export async function GET() {
  try {
    const data = authController.getAuthUrl();
    return ok(data);
  } catch (error) {
    return fail(error);
  }
}

// POST — exchanges the authorization code Google redirected back with for a session JWT.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await authController.login(body);
    return ok(data);
  } catch (error) {
    return fail(error);
  }
}

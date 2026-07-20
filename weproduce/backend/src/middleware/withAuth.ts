import type { NextRequest } from "next/server";
import { verifyAuthToken } from "@/utils/jwt";
import { ApiError } from "@/utils/apiResponse";
import type { AuthTokenPayload } from "@/types/domain";

/**
 * Extracts and verifies the Bearer token from an incoming request.
 * Throws ApiError.unauthorized() on any failure — callers should let
 * this propagate up to the route handler's try/catch → fail(error).
 */
export function requireAuth(request: NextRequest): AuthTokenPayload {
  const header = request.headers.get("authorization");

  if (!header || !header.startsWith("Bearer ")) {
    throw ApiError.unauthorized("Missing or malformed Authorization header");
  }

  const token = header.slice("Bearer ".length).trim();

  try {
    return verifyAuthToken(token);
  } catch {
    throw ApiError.unauthorized("Invalid or expired session token");
  }
}

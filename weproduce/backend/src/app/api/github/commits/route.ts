import type { NextRequest } from "next/server";
import { requireAuth } from "@/middleware/withAuth";
import { userRepository } from "@/repositories/userRepository";
import { githubService } from "@/services/githubService";
import { ok, fail, ApiError } from "@/utils/apiResponse";

export async function GET(request: NextRequest) {
  try {
    const { userId } = requireAuth(request);
    const account = await userRepository.getPlatformAccount(userId, "github");

    if (!account) throw ApiError.badRequest("No GitHub account linked");
    if (!account.accessToken) throw ApiError.badRequest("GitHub account is linked but has no access token");

    const commits = await githubService.fetchRecentCommits(account.accessToken, account.username);
    return ok(commits);
  } catch (error) {
    return fail(error);
  }
}

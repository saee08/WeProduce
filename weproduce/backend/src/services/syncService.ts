import { userRepository } from "@/repositories/userRepository";
import { activityRepository } from "@/repositories/activityRepository";
import { githubService } from "@/services/githubService";
import { leetcodeService } from "@/services/leetcodeService";
import { hackerrankService } from "@/services/hackerrankService";
import { scoringService } from "@/services/scoringService";
import { streakService } from "@/services/streakService";
import { todayUtc } from "@/utils/dateUtils";
import { logger } from "@/utils/logger";
import { ApiError } from "@/utils/apiResponse";

export const syncService = {
  /**
   * Full sync pipeline for a single user:
   *   1. Pull fresh activity from every linked platform (best-effort, per-platform)
   *   2. Update streak if anything was solved/pushed today
   *   3. Recompute this week's aggregate score
   *   4. Recompute leaderboard ranks for everyone
   */
  async syncUser(userId: string) {
    const accounts = await userRepository.getPlatformAccounts(userId);
    if (accounts.length === 0) {
      throw ApiError.badRequest("No linked platform accounts to sync. Add GitHub/LeetCode/HackerRank usernames first.");
    }

    const results: Record<string, unknown> = {};

    for (const account of accounts) {
      try {
        if (account.platform === "github") {
          if (!account.accessToken) {
            results.github = { skipped: true, reason: "No GitHub access token linked" };
            continue;
          }
          results.github = await githubService.syncCommitsForUser(userId, account.accessToken, account.username);
        } else if (account.platform === "leetcode") {
          results.leetcode = await leetcodeService.syncSolvesForUser(userId, account.username);
        } else if (account.platform === "hackerrank") {
          results.hackerrank = await hackerrankService.syncSolvesForUser(userId, account.username);
        }
        await userRepository.markSyncResult(userId, account.platform, "success");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown sync error";
        logger.error({ userId, platform: account.platform, err }, "Platform sync failed");
        results[account.platform] = { error: message };
        await userRepository.markSyncResult(userId, account.platform, "error", message);
      }
    }

    // Did the user do anything qualifying today? If so, bump the streak.
    const todaysActivities = await activityRepository.findForUserOnDate(userId, todayUtc());
    if (todaysActivities.length > 0) {
      await streakService.recordActivityForDay(userId, todayUtc());
    }

    const score = await scoringService.recomputeWeeklyScore(userId);
    await scoringService.recomputeLeaderboardRanks();

    return { platformResults: results, weeklyScore: score.totalPoints };
  },
};

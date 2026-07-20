import axios from "axios";
import { activityRepository } from "@/repositories/activityRepository";
import { pointsForHackerRank } from "@/config/scoring";
import { toUtcMidnight } from "@/utils/dateUtils";
import { logger } from "@/utils/logger";

interface HackerRankSubmission {
  challenge_slug: string;
  challenge_name: string;
  created_at: string; // ISO
}

/**
 * IMPORTANT — HackerRank has no official public API for reading a user's
 * submission history, and its badges/profile endpoints are not guaranteed
 * to stay stable or accessible without auth. This service is built against
 * the best available unofficial `rest/contests/master/hackers/{username}/
 * recent_challenges` endpoint used by their own profile page, but it can
 * return 403/empty for private profiles or if HackerRank changes its
 * frontend API.
 *
 * Because of that fragility, this service ALSO exposes
 * `recordManualSolve`, so a sync failure degrades to manual logging
 * from the mobile app rather than silently losing points. Document this
 * tradeoff for users during onboarding (see docs/SETUP.md).
 */
const BASE_URL = process.env.HACKERRANK_BASE_URL ?? "https://www.hackerrank.com";

export const hackerrankService = {
  async fetchRecentSubmissions(username: string): Promise<HackerRankSubmission[]> {
    const url = `${BASE_URL}/rest/contests/master/hackers/${encodeURIComponent(username)}/recent_challenges`;
    const { data } = await axios.get(url, { timeout: 10_000 });
    return data?.models ?? [];
  },

  async syncSolvesForUser(userId: string, hackerrankUsername: string) {
    let submissions: HackerRankSubmission[] = [];

    try {
      submissions = await this.fetchRecentSubmissions(hackerrankUsername);
    } catch (err) {
      logger.warn(
        { userId, hackerrankUsername, err },
        "HackerRank auto-sync unavailable — user should log solves manually"
      );
      return { solvesProcessed: 0, created: 0, autoSyncAvailable: false };
    }

    let created = 0;
    for (const submission of submissions) {
      await activityRepository.createIfNotExists({
        userId,
        platform: "hackerrank",
        activityType: "hackerrank_solve",
        title: submission.challenge_name,
        difficulty: "none",
        points: pointsForHackerRank(),
        activityDate: toUtcMidnight(new Date(submission.created_at)),
        externalId: submission.challenge_slug,
        metadata: {},
      });
      created += 1;
    }

    logger.info({ userId, hackerrankUsername, count: submissions.length }, "HackerRank sync complete");
    return { solvesProcessed: submissions.length, created, autoSyncAvailable: true };
  },

  /** Fallback path used by the mobile app when auto-sync is unavailable. */
  async recordManualSolve(userId: string, challengeName: string, solvedAt: Date) {
    return activityRepository.createIfNotExists({
      userId,
      platform: "hackerrank",
      activityType: "hackerrank_solve",
      title: challengeName,
      difficulty: "none",
      points: pointsForHackerRank(),
      activityDate: toUtcMidnight(solvedAt),
      externalId: `manual-${userId}-${challengeName}-${solvedAt.toISOString()}`,
      metadata: { source: "manual" },
    });
  },
};

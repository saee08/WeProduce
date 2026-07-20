import axios from "axios";
import { activityRepository } from "@/repositories/activityRepository";
import { pointsForLeetCode } from "@/config/scoring";
import { toUtcMidnight } from "@/utils/dateUtils";
import { logger } from "@/utils/logger";
import type { Difficulty } from "@/types/domain";

interface LeetCodeSubmission {
  title: string;
  titleSlug: string;
  timestamp: string; // unix seconds, as string
  statusDisplay: string;
  lang: string;
}

interface LeetCodeQuestionDifficulty {
  [titleSlug: string]: "Easy" | "Medium" | "Hard";
}

/**
 * LeetCode does not offer an official public API. This uses their
 * unauthenticated GraphQL endpoint that powers the public profile page
 * (recentAcSubmissionList), which is widely used for this exact purpose.
 * It returns only accepted ("AC") submissions with no per-problem
 * difficulty — a second query resolves difficulty per problem slug.
 *
 * Caveat: this endpoint is undocumented and may change without notice.
 * If it breaks, the sync should fail gracefully (see syncSolvesForUser).
 */
const GRAPHQL_URL = process.env.LEETCODE_GRAPHQL_URL ?? "https://leetcode.com/graphql";

export const leetcodeService = {
  async fetchRecentAcceptedSubmissions(username: string, limit = 20): Promise<LeetCodeSubmission[]> {
    const query = `
      query recentAcSubmissions($username: String!, $limit: Int!) {
        recentAcSubmissionList(username: $username, limit: $limit) {
          title
          titleSlug
          timestamp
          statusDisplay
          lang
        }
      }
    `;

    const { data } = await axios.post(
      GRAPHQL_URL,
      { query, variables: { username, limit } },
      { headers: { "Content-Type": "application/json" }, timeout: 10_000 }
    );

    return data?.data?.recentAcSubmissionList ?? [];
  },

  async fetchDifficulty(titleSlug: string): Promise<"Easy" | "Medium" | "Hard" | null> {
    const query = `
      query questionDifficulty($titleSlug: String!) {
        question(titleSlug: $titleSlug) {
          difficulty
        }
      }
    `;

    const { data } = await axios.post(
      GRAPHQL_URL,
      { query, variables: { titleSlug } },
      { headers: { "Content-Type": "application/json" }, timeout: 10_000 }
    );

    return data?.data?.question?.difficulty ?? null;
  },

  async syncSolvesForUser(userId: string, leetcodeUsername: string) {
    let submissions: LeetCodeSubmission[] = [];

    try {
      submissions = await this.fetchRecentAcceptedSubmissions(leetcodeUsername);
    } catch (err) {
      logger.error({ userId, leetcodeUsername, err }, "LeetCode fetch failed");
      throw new Error("Unable to reach LeetCode. It may be rate-limiting or the profile is private.");
    }

    const difficultyCache: LeetCodeQuestionDifficulty = {};
    let created = 0;

    for (const submission of submissions) {
      if (!difficultyCache[submission.titleSlug]) {
        const difficulty = await this.fetchDifficulty(submission.titleSlug);
        difficultyCache[submission.titleSlug] = difficulty ?? "Easy";
      }

      const difficulty = difficultyCache[submission.titleSlug].toLowerCase() as Difficulty;
      const points = pointsForLeetCode(difficulty as "easy" | "medium" | "hard");

      await activityRepository.createIfNotExists({
        userId,
        platform: "leetcode",
        activityType: "leetcode_solve",
        title: submission.title,
        difficulty,
        points,
        activityDate: toUtcMidnight(new Date(Number(submission.timestamp) * 1000)),
        externalId: `${submission.titleSlug}-${submission.timestamp}`,
        metadata: { lang: submission.lang, titleSlug: submission.titleSlug },
      });
      created += 1;
    }

    logger.info({ userId, leetcodeUsername, count: submissions.length }, "LeetCode sync complete");
    return { solvesProcessed: submissions.length, created };
  },
};

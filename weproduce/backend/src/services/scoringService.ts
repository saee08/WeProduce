import { activityRepository } from "@/repositories/activityRepository";
import { scoreRepository } from "@/repositories/scoreRepository";
import { getIsoWeekStart, getIsoWeekEnd } from "@/utils/dateUtils";
import { logger } from "@/utils/logger";

export const scoringService = {
  /**
   * Recomputes and persists the single unified weekly score for a user,
   * broken down by source (purely for internal auditing — the UI only
   * ever shows the total).
   */
  async recomputeWeeklyScore(userId: string, referenceDate: Date = new Date()) {
    const weekStart = getIsoWeekStart(referenceDate);
    const weekEnd = getIsoWeekEnd(weekStart);

    const activities = await activityRepository.findForUserInRange(userId, weekStart, weekEnd);

    let leetcodePoints = 0;
    let hackerrankPoints = 0;
    let githubPoints = 0;
    let streakBonusPoints = 0;

    for (const activity of activities) {
      switch (activity.activityType) {
        case "leetcode_solve":
          leetcodePoints += activity.points;
          break;
        case "hackerrank_solve":
          hackerrankPoints += activity.points;
          break;
        case "github_push":
          githubPoints += activity.points;
          break;
        case "streak_bonus":
          streakBonusPoints += activity.points;
          break;
      }
    }

    const score = await scoreRepository.upsertWeeklyBreakdown({
      userId,
      weekStartDate: weekStart,
      weekEndDate: weekEnd,
      leetcodePoints,
      hackerrankPoints,
      githubPoints,
      streakBonusPoints,
    });

    logger.info({ userId, total: score.totalPoints }, "Weekly score recomputed");
    return score;
  },

  /** Recomputes ranks for everyone based on the current week's totals. */
  async recomputeLeaderboardRanks(referenceDate: Date = new Date()) {
    const weekStart = getIsoWeekStart(referenceDate);
    const leaderboard = await scoreRepository.leaderboardForWeek(weekStart);
    await scoreRepository.persistRanks(
      weekStart,
      leaderboard.map((entry) => entry.userId)
    );
    return leaderboard;
  },
};

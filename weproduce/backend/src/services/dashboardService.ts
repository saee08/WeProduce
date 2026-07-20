import { activityRepository } from "@/repositories/activityRepository";
import { scoreRepository } from "@/repositories/scoreRepository";
import { streakRepository } from "@/repositories/streakRepository";
import { getIsoWeekStart, todayUtc } from "@/utils/dateUtils";
import type { DashboardDTO, ActivityDTO } from "@/types/domain";

export const dashboardService = {
  async getDashboard(userId: string): Promise<DashboardDTO> {
    const weekStart = getIsoWeekStart(new Date());
    const today = todayUtc();

    const [score, streak, todaysActivities, recent, leaderboard] = await Promise.all([
      scoreRepository.findForUserWeek(userId, weekStart),
      streakRepository.findForUser(userId),
      activityRepository.findForUserOnDate(userId, today),
      activityRepository.findRecentForUser(userId, 10),
      scoreRepository.leaderboardForWeek(weekStart),
    ]);

    const leetcodeSolved = todaysActivities.filter((a) => a.activityType === "leetcode_solve").length;
    const hackerrankSolved = todaysActivities.filter((a) => a.activityType === "hackerrank_solve").length;
    const githubCommits = todaysActivities.filter((a) => a.activityType === "github_push").length;
    const pointsEarnedToday = todaysActivities.reduce((sum, a) => sum + a.points, 0);

    const toActivityDTO = (a: (typeof recent)[number]): ActivityDTO => ({
      id: a.id,
      platform: a.platform,
      activityType: a.activityType,
      title: a.title,
      difficulty: a.difficulty,
      points: a.points,
      activityDate: a.activityDate.toISOString().slice(0, 10),
      metadata: (a.metadata as Record<string, unknown>) ?? {},
    });

    const myRank = leaderboard.find((entry) => entry.userId === userId)?.rank ?? null;

    return {
      weeklyScore: score?.totalPoints ?? 0,
      currentRank: myRank,
      currentStreak: streak?.currentStreak ?? 0,
      longestStreak: streak?.longestStreak ?? 0,
      today: { leetcodeSolved, hackerrankSolved, githubCommits, pointsEarnedToday },
      recentActivity: recent.map(toActivityDTO),
      leaderboardPreview: leaderboard.slice(0, 3),
    };
  },
};

import { prisma } from "@/lib/prisma";

export const scoreRepository = {
  findForUserWeek(userId: string, weekStartDate: Date) {
    return prisma.score.findUnique({ where: { userId_weekStartDate: { userId, weekStartDate } } });
  },

  upsertWeeklyBreakdown(params: {
    userId: string;
    weekStartDate: Date;
    weekEndDate: Date;
    leetcodePoints: number;
    hackerrankPoints: number;
    githubPoints: number;
    streakBonusPoints: number;
  }) {
    const totalPoints =
      params.leetcodePoints + params.hackerrankPoints + params.githubPoints + params.streakBonusPoints;

    return prisma.score.upsert({
      where: { userId_weekStartDate: { userId: params.userId, weekStartDate: params.weekStartDate } },
      update: {
        leetcodePoints: params.leetcodePoints,
        hackerrankPoints: params.hackerrankPoints,
        githubPoints: params.githubPoints,
        streakBonusPoints: params.streakBonusPoints,
        totalPoints,
      },
      create: {
        userId: params.userId,
        weekStartDate: params.weekStartDate,
        weekEndDate: params.weekEndDate,
        leetcodePoints: params.leetcodePoints,
        hackerrankPoints: params.hackerrankPoints,
        githubPoints: params.githubPoints,
        streakBonusPoints: params.streakBonusPoints,
        totalPoints,
      },
    });
  },

  /** Leaderboard is always scoped to the current week — there is only one board. */
  async leaderboardForWeek(weekStartDate: Date) {
    const scores = await prisma.score.findMany({
      where: { weekStartDate },
      orderBy: { totalPoints: "desc" },
      include: {
        user: { include: { profile: true, streak: true } },
      },
    });

    return scores.map((s, index) => ({
      rank: index + 1,
      userId: s.userId,
      displayName: s.user.profile?.displayName ?? "Unknown",
      avatarUrl: s.user.profile?.avatarUrl ?? null,
      weeklyScore: s.totalPoints,
      currentStreak: s.user.streak?.currentStreak ?? 0,
    }));
  },

  async persistRanks(weekStartDate: Date, rankedUserIds: string[]) {
    await prisma.$transaction(
      rankedUserIds.map((userId, index) =>
        prisma.score.update({
          where: { userId_weekStartDate: { userId, weekStartDate } },
          data: { rank: index + 1 },
        })
      )
    );
  },
};

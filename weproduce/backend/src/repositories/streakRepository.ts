import { prisma } from "@/lib/prisma";

export const streakRepository = {
  findForUser(userId: string) {
    return prisma.streak.findUnique({ where: { userId } });
  },

  upsert(userId: string, data: { currentStreak: number; longestStreak: number; lastActiveDate: Date }) {
    return prisma.streak.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data },
    });
  },
};

import { prisma } from "@/lib/prisma";
import type { Platform, ActivityType, Difficulty } from "@/types/domain";
import type { Prisma } from "@prisma/client";

export interface CreateActivityInput {
  userId: string;
  platform: Platform;
  activityType: ActivityType;
  title: string;
  difficulty: Difficulty;
  points: number;
  activityDate: Date;
  externalId: string; // used for idempotent dedupe
  metadata?: Record<string, unknown>;
}

export const activityRepository = {
  /**
   * Idempotent insert — relies on the (userId, platform, externalId) unique
   * constraint so re-running a sync never double-counts the same event.
   */
  async createIfNotExists(input: CreateActivityInput) {
    return prisma.activity.upsert({
      where: {
        userId_platform_externalId: {
          userId: input.userId,
          platform: input.platform,
          externalId: input.externalId,
        },
      },
      update: {}, // no-op if it already exists — points are never recomputed by an update
      create: {
        userId: input.userId,
        platform: input.platform,
        activityType: input.activityType,
        title: input.title,
        difficulty: input.difficulty,
        points: input.points,
        activityDate: input.activityDate,
        externalId: input.externalId,
        metadata: (input.metadata ?? {}) as Prisma.InputJsonValue,
      },
    });
  },

  findRecentForUser(userId: string, limit = 20) {
    return prisma.activity.findMany({
      where: { userId },
      orderBy: { activityDate: "desc" },
      take: limit,
    });
  },

  findForUserOnDate(userId: string, date: Date) {
    return prisma.activity.findMany({
      where: {
        userId,
        activityDate: date,
      },
    });
  },

  findForUserInRange(userId: string, start: Date, end: Date) {
    return prisma.activity.findMany({
      where: { userId, activityDate: { gte: start, lte: end } },
      orderBy: { activityDate: "desc" },
    });
  },

  sumPointsForUserInRange(userId: string, start: Date, end: Date) {
    return prisma.activity.aggregate({
      where: { userId, activityDate: { gte: start, lte: end } },
      _sum: { points: true },
    });
  },
};

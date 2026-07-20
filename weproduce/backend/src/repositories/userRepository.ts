import { prisma } from "@/lib/prisma";
import type { Platform } from "@/types/domain";

export const userRepository = {
  findByGoogleId(googleId: string) {
    return prisma.user.findUnique({ where: { googleId }, include: { profile: true } });
  },

  findById(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true, platformAccounts: true, streak: true },
    });
  },

  createFromGoogleProfile(params: {
    googleId: string;
    email: string;
    emailVerified: boolean;
    displayName: string;
    avatarUrl: string | null;
  }) {
    return prisma.user.create({
      data: {
        googleId: params.googleId,
        email: params.email,
        emailVerified: params.emailVerified,
        profile: {
          create: {
            displayName: params.displayName,
            avatarUrl: params.avatarUrl,
          },
        },
        streak: {
          create: { currentStreak: 0, longestStreak: 0 },
        },
      },
      include: { profile: true },
    });
  },

  updateProfile(
    userId: string,
    data: Partial<{ displayName: string; avatarUrl: string; bio: string; onboardingComplete: boolean }>
  ) {
    return prisma.profile.update({ where: { userId }, data });
  },

  upsertPlatformAccount(userId: string, platform: Platform, username: string, accessToken?: string) {
    return prisma.platformAccount.upsert({
      where: { userId_platform: { userId, platform } },
      update: { username, ...(accessToken ? { accessToken } : {}) },
      create: { userId, platform, username, accessToken },
    });
  },

  getPlatformAccounts(userId: string) {
    return prisma.platformAccount.findMany({ where: { userId } });
  },

  getPlatformAccount(userId: string, platform: Platform) {
    return prisma.platformAccount.findUnique({ where: { userId_platform: { userId, platform } } });
  },

  markSyncResult(userId: string, platform: Platform, status: "success" | "error", error?: string) {
    return prisma.platformAccount.update({
      where: { userId_platform: { userId, platform } },
      data: { lastSyncedAt: new Date(), syncStatus: status, syncError: error ?? null },
    });
  },
};

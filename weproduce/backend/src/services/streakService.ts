import { streakRepository } from "@/repositories/streakRepository";
import { isConsecutiveDay, isSameUtcDay, toUtcMidnight } from "@/utils/dateUtils";
import { logger } from "@/utils/logger";

export const streakService = {
  /**
   * Call this once per user after a day's activity sync completes and at
   * least one qualifying activity (leetcode/hackerrank solve or github push)
   * was recorded for `activityDate`. Idempotent for the same day.
   */
  async recordActivityForDay(userId: string, activityDate: Date) {
    const day = toUtcMidnight(activityDate);
    const streak = await streakRepository.findForUser(userId);

    if (!streak || !streak.lastActiveDate) {
      const updated = await streakRepository.upsert(userId, {
        currentStreak: 1,
        longestStreak: Math.max(1, streak?.longestStreak ?? 0),
        lastActiveDate: day,
      });
      logger.info({ userId, streak: updated.currentStreak }, "Streak started");
      return updated;
    }

    if (isSameUtcDay(streak.lastActiveDate, day)) {
      // Already recorded today — no-op, prevents double increment from re-syncs.
      return streak;
    }

    const isConsecutive = isConsecutiveDay(streak.lastActiveDate, day);
    const newCurrent = isConsecutive ? streak.currentStreak + 1 : 1;
    const newLongest = Math.max(streak.longestStreak, newCurrent);

    const updated = await streakRepository.upsert(userId, {
      currentStreak: newCurrent,
      longestStreak: newLongest,
      lastActiveDate: day,
    });

    logger.info({ userId, current: newCurrent, longest: newLongest, isConsecutive }, "Streak updated");
    return updated;
  },

  /**
   * Run daily (e.g. via cron, just after midnight UTC) for every user.
   * If a user's lastActiveDate is not "yesterday" or "today", their streak
   * has been broken by a missed day and must reset to 0.
   */
  async resetIfMissedDay(userId: string, asOf: Date = new Date()) {
    const streak = await streakRepository.findForUser(userId);
    if (!streak || !streak.lastActiveDate) return streak;

    const today = toUtcMidnight(asOf);
    const yesterday = new Date(today);
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);

    const stillValid = isSameUtcDay(streak.lastActiveDate, today) || isSameUtcDay(streak.lastActiveDate, yesterday);

    if (!stillValid && streak.currentStreak !== 0) {
      logger.info({ userId }, "Streak reset — missed day detected");
      return streakRepository.upsert(userId, {
        currentStreak: 0,
        longestStreak: streak.longestStreak,
        lastActiveDate: streak.lastActiveDate,
      });
    }

    return streak;
  },
};

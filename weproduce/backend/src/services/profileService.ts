import { userRepository } from "@/repositories/userRepository";
import { scoreRepository } from "@/repositories/scoreRepository";
import { getIsoWeekStart } from "@/utils/dateUtils";
import { ApiError } from "@/utils/apiResponse";
import type { ProfileDTO, Platform } from "@/types/domain";

export const profileService = {
  async getProfile(userId: string): Promise<ProfileDTO> {
    const user = await userRepository.findById(userId);
    if (!user || !user.profile) throw ApiError.notFound("Profile not found");

    const weekStart = getIsoWeekStart(new Date());
    const score = await scoreRepository.findForUserWeek(userId, weekStart);

    const byPlatform = (platform: Platform) =>
      user.platformAccounts.find((a) => a.platform === platform)?.username ?? null;

    return {
      userId: user.id,
      displayName: user.profile.displayName,
      avatarUrl: user.profile.avatarUrl,
      bio: user.profile.bio,
      github: byPlatform("github"),
      leetcode: byPlatform("leetcode"),
      hackerrank: byPlatform("hackerrank"),
      currentStreak: user.streak?.currentStreak ?? 0,
      longestStreak: user.streak?.longestStreak ?? 0,
      weeklyScore: score?.totalPoints ?? 0,
      onboardingComplete: user.profile.onboardingComplete,
    };
  },

  async updateProfile(
    userId: string,
    input: {
      displayName?: string;
      avatarUrl?: string;
      bio?: string;
      github?: string;
      leetcode?: string;
      hackerrank?: string;
      githubPat?: string;
    }
  ) {
    const { github, leetcode, hackerrank, githubPat, ...profileFields } = input;

    if (Object.keys(profileFields).length > 0) {
      await userRepository.updateProfile(userId, profileFields);
    }
    if (github) await userRepository.upsertPlatformAccount(userId, "github", github, githubPat);
    if (leetcode) await userRepository.upsertPlatformAccount(userId, "leetcode", leetcode);
    if (hackerrank) await userRepository.upsertPlatformAccount(userId, "hackerrank", hackerrank);

    // Mark onboarding complete once all three platforms are linked.
    const accounts = await userRepository.getPlatformAccounts(userId);
    const platforms = new Set(accounts.map((a) => a.platform));
    if (["github", "leetcode", "hackerrank"].every((p) => platforms.has(p as never))) {
      await userRepository.updateProfile(userId, { onboardingComplete: true });
    }

    return this.getProfile(userId);
  },
};

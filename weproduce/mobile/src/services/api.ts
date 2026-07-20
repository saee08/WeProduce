import { apiGet, apiPost, apiPut } from "./apiClient";
import type { ProfileDTO, DashboardDTO, LeaderboardEntryDTO, ActivityDTO } from "@/types/domain";

export const authApi = {
  getGoogleAuthUrl: () => apiGet<{ url: string }>("/auth/login"),
  loginWithCode: (code: string) =>
    apiPost<{ token: string; userId: string; isNewUser: boolean }>("/auth/login", { code }),
};

export const profileApi = {
  getProfile: () => apiGet<ProfileDTO>("/profile"),
  updateProfile: (input: Partial<ProfileDTO> & { github?: string; leetcode?: string; hackerrank?: string }) =>
    apiPut<ProfileDTO>("/profile", input),
};

export const dashboardApi = {
  getDashboard: () => apiGet<DashboardDTO>("/dashboard"),
};

export const leaderboardApi = {
  getLeaderboard: () => apiGet<LeaderboardEntryDTO[]>("/leaderboard"),
};

export const activitiesApi = {
  getActivities: (limit = 20) => apiGet<ActivityDTO[]>("/activities", { limit }),
  syncAll: () => apiPost<{ platformResults: Record<string, unknown>; weeklyScore: number }>("/activities/sync"),
};

export const githubApi = {
  getCommits: () => apiGet<unknown[]>("/github/commits"),
};

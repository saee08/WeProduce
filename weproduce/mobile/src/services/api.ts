import { apiGet, apiPost, apiPut } from "./apiClient";
import type {
  ProfileDTO,
  DashboardDTO,
  LeaderboardEntryDTO,
  ActivityDTO,
  DiscussionPostDTO,
  DiscussionCommentDTO,
  ManualSolveInput,
} from "@/types/domain";

export const authApi = {
  getGoogleAuthUrl: () => apiGet<{ url: string }>("/auth/login"),
  loginWithCode: (code: string) =>
    apiPost<{ token: string; userId: string; isNewUser: boolean }>("/auth/login", { code }),
};

export const profileApi = {
  getProfile: () => apiGet<ProfileDTO>("/profile"),
  getPublicProfile: (userId: string) => apiGet<ProfileDTO>("/profile", { userId }),
  updateProfile: (
    input: Partial<ProfileDTO> & {
      github?: string;
      leetcode?: string;
      hackerrank?: string;
      githubPat?: string;
    }
  ) => apiPut<ProfileDTO>("/profile", input),
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
  logManualSolve: (input: ManualSolveInput) =>
    apiPost<{ activity: ActivityDTO; score: unknown }>("/activities/manual", input),
};

export const discussionsApi = {
  getPosts: () => apiGet<DiscussionPostDTO[]>("/discussions"),
  createPost: (title: string, content: string) =>
    apiPost<DiscussionPostDTO>("/discussions", { title, content }),
  getComments: (postId: string) => apiGet<DiscussionCommentDTO[]>(`/discussions/${postId}/comments`),
  createComment: (postId: string, content: string) =>
    apiPost<DiscussionCommentDTO>(`/discussions/${postId}/comments`, { content }),
};

export const githubApi = {
  getCommits: () => apiGet<unknown[]>("/github/commits"),
};

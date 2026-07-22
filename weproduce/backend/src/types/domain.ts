export type Platform = "github" | "leetcode" | "hackerrank";
export type ActivityType = "leetcode_solve" | "hackerrank_solve" | "github_push" | "streak_bonus";
export type Difficulty = "easy" | "medium" | "hard" | "none";

export interface AuthTokenPayload {
  userId: string;
  email: string;
}

export interface ProfileDTO {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  github: string | null;
  leetcode: string | null;
  hackerrank: string | null;
  currentStreak: number;
  longestStreak: number;
  weeklyScore: number;
  onboardingComplete: boolean;
}

export interface LeaderboardEntryDTO {
  rank: number;
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  weeklyScore: number;
  currentStreak: number;
}

export interface ActivityDTO {
  id: string;
  platform: Platform;
  activityType: ActivityType;
  title: string;
  difficulty: Difficulty;
  points: number;
  activityDate: string; // ISO date
  metadata: Record<string, unknown>;
}

export interface DashboardDTO {
  weeklyScore: number;
  currentRank: number | null;
  currentStreak: number;
  longestStreak: number;
  today: {
    leetcodeSolved: number;
    hackerrankSolved: number;
    githubCommits: number;
    pointsEarnedToday: number;
  };
  recentActivity: ActivityDTO[];
  leaderboardPreview: LeaderboardEntryDTO[];
}

export interface DiscussionPostDTO {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    displayName: string;
    avatarUrl: string | null;
  };
  commentCount: number;
}

export interface DiscussionCommentDTO {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    displayName: string;
    avatarUrl: string | null;
  };
}

export interface ManualSolveInput {
  platform: "hackerrank" | "leetcode";
  title: string;
  difficulty: "easy" | "medium" | "hard";
  problemUrl?: string;
}

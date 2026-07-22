import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dashboardApi, leaderboardApi, activitiesApi, profileApi } from "@/services/api";
import type { ProfileDTO } from "@/types/domain";

export const queryKeys = {
  dashboard: ["dashboard"] as const,
  leaderboard: ["leaderboard"] as const,
  activities: (limit: number) => ["activities", limit] as const,
  profile: ["profile"] as const,
};

export function useDashboard() {
  return useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: dashboardApi.getDashboard,
    staleTime: 30_000,
  });
}

export function useLeaderboard() {
  return useQuery({
    queryKey: queryKeys.leaderboard,
    queryFn: leaderboardApi.getLeaderboard,
    staleTime: 30_000,
  });
}

export function useActivities(limit = 20) {
  return useQuery({
    queryKey: queryKeys.activities(limit),
    queryFn: () => activitiesApi.getActivities(limit),
    staleTime: 30_000,
  });
}

export function useSyncActivities() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: activitiesApi.syncAll,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      queryClient.invalidateQueries({ queryKey: queryKeys.leaderboard });
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (
      input: Partial<ProfileDTO> & {
        github?: string;
        leetcode?: string;
        hackerrank?: string;
        githubPat?: string;
      }
    ) => profileApi.updateProfile(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
    },
  });
}

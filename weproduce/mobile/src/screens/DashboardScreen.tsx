import React from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useDashboard, useSyncActivities } from "@/hooks/useApiQueries";
import { ScoreCard } from "@/components/ScoreCard";
import { StreakCard } from "@/components/StreakCard";
import { WeeklyProgressCard } from "@/components/WeeklyProgressCard";
import { LeaderboardCard } from "@/components/LeaderboardCard";
import { ActivityCard } from "@/components/ActivityCard";
import { LoadingState, ErrorState, EmptyState, PrimaryButton } from "@/components/UIPrimitives";

export function DashboardScreen() {
  const { profile } = useAuth();
  const { data, isLoading, isError, refetch, isRefetching } = useDashboard();
  const sync = useSyncActivities();

  if (isLoading) return <LoadingState message="Loading your dashboard..." />;
  if (isError || !data) return <ErrorState message="Couldn't load your dashboard." onRetry={refetch} />;

  const greetingName = profile?.displayName?.split(" ")[0] ?? "there";

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ padding: 20, paddingTop: 60, paddingBottom: 40 }}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#6C5CE7" />}
    >
      <Text className="text-textSecondary text-sm">Welcome back,</Text>
      <Text className="text-textPrimary text-2xl font-extrabold mb-5">{greetingName} 👋</Text>

      <ScoreCard weeklyScore={data.weeklyScore} rank={data.currentRank} />

      <View className="flex-row mt-4" style={{ gap: 12 }}>
        <StreakCard currentStreak={data.currentStreak} longestStreak={data.longestStreak} />
      </View>

      <View className="mt-4">
        <WeeklyProgressCard
          leetcodeSolved={data.today.leetcodeSolved}
          hackerrankSolved={data.today.hackerrankSolved}
          githubCommits={data.today.githubCommits}
          pointsEarnedToday={data.today.pointsEarnedToday}
        />
      </View>

      <View className="mt-6">
        <PrimaryButton
          label="Sync My Activity"
          onPress={() => sync.mutate()}
          loading={sync.isPending}
          variant="secondary"
        />
      </View>

      <Text className="text-textPrimary font-semibold text-base mt-8 mb-3">Leaderboard Preview</Text>
      {data.leaderboardPreview.length === 0 ? (
        <EmptyState title="No scores yet this week" subtitle="Sync your activity to get on the board." />
      ) : (
        data.leaderboardPreview.map((entry: any) => (
          <LeaderboardCard key={entry.userId} entry={entry} isCurrentUser={entry.userId === profile?.userId} />
        ))
      )}

      <Text className="text-textPrimary font-semibold text-base mt-4 mb-3">Recent Activity</Text>
      {data.recentActivity.length === 0 ? (
        <EmptyState icon="🌱" title="No activity yet" subtitle="Solve a problem or push a commit to get started." />
      ) : (
        data.recentActivity.map((activity: any) => <ActivityCard key={activity.id} activity={activity} />)
      )}
    </ScrollView>
  );
}

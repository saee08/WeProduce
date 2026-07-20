import React from "react";
import { View, Text, FlatList, RefreshControl } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useLeaderboard } from "@/hooks/useApiQueries";
import { LeaderboardCard } from "@/components/LeaderboardCard";
import { LoadingState, ErrorState, EmptyState } from "@/components/UIPrimitives";
import type { LeaderboardEntryDTO } from "@/types/domain";

const PODIUM_EMOJI: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

function PodiumRow({ entries }: { entries: LeaderboardEntryDTO[] }) {
  if (entries.length === 0) return null;
  return (
    <View className="flex-row justify-center items-end mb-6" style={{ gap: 16 }}>
      {entries.map((entry) => (
        <View key={entry.userId} className="items-center">
          <Text className="text-3xl mb-1">{PODIUM_EMOJI[entry.rank] ?? "🏅"}</Text>
          <Text className="text-textPrimary font-semibold text-sm" numberOfLines={1}>
            {entry.displayName}
          </Text>
          <Text className="text-accent font-extrabold text-lg">{entry.weeklyScore}</Text>
        </View>
      ))}
    </View>
  );
}

export function LeaderboardScreen() {
  const { profile } = useAuth();
  const { data, isLoading, isError, refetch, isRefetching } = useLeaderboard();

  if (isLoading) return <LoadingState message="Loading the leaderboard..." />;
  if (isError || !data) return <ErrorState message="Couldn't load the leaderboard." onRetry={refetch} />;

  const topThree = data.slice(0, 3);

  return (
    <FlatList
      className="flex-1 bg-background"
      contentContainerStyle={{ padding: 20, paddingTop: 60, paddingBottom: 40 }}
      data={data}
      keyExtractor={(item) => item.userId}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#6C5CE7" />}
      ListHeaderComponent={
        <View>
          <Text className="text-textPrimary text-2xl font-extrabold mb-1">Leaderboard</Text>
          <Text className="text-textSecondary text-sm mb-6">This week · resets every Monday</Text>
          <PodiumRow entries={topThree} />
        </View>
      }
      ListEmptyComponent={<EmptyState title="No one has scored yet" subtitle="Be the first to sync your activity." />}
      renderItem={({ item }) => <LeaderboardCard entry={item} isCurrentUser={item.userId === profile?.userId} />}
    />
  );
}

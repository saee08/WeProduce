import React from "react";
import { View, Text, FlatList, RefreshControl } from "react-native";
import { useActivities } from "@/hooks/useApiQueries";
import { ActivityCard } from "@/components/ActivityCard";
import { LoadingState, ErrorState, EmptyState } from "@/components/UIPrimitives";

export function ActivityScreen() {
  const { data, isLoading, isError, refetch, isRefetching } = useActivities(50);

  if (isLoading) return <LoadingState message="Loading activity..." />;
  if (isError || !data) return <ErrorState message="Couldn't load your activity." onRetry={refetch} />;

  return (
    <FlatList
      className="flex-1 bg-background"
      contentContainerStyle={{ padding: 20, paddingTop: 60, paddingBottom: 40 }}
      data={data}
      keyExtractor={(item) => item.id}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#6C5CE7" />}
      ListHeaderComponent={
        <View>
          <Text className="text-textPrimary text-2xl font-extrabold mb-1">Activity Timeline</Text>
          <Text className="text-textSecondary text-sm mb-6">LeetCode, HackerRank & GitHub — newest first</Text>
        </View>
      }
      ListEmptyComponent={<EmptyState icon="🌱" title="Nothing logged yet" subtitle="Sync from the dashboard to populate this." />}
      renderItem={({ item }) => <ActivityCard activity={item} />}
    />
  );
}

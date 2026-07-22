import React from "react";
import { View, ScrollView, RefreshControl } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { ProfileCard, StatisticsCard } from "@/components/ProfileCard";
import { useActivities } from "@/hooks/useApiQueries";
import { ActivityCard } from "@/components/ActivityCard";
import { LoadingState, EmptyState } from "@/components/UIPrimitives";
import { Text } from "react-native";

export function ProfileScreen() {
  const { profile, refreshProfile, isLoading } = useAuth();
  const { data: activities, isRefetching, refetch } = useActivities(10);

  if (isLoading || !profile) return <LoadingState message="Loading profile..." />;

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ padding: 20, paddingTop: 60, paddingBottom: 40 }}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={() => {
            refreshProfile();
            refetch();
          }}
          tintColor="#6C5CE7"
        />
      }
    >
      <ProfileCard profile={profile} />
      <StatisticsCard profile={profile} />

      <Text className="text-textPrimary font-semibold text-base mt-8 mb-3">Activity History</Text>
      {!activities || activities.length === 0 ? (
        <EmptyState title="No activity history yet" />
      ) : (
        <View>
          {activities.map((activity: any) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

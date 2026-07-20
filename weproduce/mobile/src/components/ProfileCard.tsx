import React from "react";
import { View, Text, Image } from "react-native";
import { GradientCard } from "./GradientCard";
import type { ProfileDTO } from "@/types/domain";

export function ProfileCard({ profile }: { profile: ProfileDTO }) {
  return (
    <GradientCard colors={["#6C5CE7", "#141A29"]} className="items-center py-6">
      {profile.avatarUrl ? (
        <Image source={{ uri: profile.avatarUrl }} className="w-20 h-20 rounded-full mb-3" />
      ) : (
        <View className="w-20 h-20 rounded-full bg-surfaceAlt mb-3 items-center justify-center">
          <Text className="text-textPrimary text-2xl font-bold">{profile.displayName.charAt(0)}</Text>
        </View>
      )}
      <Text className="text-textPrimary text-xl font-bold">{profile.displayName}</Text>
      {profile.bio ? <Text className="text-textSecondary text-sm mt-1 text-center">{profile.bio}</Text> : null}
    </GradientCard>
  );
}

export function StatisticsCard({ profile }: { profile: ProfileDTO }) {
  const stats: { label: string; value: string | number }[] = [
    { label: "Weekly Score", value: profile.weeklyScore },
    { label: "Current Streak", value: `${profile.currentStreak}d` },
    { label: "Longest Streak", value: `${profile.longestStreak}d` },
  ];

  return (
    <GradientCard className="mt-4">
      <Text className="text-textPrimary font-semibold mb-3">Statistics</Text>
      <View className="flex-row justify-between">
        {stats.map((s) => (
          <View key={s.label} className="items-center flex-1">
            <Text className="text-textPrimary text-xl font-bold">{s.value}</Text>
            <Text className="text-textSecondary text-xs mt-1 text-center">{s.label}</Text>
          </View>
        ))}
      </View>

      <View className="h-px bg-border my-4" />

      <LinkedAccountRow label="GitHub" username={profile.github} />
      <LinkedAccountRow label="LeetCode" username={profile.leetcode} />
      <LinkedAccountRow label="HackerRank" username={profile.hackerrank} />
    </GradientCard>
  );
}

function LinkedAccountRow({ label, username }: { label: string; username: string | null }) {
  return (
    <View className="flex-row justify-between items-center py-1.5">
      <Text className="text-textSecondary text-sm">{label}</Text>
      <Text className={username ? "text-textPrimary text-sm font-medium" : "text-danger text-sm"}>
        {username ?? "Not linked"}
      </Text>
    </View>
  );
}

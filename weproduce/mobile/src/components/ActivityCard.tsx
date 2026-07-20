import React from "react";
import { View, Text } from "react-native";
import type { ActivityDTO } from "@/types/domain";

const PLATFORM_META: Record<ActivityDTO["platform"], { label: string; icon: string; color: string }> = {
  leetcode: { label: "LeetCode", icon: "🧩", color: "#FFA116" },
  hackerrank: { label: "HackerRank", icon: "🏆", color: "#00EA64" },
  github: { label: "GitHub", icon: "🔧", color: "#8B7CF6" },
};

const DIFFICULTY_LABEL: Record<ActivityDTO["difficulty"], string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
  none: "",
};

export function ActivityCard({ activity }: { activity: ActivityDTO }) {
  const meta = PLATFORM_META[activity.platform];
  const difficultyLabel = DIFFICULTY_LABEL[activity.difficulty];

  return (
    <View className="flex-row items-center bg-surface rounded-xl2 p-4 mb-2.5">
      <View
        className="w-10 h-10 rounded-full items-center justify-center mr-3"
        style={{ backgroundColor: `${meta.color}22` }}
      >
        <Text>{meta.icon}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-textPrimary font-medium" numberOfLines={1}>
          {activity.title}
        </Text>
        <Text className="text-textSecondary text-xs mt-0.5">
          {meta.label}
          {difficultyLabel ? ` · ${difficultyLabel}` : ""} · {activity.activityDate}
        </Text>
      </View>
      <Text className="text-accent font-bold">+{activity.points}</Text>
    </View>
  );
}

/** Specialized display for GitHub commits (used on the GitHub Activity screen). */
export function CommitCard({
  repository,
  message,
  date,
}: {
  repository: string;
  message: string;
  date: string;
}) {
  return (
    <View className="bg-surface rounded-xl2 p-4 mb-2.5">
      <Text className="text-primaryAlt text-xs font-semibold mb-1">{repository}</Text>
      <Text className="text-textPrimary" numberOfLines={2}>
        {message}
      </Text>
      <Text className="text-textSecondary text-xs mt-2">{new Date(date).toLocaleString()}</Text>
    </View>
  );
}

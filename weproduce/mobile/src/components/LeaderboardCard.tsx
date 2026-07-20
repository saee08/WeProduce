import React from "react";
import { View, Text, Image } from "react-native";
import type { LeaderboardEntryDTO } from "@/types/domain";

const RANK_COLORS: Record<number, string> = {
  1: "#FFC145",
  2: "#C0C7D6",
  3: "#D98E4A",
};

interface LeaderboardCardProps {
  entry: LeaderboardEntryDTO;
  isCurrentUser?: boolean;
}

export function LeaderboardCard({ entry, isCurrentUser }: LeaderboardCardProps) {
  const rankColor = RANK_COLORS[entry.rank] ?? "#9AA3B8";

  return (
    <View
      className={`flex-row items-center rounded-xl2 p-4 mb-3 ${
        isCurrentUser ? "bg-surfaceAlt border border-primary" : "bg-surface"
      }`}
    >
      <View
        className="w-9 h-9 rounded-full items-center justify-center mr-3"
        style={{ backgroundColor: `${rankColor}22` }}
      >
        <Text style={{ color: rankColor }} className="font-extrabold">
          {entry.rank}
        </Text>
      </View>

      {entry.avatarUrl ? (
        <Image source={{ uri: entry.avatarUrl }} className="w-10 h-10 rounded-full mr-3" />
      ) : (
        <View className="w-10 h-10 rounded-full bg-surfaceAlt mr-3 items-center justify-center">
          <Text className="text-textPrimary font-bold">{entry.displayName.charAt(0)}</Text>
        </View>
      )}

      <View className="flex-1">
        <Text className="text-textPrimary font-semibold text-base">{entry.displayName}</Text>
        <Text className="text-textSecondary text-xs mt-0.5">🔥 {entry.currentStreak} day streak</Text>
      </View>

      <Text className="text-accent font-extrabold text-lg">{entry.weeklyScore}</Text>
    </View>
  );
}

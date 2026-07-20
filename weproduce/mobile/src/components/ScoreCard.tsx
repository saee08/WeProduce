import React from "react";
import { View, Text } from "react-native";
import { GradientCard } from "./GradientCard";

interface ScoreCardProps {
  weeklyScore: number;
  rank: number | null;
}

export function ScoreCard({ weeklyScore, rank }: ScoreCardProps) {
  return (
    <GradientCard colors={["#6C5CE7", "#141A29"]}>
      <Text className="text-textSecondary text-xs uppercase tracking-widest">This Week's Score</Text>
      <Text className="text-textPrimary text-5xl font-extrabold mt-2">{weeklyScore}</Text>
      <View className="flex-row items-center mt-3">
        <View className="bg-surfaceAlt rounded-full px-3 py-1">
          <Text className="text-accent font-semibold text-xs">
            {rank ? `Rank #${rank} of 3` : "Not ranked yet"}
          </Text>
        </View>
      </View>
    </GradientCard>
  );
}

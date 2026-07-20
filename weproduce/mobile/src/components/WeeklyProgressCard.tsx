import React from "react";
import { View, Text } from "react-native";
import { GradientCard } from "./GradientCard";

interface WeeklyProgressCardProps {
  leetcodeSolved: number;
  hackerrankSolved: number;
  githubCommits: number;
  pointsEarnedToday: number;
}

function StatPill({ label, value }: { label: string; value: number }) {
  return (
    <View className="items-center flex-1">
      <Text className="text-textPrimary text-2xl font-bold">{value}</Text>
      <Text className="text-textSecondary text-xs mt-1">{label}</Text>
    </View>
  );
}

export function WeeklyProgressCard({
  leetcodeSolved,
  hackerrankSolved,
  githubCommits,
  pointsEarnedToday,
}: WeeklyProgressCardProps) {
  return (
    <GradientCard>
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-textPrimary font-semibold text-base">Today's Progress</Text>
        <Text className="text-accent font-bold text-sm">+{pointsEarnedToday} pts</Text>
      </View>
      <View className="flex-row">
        <StatPill label="LeetCode" value={leetcodeSolved} />
        <StatPill label="HackerRank" value={hackerrankSolved} />
        <StatPill label="Commits" value={githubCommits} />
      </View>
    </GradientCard>
  );
}

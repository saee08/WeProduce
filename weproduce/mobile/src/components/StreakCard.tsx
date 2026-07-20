import React from "react";
import { View, Text } from "react-native";
import { GradientCard } from "./GradientCard";

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
}

export function StreakCard({ currentStreak, longestStreak }: StreakCardProps) {
  return (
    <GradientCard className="flex-1">
      <Text className="text-textSecondary text-xs uppercase tracking-widest">Streak</Text>
      <View className="flex-row items-end mt-2">
        <Text className="text-textPrimary text-3xl font-extrabold">{currentStreak}</Text>
        <Text className="text-textSecondary text-sm ml-1 mb-1">days</Text>
      </View>
      <Text className="text-textSecondary text-xs mt-2">Longest: {longestStreak} days</Text>
    </GradientCard>
  );
}

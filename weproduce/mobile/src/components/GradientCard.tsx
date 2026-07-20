import React from "react";
import { View, type ViewProps } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface GradientCardProps extends ViewProps {
  colors?: [string, string, ...string[]];
  children: React.ReactNode;
}

/**
 * Base card used across the app for a consistent rounded, gradient-bordered
 * surface. Pass custom `colors` for score/streak highlight variants.
 */
export function GradientCard({ colors = ["#1C2438", "#141A29"], children, className, ...rest }: GradientCardProps) {
  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ borderRadius: 20, padding: 1 }}
    >
      <View className={`bg-surface rounded-xl2 p-4 ${className ?? ""}`} {...rest}>
        {children}
      </View>
    </LinearGradient>
  );
}

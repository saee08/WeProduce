import React from "react";
import { Pressable, Text, View, ActivityIndicator } from "react-native";

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary";
}

export function PrimaryButton({ label, onPress, loading, disabled, variant = "primary" }: PrimaryButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`rounded-xl2 py-4 items-center justify-center ${
        variant === "primary" ? "bg-primary" : "bg-surfaceAlt border border-border"
      } ${isDisabled ? "opacity-50" : ""}`}
    >
      {loading ? (
        <ActivityIndicator color="#F5F6FA" />
      ) : (
        <Text className="text-textPrimary font-semibold text-base">{label}</Text>
      )}
    </Pressable>
  );
}

export function LoadingState({ message = "Loading..." }: { message?: string }) {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <ActivityIndicator size="large" color="#6C5CE7" />
      <Text className="text-textSecondary mt-3">{message}</Text>
    </View>
  );
}

export function EmptyState({ icon = "📭", title, subtitle }: { icon?: string; title: string; subtitle?: string }) {
  return (
    <View className="items-center justify-center py-16 px-6">
      <Text className="text-4xl mb-3">{icon}</Text>
      <Text className="text-textPrimary font-semibold text-base text-center">{title}</Text>
      {subtitle ? <Text className="text-textSecondary text-sm text-center mt-1">{subtitle}</Text> : null}
    </View>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <View className="items-center justify-center py-16 px-6">
      <Text className="text-3xl mb-3">⚠️</Text>
      <Text className="text-textPrimary font-semibold text-base text-center">{message}</Text>
      {onRetry ? (
        <Pressable onPress={onRetry} className="mt-4 bg-surfaceAlt rounded-full px-5 py-2">
          <Text className="text-textPrimary text-sm font-medium">Try again</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

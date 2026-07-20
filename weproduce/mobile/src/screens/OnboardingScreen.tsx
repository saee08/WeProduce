import React, { useState } from "react";
import { View, Text, TextInput, Alert, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { PrimaryButton } from "@/components/UIPrimitives";
import { useUpdateProfile } from "@/hooks/useApiQueries";
import { useAuth } from "@/context/AuthContext";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Onboarding">;

function LabeledInput({
  label,
  placeholder,
  value,
  onChangeText,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
}) {
  return (
    <View className="mb-5">
      <Text className="text-textSecondary text-xs uppercase tracking-widest mb-2">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#5C6478"
        autoCapitalize="none"
        autoCorrect={false}
        className="bg-surface text-textPrimary rounded-xl2 px-4 py-3.5 border border-border"
      />
    </View>
  );
}

export function OnboardingScreen({ navigation }: Props) {
  const { refreshProfile } = useAuth();
  const updateProfile = useUpdateProfile();
  const [github, setGithub] = useState("");
  const [leetcode, setLeetcode] = useState("");
  const [hackerrank, setHackerrank] = useState("");

  const canSubmit = github.trim() && leetcode.trim() && hackerrank.trim();

  const handleSubmit = async () => {
    if (!canSubmit) {
      Alert.alert("Almost there", "Please add all three usernames to finish setup.");
      return;
    }
    try {
      await updateProfile.mutateAsync({ github, leetcode, hackerrank });
      await refreshProfile();
      navigation.replace("MainTabs");
    } catch (err) {
      Alert.alert("Couldn't save", err instanceof Error ? err.message : "Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 64 }}>
        <Text className="text-textPrimary text-2xl font-extrabold mb-2">Link your accounts</Text>
        <Text className="text-textSecondary text-sm mb-8">
          WeProduce tracks your daily solves and commits automatically once these are linked.
        </Text>

        <LabeledInput label="GitHub Username" placeholder="octocat" value={github} onChangeText={setGithub} />
        <LabeledInput label="LeetCode Username" placeholder="leetcoder123" value={leetcode} onChangeText={setLeetcode} />
        <LabeledInput
          label="HackerRank Username"
          placeholder="hackerrank_dev"
          value={hackerrank}
          onChangeText={setHackerrank}
        />

        <View className="mt-4">
          <PrimaryButton label="Start Tracking" onPress={handleSubmit} loading={updateProfile.isPending} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

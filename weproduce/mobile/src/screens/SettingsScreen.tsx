import React, { useState } from "react";
import { View, Text, TextInput, Alert, ScrollView, Switch, useColorScheme } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useUpdateProfile } from "@/hooks/useApiQueries";
import { PrimaryButton } from "@/components/UIPrimitives";
import { GradientCard } from "@/components/GradientCard";

export function SettingsScreen() {
  const { profile, signOut } = useAuth();
  const updateProfile = useUpdateProfile();
  const systemScheme = useColorScheme();
  const [darkMode, setDarkMode] = useState(systemScheme !== "light");

  const [github, setGithub] = useState(profile?.github ?? "");
  const [leetcode, setLeetcode] = useState(profile?.leetcode ?? "");
  const [hackerrank, setHackerrank] = useState(profile?.hackerrank ?? "");

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync({ github, leetcode, hackerrank });
      Alert.alert("Saved", "Your linked accounts were updated.");
    } catch (err) {
      Alert.alert("Couldn't save", err instanceof Error ? err.message : "Please try again.");
    }
  };

  const handleSignOut = () => {
    Alert.alert("Sign out?", "You'll need to sign back in with Google.", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: signOut },
    ]);
  };

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 20, paddingTop: 60, paddingBottom: 40 }}>
      <Text className="text-textPrimary text-2xl font-extrabold mb-6">Settings</Text>

      <GradientCard className="mb-4">
        <View className="flex-row justify-between items-center">
          <Text className="text-textPrimary font-medium">Dark Mode</Text>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: "#242C42", true: "#6C5CE7" }}
            thumbColor="#F5F6FA"
          />
        </View>
      </GradientCard>

      <GradientCard>
        <Text className="text-textPrimary font-semibold mb-4">Linked Accounts</Text>

        <FieldRow label="GitHub" value={github} onChangeText={setGithub} />
        <FieldRow label="LeetCode" value={leetcode} onChangeText={setLeetcode} />
        <FieldRow label="HackerRank" value={hackerrank} onChangeText={setHackerrank} />

        <View className="mt-2">
          <PrimaryButton label="Save Changes" onPress={handleSave} loading={updateProfile.isPending} />
        </View>
      </GradientCard>

      <View className="mt-8">
        <PrimaryButton label="Sign Out" onPress={handleSignOut} variant="secondary" />
      </View>
    </ScrollView>
  );
}

function FieldRow({
  label,
  value,
  onChangeText,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
}) {
  return (
    <View className="mb-3">
      <Text className="text-textSecondary text-xs uppercase tracking-widest mb-1.5">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
        autoCorrect={false}
        className="bg-surfaceAlt text-textPrimary rounded-xl px-3.5 py-3 border border-border"
      />
    </View>
  );
}

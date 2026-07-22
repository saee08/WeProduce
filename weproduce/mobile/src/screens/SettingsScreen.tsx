import React, { useState } from "react";
import { View, Text, TextInput, Alert, ScrollView, Switch, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useUpdateProfile } from "@/hooks/useApiQueries";
import { useTheme } from "@/context/ThemeContext";

export function SettingsScreen() {
  const { profile, signOut } = useAuth();
  const { colors, mode, toggleTheme } = useTheme();
  const updateProfile = useUpdateProfile();

  const [github, setGithub] = useState(profile?.github ?? "");
  const [githubPat, setGithubPat] = useState("");
  const [leetcode, setLeetcode] = useState(profile?.leetcode ?? "");
  const [hackerrank, setHackerrank] = useState(profile?.hackerrank ?? "");

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync({
        github: github.trim() || undefined,
        leetcode: leetcode.trim() || undefined,
        hackerrank: hackerrank.trim() || undefined,
        githubPat: githubPat.trim() || undefined,
      });
      setGithubPat("");
      Alert.alert("Saved", "Your linked accounts and settings were updated.");
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
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.headerTitle, { color: colors.text }]}>Settings & Themes</Text>

      {/* Theme Toggle Card */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.rowBetween}>
          <View>
            <Text style={[styles.cardTitle, { color: colors.text }]}>App Theme Mode</Text>
            <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
              {mode === "dark" ? "Dark Mode (Default)" : "Light Mode"}
            </Text>
          </View>
          <Switch
            value={mode === "dark"}
            onValueChange={toggleTheme}
            trackColor={{ false: "#B2BEC3", true: colors.primary }}
            thumbColor="#FFF"
          />
        </View>
      </View>

      {/* Linked Accounts */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.text, marginBottom: 16 }]}>
          Platform Handles & Tokens
        </Text>

        <FieldRow
          label="GitHub Username"
          value={github}
          onChangeText={setGithub}
          placeholder="e.g. octocat"
          colors={colors}
        />

        <FieldRow
          label="GitHub PAT (Personal Access Token)"
          value={githubPat}
          onChangeText={setGithubPat}
          placeholder="ghp_... (For private repos)"
          secureTextEntry
          colors={colors}
        />

        <FieldRow
          label="LeetCode Username"
          value={leetcode}
          onChangeText={setLeetcode}
          placeholder="e.g. tourist"
          colors={colors}
        />

        <FieldRow
          label="HackerRank Username"
          value={hackerrank}
          onChangeText={setHackerrank}
          placeholder="e.g. dev_pro"
          colors={colors}
        />

        <TouchableOpacity
          onPress={handleSave}
          disabled={updateProfile.isPending}
          style={[styles.saveBtn, { backgroundColor: colors.primary }]}
        >
          {updateProfile.isPending ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={{ color: "#FFF", fontWeight: "700" }}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleSignOut} style={[styles.signOutBtn, { borderColor: "#FF6B6B" }]}>
        <Text style={{ color: "#FF6B6B", fontWeight: "700" }}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function FieldRow({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  colors,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  colors: any;
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
        autoCorrect={false}
        style={[
          styles.input,
          { backgroundColor: colors.cardSecondary, color: colors.text, borderColor: colors.border },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 54,
    paddingBottom: 40,
    gap: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 4,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  cardSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  fieldGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  saveBtn: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  signOutBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    marginTop: 12,
  },
});

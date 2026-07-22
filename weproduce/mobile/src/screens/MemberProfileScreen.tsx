import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { profileApi } from "@/services/api";
import type { ProfileDTO } from "@/types/domain";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "MemberProfile">;

export const MemberProfileScreen: React.FC<Props> = ({ route, navigation }) => {
  const { userId, displayName: fallbackName } = route.params;
  const { colors } = useTheme();

  const [profile, setProfile] = useState<ProfileDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    profileApi
      .getPublicProfile(userId)
      .then(setProfile)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={[styles.backBtnText, { color: colors.primary }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {profile?.displayName ?? fallbackName ?? "Member Profile"}
        </Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {/* Main Card */}
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text style={styles.avatarText}>
                {(profile?.displayName ?? fallbackName ?? "M").charAt(0).toUpperCase()}
              </Text>
            </View>

            <Text style={[styles.name, { color: colors.text }]}>
              {profile?.displayName ?? fallbackName}
            </Text>
            <Text style={[styles.bio, { color: colors.textSecondary }]}>
              {profile?.bio || "WeProduce Cohort Member"}
            </Text>

            {/* Score & Streak stats */}
            <View style={styles.statsRow}>
              <View style={[styles.statBox, { backgroundColor: colors.cardSecondary }]}>
                <Text style={[styles.statValue, { color: colors.accent }]}>
                  {profile?.weeklyScore ?? 0}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Weekly Score</Text>
              </View>

              <View style={[styles.statBox, { backgroundColor: colors.cardSecondary }]}>
                <Text style={[styles.statValue, { color: "#FF9F43" }]}>
                  🔥 {profile?.currentStreak ?? 0}d
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Current Streak</Text>
              </View>

              <View style={[styles.statBox, { backgroundColor: colors.cardSecondary }]}>
                <Text style={[styles.statValue, { color: colors.primary }]}>
                  ⚡ {profile?.longestStreak ?? 0}d
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Longest Streak</Text>
              </View>
            </View>
          </View>

          {/* Linked Platform Accounts */}
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Linked Platforms</Text>
            <View style={styles.platformRow}>
              <Text style={[styles.platformName, { color: colors.text }]}>GitHub</Text>
              <Text style={[styles.platformUsername, { color: colors.accent }]}>
                {profile?.github ? `@${profile.github}` : "Not linked"}
              </Text>
            </View>

            <View style={styles.platformRow}>
              <Text style={[styles.platformName, { color: colors.text }]}>LeetCode</Text>
              <Text style={[styles.platformUsername, { color: colors.accent }]}>
                {profile?.leetcode ? `@${profile.leetcode}` : "Not linked"}
              </Text>
            </View>

            <View style={styles.platformRow}>
              <Text style={[styles.platformName, { color: colors.text }]}>HackerRank</Text>
              <Text style={[styles.platformUsername, { color: colors.accent }]}>
                {profile?.hackerrank ? `@${profile.hackerrank}` : "Not linked"}
              </Text>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 54,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    gap: 12,
  },
  backBtn: {
    paddingRight: 8,
  },
  backBtnText: {
    fontSize: 16,
    fontWeight: "700",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  content: {
    padding: 16,
    gap: 16,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    alignItems: "center",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarText: {
    color: "#FFF",
    fontWeight: "800",
    fontSize: 24,
  },
  name: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 4,
  },
  bio: {
    fontSize: 13,
    marginBottom: 18,
    textAlign: "center",
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
  statBox: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignItems: "center",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    alignSelf: "flex-start",
    marginBottom: 14,
  },
  platformRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  platformName: {
    fontSize: 14,
    fontWeight: "600",
  },
  platformUsername: {
    fontSize: 14,
    fontWeight: "600",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

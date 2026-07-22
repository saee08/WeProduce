import React from "react";
import { View, Text, FlatList, RefreshControl, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useLeaderboard } from "@/hooks/useApiQueries";
import { LeaderboardCard } from "@/components/LeaderboardCard";
import { useTheme } from "@/context/ThemeContext";
import type { LeaderboardEntryDTO } from "@/types/domain";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

const PODIUM_EMOJI: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

export function LeaderboardScreen({ navigation }: Props) {
  const { profile } = useAuth();
  const { colors } = useTheme();
  const { data, isLoading, isError, refetch, isRefetching } = useLeaderboard();

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const topThree = (data ?? []).slice(0, 3);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        contentContainerStyle={styles.listPadding}
        data={data ?? []}
        keyExtractor={(item) => item.userId}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Leaderboard</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>This week · resets every Monday</Text>

            {/* Podium */}
            {topThree.length > 0 && (
              <View style={styles.podiumRow}>
                {topThree.map((entry: LeaderboardEntryDTO) => (
                  <TouchableOpacity
                    key={entry.userId}
                    style={[styles.podiumCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                    onPress={() =>
                      navigation.navigate("MemberProfile", {
                        userId: entry.userId,
                        displayName: entry.displayName,
                      })
                    }
                  >
                    <Text style={{ fontSize: 28, marginBottom: 4 }}>{PODIUM_EMOJI[entry.rank] ?? "🏅"}</Text>
                    <Text style={[styles.podiumName, { color: colors.text }]} numberOfLines={1}>
                      {entry.displayName}
                    </Text>
                    <Text style={[styles.podiumScore, { color: colors.accent }]}>{entry.weeklyScore} pts</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={{ fontSize: 32, marginBottom: 8 }}>🏆</Text>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No scores logged yet</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              Sync your accounts or submit solves to appear on the cohort leaderboard!
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              navigation.navigate("MemberProfile", {
                userId: item.userId,
                displayName: item.displayName,
              })
            }
          >
            <LeaderboardCard entry={item} isCurrentUser={item.userId === profile?.userId} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listPadding: {
    padding: 16,
    paddingTop: 54,
    gap: 10,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
    marginBottom: 16,
  },
  podiumRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 8,
  },
  podiumCard: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
  },
  podiumName: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 2,
  },
  podiumScore: {
    fontSize: 14,
    fontWeight: "800",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: "center",
  },
});

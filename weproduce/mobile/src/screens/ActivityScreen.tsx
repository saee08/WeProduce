import React, { useState, useEffect } from "react";
import { View, Text, FlatList, RefreshControl, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useActivities } from "@/hooks/useApiQueries";
import { ActivityCard } from "@/components/ActivityCard";
import { LogSolveModal } from "@/components/LogSolveModal";
import { useTheme } from "@/context/ThemeContext";
import { githubApi } from "@/services/api";

export function ActivityScreen() {
  const { colors } = useTheme();
  const { data, isLoading, isError, refetch, isRefetching } = useActivities(50);

  const [logModalVisible, setLogModalVisible] = useState(false);
  const [commits, setCommits] = useState<any[]>([]);
  const [loadingCommits, setLoadingCommits] = useState(false);
  const [activeTab, setActiveTab] = useState<"timeline" | "commits">("timeline");

  useEffect(() => {
    if (activeTab === "commits" && commits.length === 0) {
      setLoadingCommits(true);
      githubApi
        .getCommits()
        .then((data) => setCommits(Array.isArray(data) ? data : []))
        .catch((err) => console.error(err))
        .finally(() => setLoadingCommits(false));
    }
  }, [activeTab, commits.length]);

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* List Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Activity & Solves</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              Automated syncs & practice solves
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setLogModalVisible(true)}
            style={[styles.logBtn, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.logBtnText}>+ Log Solve</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Toggle */}
        <View style={[styles.tabBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TouchableOpacity
            onPress={() => setActiveTab("timeline")}
            style={[
              styles.tabItem,
              activeTab === "timeline" && { backgroundColor: colors.primary },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === "timeline" ? "#FFF" : colors.textSecondary },
              ]}
            >
              All Activities
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab("commits")}
            style={[
              styles.tabItem,
              activeTab === "commits" && { backgroundColor: colors.primary },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === "commits" ? "#FFF" : colors.textSecondary },
              ]}
            >
              Commit History
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {activeTab === "timeline" ? (
        <FlatList
          data={data ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listPadding}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />
          }
          renderItem={({ item }) => <ActivityCard activity={item} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={{ fontSize: 32, marginBottom: 8 }}>🌱</Text>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No activities logged yet</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                Use "+ Log Solve" or sync platforms to populate your timeline.
              </Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={commits}
          keyExtractor={(item, index) => item?.sha || index.toString()}
          contentContainerStyle={styles.listPadding}
          refreshControl={
            <RefreshControl
              refreshing={loadingCommits}
              onRefresh={() => {
                setLoadingCommits(true);
                githubApi
                  .getCommits()
                  .then((data) => setCommits(Array.isArray(data) ? data : []))
                  .catch((err) => console.error(err))
                  .finally(() => setLoadingCommits(false));
              }}
              tintColor={colors.primary}
            />
          }
          renderItem={({ item }) => (
            <View style={[styles.commitCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.commitHeader}>
                <Text style={[styles.repoName, { color: colors.accent }]}>
                  📦 {item.repo || item.repository?.name || "GitHub Repo"}
                </Text>
                <Text style={[styles.commitSha, { color: colors.textSecondary }]}>
                  {item.sha ? item.sha.substring(0, 7) : "commit"}
                </Text>
              </View>
              <Text style={[styles.commitMessage, { color: colors.text }]}>
                {item.message || item.commit?.message || "Git commit push"}
              </Text>
              <Text style={[styles.commitDate, { color: colors.textSecondary }]}>
                {item.date ? new Date(item.date).toLocaleString() : "Recent"}
              </Text>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={{ fontSize: 32, marginBottom: 8 }}>🐙</Text>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No detailed commits cached</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                GitHub sync will fetch and cache your repository commits automatically.
              </Text>
            </View>
          }
        />
      )}

      {/* Manual solve modal */}
      <LogSolveModal
        visible={logModalVisible}
        onClose={() => setLogModalVisible(false)}
        onSuccess={() => refetch()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 54,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
  },
  headerSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  logBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  logBtnText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 13,
  },
  tabBar: {
    flexDirection: "row",
    borderRadius: 10,
    borderWidth: 1,
    padding: 3,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  tabText: {
    fontSize: 13,
    fontWeight: "700",
  },
  listPadding: {
    padding: 16,
    gap: 12,
  },
  commitCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  commitHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  repoName: {
    fontSize: 13,
    fontWeight: "700",
  },
  commitSha: {
    fontFamily: "Platform",
    fontSize: 12,
  },
  commitMessage: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  commitDate: {
    fontSize: 11,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 50,
    paddingHorizontal: 20,
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

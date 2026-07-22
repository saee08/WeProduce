import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
  RefreshControl,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { discussionsApi } from "@/services/api";
import type { DiscussionPostDTO } from "@/types/domain";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

export const DiscussionsScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const [posts, setPosts] = useState<DiscussionPostDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // New post modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      const data = await discussionsApi.getPosts();
      setPosts(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleCreatePost = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert("Required", "Please provide both title and content for your post");
      return;
    }

    try {
      setCreating(true);
      await discussionsApi.createPost(title.trim(), content.trim());
      setTitle("");
      setContent("");
      setModalVisible(false);
      fetchPosts();
    } catch (err: any) {
      Alert.alert("Error", err?.message || "Failed to create post");
    } finally {
      setCreating(false);
    }
  };

  const renderItem = ({ item }: { item: DiscussionPostDTO }) => (
    <TouchableOpacity
      style={[styles.postCard, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={() =>
        navigation.navigate("DiscussionDetail", { postId: item.id, title: item.title })
      }
    >
      <View style={styles.authorRow}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={styles.avatarText}>{item.author.displayName.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.authorName, { color: colors.text }]}>{item.author.displayName}</Text>
          <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
            {new Date(item.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      </View>

      <Text style={[styles.postTitle, { color: colors.text }]}>{item.title}</Text>
      <Text
        style={[styles.postContent, { color: colors.textSecondary }]}
        numberOfLines={3}
        ellipsizeMode="tail"
      >
        {item.content}
      </Text>

      <View style={styles.cardFooter}>
        <Text style={[styles.commentBadge, { color: colors.accent }]}>
          💬 {item.commentCount} {item.commentCount === 1 ? "comment" : "comments"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Cohort Discussions</Text>
        <TouchableOpacity
          style={[styles.newPostBtn, { backgroundColor: colors.primary }]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.newPostBtnText}>+ New Post</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listPadding}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchPosts();
              }}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.centerEmpty}>
              <Text style={{ fontSize: 36, marginBottom: 12 }}>💬</Text>
              <Text style={[styles.emptyText, { color: colors.text }]}>No discussions yet</Text>
              <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                Start a thread to ask questions, share insights, or discuss solutions.
              </Text>
            </View>
          }
        />
      )}

      {/* New Post Modal */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>New Discussion Post</Text>

            <Text style={[styles.label, { color: colors.textSecondary }]}>Title</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Approach for Dynamic Programming optimization"
              placeholderTextColor={colors.textSecondary}
              style={[styles.input, { backgroundColor: colors.cardSecondary, color: colors.text, borderColor: colors.border }]}
            />

            <Text style={[styles.label, { color: colors.textSecondary }]}>Content</Text>
            <TextInput
              value={content}
              onChangeText={setContent}
              placeholder="Share details, code snippets, or thoughts..."
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={6}
              style={[
                styles.input,
                styles.textArea,
                { backgroundColor: colors.cardSecondary, color: colors.text, borderColor: colors.border },
              ]}
            />

            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={[styles.modalBtn, { borderColor: colors.border, borderWidth: 1 }]}
                disabled={creating}
              >
                <Text style={{ color: colors.textSecondary, fontWeight: "600" }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleCreatePost}
                style={[styles.modalBtn, { backgroundColor: colors.primary }]}
                disabled={creating}
              >
                {creating ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={{ color: "#FFF", fontWeight: "700" }}>Post</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
  },
  newPostBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  newPostBtnText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 13,
  },
  listPadding: {
    padding: 16,
    gap: 12,
  },
  postCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 15,
  },
  authorName: {
    fontSize: 14,
    fontWeight: "700",
  },
  timestamp: {
    fontSize: 11,
    marginTop: 1,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  postContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  commentBadge: {
    fontSize: 12,
    fontWeight: "600",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centerEmpty: {
    alignItems: "center",
    marginTop: 60,
    paddingHorizontal: 30,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 20,
  },
  modalContainer: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  input: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  modalButtonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});

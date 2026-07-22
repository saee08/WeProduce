import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform as RNPlatform,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { discussionsApi } from "@/services/api";
import type { DiscussionCommentDTO, DiscussionPostDTO } from "@/types/domain";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "DiscussionDetail">;

export const DiscussionDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { postId, title: initialTitle } = route.params;
  const { colors } = useTheme();

  const [comments, setComments] = useState<DiscussionCommentDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [posting, setPosting] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      const data = await discussionsApi.getComments(postId);
      setComments(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSendComment = async () => {
    if (!commentText.trim()) return;

    try {
      setPosting(true);
      await discussionsApi.createComment(postId, commentText.trim());
      setCommentText("");
      fetchComments();
    } catch (err: any) {
      Alert.alert("Error", err?.message || "Failed to post comment");
    } finally {
      setPosting(false);
    }
  };

  const renderComment = ({ item }: { item: DiscussionCommentDTO }) => (
    <View style={[styles.commentCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
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
      <Text style={[styles.commentBody, { color: colors.text }]}>{item.content}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={RNPlatform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={[styles.backBtnText, { color: colors.primary }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
          {initialTitle}
        </Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          renderItem={renderComment}
          contentContainerStyle={styles.listPadding}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No comments yet. Be the first to comment on this thread!
              </Text>
            </View>
          }
        />
      )}

      {/* Input Footer */}
      <View style={[styles.inputFooter, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <TextInput
          value={commentText}
          onChangeText={setCommentText}
          placeholder="Write a comment..."
          placeholderTextColor={colors.textSecondary}
          style={[styles.commentInput, { backgroundColor: colors.cardSecondary, color: colors.text, borderColor: colors.border }]}
        />
        <TouchableOpacity
          onPress={handleSendComment}
          disabled={posting || !commentText.trim()}
          style={[
            styles.sendBtn,
            { backgroundColor: commentText.trim() ? colors.primary : colors.cardSecondary },
          ]}
        >
          {posting ? (
            <ActivityIndicator color="#FFF" size="small" />
          ) : (
            <Text style={{ color: commentText.trim() ? "#FFF" : colors.textSecondary, fontWeight: "700" }}>
              Send
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
  },
  listPadding: {
    padding: 16,
    gap: 10,
  },
  commentCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 13,
  },
  authorName: {
    fontSize: 13,
    fontWeight: "700",
  },
  timestamp: {
    fontSize: 10,
  },
  commentBody: {
    fontSize: 14,
    lineHeight: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    padding: 30,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
  },
  inputFooter: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    alignItems: "center",
    gap: 10,
  },
  commentInput: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 14,
  },
  sendBtn: {
    paddingHorizontal: 18,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
});

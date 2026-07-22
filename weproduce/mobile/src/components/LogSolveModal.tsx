import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { activitiesApi } from "@/services/api";

interface LogSolveModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const LogSolveModal: React.FC<LogSolveModalProps> = ({ visible, onClose, onSuccess }) => {
  const { colors } = useTheme();
  const [platform, setPlatform] = useState<"hackerrank" | "leetcode">("hackerrank");
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [problemUrl, setProblemUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter problem title");
      return;
    }

    try {
      setSubmitting(true);
      await activitiesApi.logManualSolve({
        platform,
        title: title.trim(),
        difficulty,
        problemUrl: problemUrl.trim() || undefined,
      });
      setTitle("");
      setProblemUrl("");
      onSuccess();
      onClose();
    } catch (err: any) {
      Alert.alert("Submission Failed", err?.message || "Failed to log solve activity");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.text }]}>Log Solve Manually</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Manually log HackerRank or extra practice solves
          </Text>

          {/* Platform selector */}
          <Text style={[styles.label, { color: colors.textSecondary }]}>Platform</Text>
          <View style={styles.row}>
            {(["hackerrank", "leetcode"] as const).map((p) => (
              <TouchableOpacity
                key={p}
                onPress={() => setPlatform(p)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: platform === p ? colors.primary : colors.cardSecondary,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text style={[styles.chipText, { color: platform === p ? "#FFF" : colors.text }]}>
                  {p === "hackerrank" ? "HackerRank" : "LeetCode"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Problem Title */}
          <Text style={[styles.label, { color: colors.textSecondary }]}>Problem Title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Simple Array Sum"
            placeholderTextColor={colors.textSecondary}
            style={[styles.input, { backgroundColor: colors.cardSecondary, color: colors.text, borderColor: colors.border }]}
          />

          {/* Difficulty Selector */}
          <Text style={[styles.label, { color: colors.textSecondary }]}>Difficulty</Text>
          <View style={styles.row}>
            {(["easy", "medium", "hard"] as const).map((d) => (
              <TouchableOpacity
                key={d}
                onPress={() => setDifficulty(d)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: difficulty === d ? colors.primary : colors.cardSecondary,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text style={[styles.chipText, { color: difficulty === d ? "#FFF" : colors.text }]}>
                  {d.toUpperCase()} ({d === "easy" ? "+10" : d === "medium" ? "+25" : "+50"} pts)
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Problem URL Optional */}
          <Text style={[styles.label, { color: colors.textSecondary }]}>Problem URL (Optional)</Text>
          <TextInput
            value={problemUrl}
            onChangeText={setProblemUrl}
            placeholder="https://hackerrank.com/challenges/..."
            placeholderTextColor={colors.textSecondary}
            style={[styles.input, { backgroundColor: colors.cardSecondary, color: colors.text, borderColor: colors.border }]}
            autoCapitalize="none"
          />

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.btn, styles.cancelBtn, { borderColor: colors.border }]}
              disabled={submitting}
            >
              <Text style={{ color: colors.textSecondary, fontWeight: "600" }}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSubmit}
              style={[styles.btn, { backgroundColor: colors.primary }]}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={{ color: "#FFF", fontWeight: "700" }}>Submit Solve</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 20,
  },
  container: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  chip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
  },
  input: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtn: {
    borderWidth: 1,
  },
});

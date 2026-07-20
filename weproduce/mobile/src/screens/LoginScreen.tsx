import React, { useState } from "react";
import { View, Text, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { PrimaryButton } from "@/components/UIPrimitives";
import { useAuth } from "@/context/AuthContext";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export function LoginScreen({ navigation }: Props) {
  const { signInWithGoogle, profile } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      navigation.replace(profile?.onboardingComplete ? "MainTabs" : "Onboarding");
    } catch (err) {
      Alert.alert("Sign-in failed", err instanceof Error ? err.message : "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#141A29", "#0B0F1A"]} style={{ flex: 1 }}>
      <View className="flex-1 justify-between px-6 py-16">
        <View className="items-center mt-10">
          <Text className="text-5xl mb-4">⚡</Text>
          <Text className="text-textPrimary text-3xl font-extrabold">WeProduce</Text>
          <Text className="text-textSecondary text-base mt-3 text-center px-4">
            A private accountability circle for 3 developers. Solve problems, ship commits, climb the one
            leaderboard that matters.
          </Text>
        </View>

        <View>
          <PrimaryButton label="Continue with Google" onPress={handleGoogleSignIn} loading={loading} />
          <Text className="text-textSecondary text-xs text-center mt-4">
            Access is limited to invited members only.
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

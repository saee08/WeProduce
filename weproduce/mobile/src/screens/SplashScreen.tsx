import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";
import { useAuth } from "@/context/AuthContext";

type Props = NativeStackScreenProps<RootStackParamList, "Splash">;

export function SplashScreen({ navigation }: Props) {
  const { isLoading, isAuthenticated, profile } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        navigation.replace("Login");
      } else if (!profile?.onboardingComplete) {
        navigation.replace("Onboarding");
      } else {
        navigation.replace("MainTabs");
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [isLoading, isAuthenticated, profile, navigation]);

  return (
    <LinearGradient colors={["#141A29", "#0B0F1A"]} style={{ flex: 1 }}>
      <View className="flex-1 items-center justify-center">
        <Text className="text-5xl mb-4">⚡</Text>
        <Text className="text-textPrimary text-3xl font-extrabold">WeProduce</Text>
        <Text className="text-textSecondary text-sm mt-2 tracking-wide">
          Code Every Day. Compete Every Week.
        </Text>
      </View>
    </LinearGradient>
  );
}

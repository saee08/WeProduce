import React from "react";
import { NavigationContainer, DarkTheme, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { RootStackParamList } from "./types";
import { SplashScreen } from "@/screens/SplashScreen";
import { LoginScreen } from "@/screens/LoginScreen";
import { OnboardingScreen } from "@/screens/OnboardingScreen";
import { MainTabNavigator } from "./MainTabNavigator";
import { DiscussionDetailScreen } from "@/screens/DiscussionDetailScreen";
import { MemberProfileScreen } from "@/screens/MemberProfileScreen";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppContainer() {
  const { colors, mode } = useTheme();

  const navigationTheme = {
    ...(mode === "dark" ? DarkTheme : DefaultTheme),
    colors: {
      ...(mode === "dark" ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.background,
      card: colors.card,
      primary: colors.primary,
      border: colors.border,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        <Stack.Screen name="DiscussionDetail" component={DiscussionDetailScreen} />
        <Stack.Screen name="MemberProfile" component={MemberProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export function RootNavigator() {
  return (
    <ThemeProvider>
      <AppContainer />
    </ThemeProvider>
  );
}

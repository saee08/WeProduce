import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { tokenStorage } from "@/services/tokenStorage";
import { authApi, profileApi } from "@/services/api";
import type { ProfileDTO } from "@/types/domain";

WebBrowser.maybeCompleteAuthSession();

interface AuthContextValue {
  isLoading: boolean;
  isAuthenticated: boolean;
  profile: ProfileDTO | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState<ProfileDTO | null>(null);

  const refreshProfile = useCallback(async () => {
    try {
      const data = await profileApi.getProfile();
      setProfile(data);
    } catch {
      // Token may be stale/expired — force sign-out to avoid a stuck state.
      await tokenStorage.clearToken();
      setIsAuthenticated(false);
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    (async () => {
      const token = await tokenStorage.getToken();
      if (token) {
        setIsAuthenticated(true);
        await refreshProfile();
      }
      setIsLoading(false);
    })();
  }, [refreshProfile]);

  const signInWithGoogle = useCallback(async () => {
    const { url } = await authApi.getGoogleAuthUrl();
    const redirectUri = Linking.createURL("auth-callback");
    const result = await WebBrowser.openAuthSessionAsync(url, redirectUri);

    if (result.type === "success" && result.url) {
      const { queryParams } = Linking.parse(result.url);
      const code = queryParams?.code as string | undefined;
      if (!code) throw new Error("Google did not return an authorization code");

      const { token } = await authApi.loginWithCode(code);
      await tokenStorage.setToken(token);
      setIsAuthenticated(true);
      await refreshProfile();
    }
  }, [refreshProfile]);

  const signOut = useCallback(async () => {
    await tokenStorage.clearToken();
    setIsAuthenticated(false);
    setProfile(null);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoading, isAuthenticated, profile, signInWithGoogle, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

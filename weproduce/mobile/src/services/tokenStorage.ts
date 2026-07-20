import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "weproduce_auth_token";

/**
 * SecureStore backs onto Keychain (iOS) / Keystore (Android) — never store
 * the session JWT in AsyncStorage, which is unencrypted on-device.
 */
export const tokenStorage = {
  async getToken(): Promise<string | null> {
    return SecureStore.getItemAsync(TOKEN_KEY);
  },
  async setToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  },
  async clearToken(): Promise<void> {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  },
};

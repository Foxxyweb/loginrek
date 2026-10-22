import * as SecureStore from 'expo-secure-store';

/**
 * Penyimpanan token API di Keychain (iOS) / Keystore (Android)
 * lewat expo-secure-store. Tersedia di Expo Go.
 */
const KEY = 'loginrek.accessToken';

export const tokenStorage = {
  get: () => SecureStore.getItemAsync(KEY),
  set: (token: string) => SecureStore.setItemAsync(KEY, token),
  clear: () => SecureStore.deleteItemAsync(KEY),
};

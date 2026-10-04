import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import { createMemoryStorage, createSessionStorage } from './session-storage';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
export const supabase = url && key ? createClient(url, key, {
  auth: {
    storage: Platform.OS === 'web' ? createMemoryStorage() : createSessionStorage({
      getItem: SecureStore.getItemAsync,
      setItem: (name, value) => SecureStore.setItemAsync(name, value, { keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY }),
      removeItem: SecureStore.deleteItemAsync,
    }),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
}) : null;

export function requireSupabase() {
  if (!supabase) throw new Error('The family service is not configured yet.');
  return supabase;
}

import { QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { Stack } from 'expo-router/stack';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { ActivityIndicator, useColorScheme } from 'react-native';

import { Body, Screen } from '@/components/ui';
import { queryClient } from '@/lib/query-client';
import { SessionProvider, useSession } from '@/providers/session-provider';

void SplashScreen.preventAutoHideAsync();

function Navigation() {
  const { session, loading } = useSession();
  useEffect(() => { if (!loading) void SplashScreen.hideAsync(); }, [loading]);
  if (loading) return <Screen><ActivityIndicator accessibilityLabel="Restoring your session" /><Body>Opening your family’s space…</Body></Screen>;
  return <Stack screenOptions={{ headerShown: false }}>
    <Stack.Protected guard={!session} redirectTo="/"><Stack.Screen name="(auth)" /></Stack.Protected>
    <Stack.Protected guard={Boolean(session)} redirectTo="/sign-in"><Stack.Screen name="(tabs)" /></Stack.Protected>
  </Stack>;
}
export default function RootLayout() {
  const scheme = useColorScheme();
  return <QueryClientProvider client={queryClient}><SessionProvider><ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}><Navigation /></ThemeProvider></SessionProvider></QueryClientProvider>;
}

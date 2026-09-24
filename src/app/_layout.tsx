import { setToolsButtonVisible } from "expo-dev-client";
import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router";
import { Stack } from "expo-router/stack";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { palette } from "@/components/calendar/design";
import { CalendarProvider } from "@/features/demo/calendar";
export const unstable_settings = { anchor: "(tabs)" };
export default function RootLayout() {
  const scheme = useColorScheme();
  useEffect(() => {
    void SplashScreen.hideAsync();
    if (__DEV__) setToolsButtonVisible(false);
  }, []);
  return (
    <CalendarProvider>
      <ThemeProvider value={scheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack
          screenOptions={{
            headerTintColor: palette.accent,
            headerTitleStyle: { color: palette.label },
            contentStyle: { backgroundColor: palette.background },
            headerBackButtonDisplayMode: "minimal",
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="event/[id]"
            options={{
              title: "Event",
              headerTransparent: true,
              headerBlurEffect: "systemMaterial",
            }}
          />
          <Stack.Screen
            name="new-event"
            options={{ title: "New Event", presentation: "modal" }}
          />
        </Stack>
      </ThemeProvider>
    </CalendarProvider>
  );
}

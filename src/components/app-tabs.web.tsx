import { Tabs } from "expo-router";
import { palette } from "./calendar/design";
export default function AppTabs() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: palette.accent,
      }}
    >
      <Tabs.Screen name="(calendar)" options={{ title: "Calendar" }} />
      <Tabs.Screen name="(outfits)" options={{ title: "What to wear" }} />
    </Tabs>
  );
}

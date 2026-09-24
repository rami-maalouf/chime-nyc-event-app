import { useColorScheme } from "react-native";
import { Stack } from "expo-router/stack";
import { palette } from "@/components/calendar/design";
export default function CalendarLayout() {
  const titleColor = useColorScheme() === "dark" ? "#FFFFFF" : "#171719";
  return (
    <Stack
      screenOptions={{
        title: "Calendar",
        headerLargeTitleEnabled: true,
        headerTitleStyle: { color: titleColor },
        headerLargeTitleStyle: { color: titleColor },
        headerTransparent: false,
        headerStyle: { backgroundColor: palette.background },
        headerShadowVisible: false,
        headerTintColor: palette.accent,
        contentStyle: { backgroundColor: palette.background },
      }}
    />
  );
}

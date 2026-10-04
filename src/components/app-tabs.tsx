import { NativeTabs } from "expo-router/native-tabs";
import { palette } from "./calendar/design";
export default function AppTabs() {
  return (
    <NativeTabs tintColor={palette.accent}>
      <NativeTabs.Trigger name="(calendar)">
        <NativeTabs.Trigger.Label>Calendar</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="calendar" md="calendar_month" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(outfits)">
        <NativeTabs.Trigger.Label>What to wear</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="sun.max" md="sunny" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

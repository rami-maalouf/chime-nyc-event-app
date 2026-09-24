import { NativeTabs } from 'expo-router/native-tabs';
import { useAppColors } from './ui';
export default function AppTabs() {
  const colors = useAppColors();
  return <NativeTabs backgroundColor={colors.background} tintColor={colors.accent}>
    <NativeTabs.Trigger name="index"><NativeTabs.Trigger.Label>Calendar</NativeTabs.Trigger.Label><NativeTabs.Trigger.Icon sf="calendar" md="calendar_month" /></NativeTabs.Trigger>
    <NativeTabs.Trigger name="settings"><NativeTabs.Trigger.Label>Account</NativeTabs.Trigger.Label><NativeTabs.Trigger.Icon sf="person.crop.circle" md="account_circle" /></NativeTabs.Trigger>
  </NativeTabs>;
}

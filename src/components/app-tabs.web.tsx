import { TabList, Tabs, TabSlot, TabTrigger } from 'expo-router/ui';
import { StyleSheet, Text } from 'react-native';
import { useAppColors } from './ui';
export default function AppTabs() {
  const colors = useAppColors();
  return <Tabs><TabSlot /><TabList style={[styles.list, { backgroundColor: colors.backgroundElement }]}>
    <TabTrigger name="calendar" href="/" style={styles.tab}><Text style={{ color: colors.text }}>Calendar</Text></TabTrigger>
    <TabTrigger name="settings" href="/settings" style={styles.tab}><Text style={{ color: colors.text }}>Account</Text></TabTrigger>
  </TabList></Tabs>;
}
const styles = StyleSheet.create({ list: { justifyContent: 'space-around', padding: 8 }, tab: { minHeight: 48, justifyContent: 'center', paddingHorizontal: 24 } });

import type { PropsWithChildren } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, type TextInputProps, type TextProps, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';

export const useAppColors = () => Colors[useColorScheme() === 'dark' ? 'dark' : 'light'];

export function Screen({ children }: PropsWithChildren) {
  const colors = useAppColors();
  const insets = useSafeAreaInsets();
  return <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
    <ScrollView keyboardShouldPersistTaps="handled" contentInsetAdjustmentBehavior="automatic" contentContainerStyle={[styles.screen, { paddingTop: Math.max(insets.top, 24), paddingBottom: Math.max(insets.bottom, 24) }]}>
      <View style={styles.content}>{children}</View>
    </ScrollView>
  </KeyboardAvoidingView>;
}
export function Heading(props: TextProps) {
  const colors = useAppColors();
  return <Text accessibilityRole="header" {...props} style={[styles.heading, { color: colors.text }, props.style]} />;
}
export function Body(props: TextProps) {
  const colors = useAppColors();
  return <Text {...props} style={[styles.body, { color: colors.textSecondary }, props.style]} />;
}
export function Card({ children }: PropsWithChildren) {
  const colors = useAppColors();
  return <View style={[styles.card, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>{children}</View>;
}
export function Notice({ children }: PropsWithChildren) {
  const colors = useAppColors();
  return <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={[styles.body, { color: colors.danger }]}>{children}</Text>;
}
export function Button({ title, onPress, disabled, busy, secondary = false }: { title: string; onPress(): void; disabled?: boolean; busy?: boolean; secondary?: boolean }) {
  const colors = useAppColors();
  return <Pressable accessibilityRole="button" accessibilityLabel={title} accessibilityState={{ disabled: disabled || busy, busy }} disabled={disabled || busy} onPress={onPress} style={({ pressed }) => [styles.button, { backgroundColor: secondary ? colors.backgroundSelected : colors.accent, opacity: disabled || busy ? 0.5 : pressed ? 0.8 : 1 }]}>
    {busy && <ActivityIndicator color={secondary ? colors.text : colors.onAccent} />}
    <Text style={[styles.buttonText, { color: secondary ? colors.text : colors.onAccent }]}>{title}</Text>
  </Pressable>;
}
export function Field({ label, ...props }: TextInputProps & { label: string }) {
  const colors = useAppColors();
  return <View style={{ gap: 8 }}>
    <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
    <TextInput accessibilityLabel={label} placeholderTextColor={colors.textSecondary} {...props} style={[styles.input, { color: colors.text, backgroundColor: colors.background, borderColor: colors.border }, props.style]} />
  </View>;
}
const styles = StyleSheet.create({
  screen: { flexGrow: 1, paddingHorizontal: 24 },
  content: { width: '100%', maxWidth: 600, alignSelf: 'center', gap: 24 },
  heading: { fontSize: 34, fontWeight: '700', letterSpacing: -1 },
  body: { fontSize: 16, lineHeight: 25 },
  card: { padding: 24, borderWidth: 1, borderRadius: 24, gap: 20 },
  button: { minHeight: 52, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10 },
  buttonText: { fontSize: 16, fontWeight: '600', textAlign: 'center' },
  input: { borderWidth: 1, borderRadius: 12, minHeight: 52, paddingHorizontal: 16, paddingVertical: 14, fontSize: 17 },
  label: { fontSize: 15, fontWeight: '600' },
});

import { Color } from "expo-router";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import {
  Platform,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  type ColorValue,
} from "react-native";
import { people } from "@/features/demo/calendar";
export const palette = {
  background:
    Platform.OS === "ios" ? Color.ios.systemGroupedBackground : "#F2F2F7",
  card:
    Platform.OS === "ios"
      ? Color.ios.secondarySystemGroupedBackground
      : "#FFFFFF",
  label: Platform.OS === "ios" ? Color.ios.label : "#171719",
  secondary: Platform.OS === "ios" ? Color.ios.secondaryLabel : "#77777E",
  separator: Platform.OS === "ios" ? Color.ios.separator : "#DEDEE3",
  accent: "#DC7043",
};
export function Icon({
  name,
  size = 20,
  color = palette.secondary,
}: {
  name: SymbolViewProps["name"];
  size?: number;
  color?: ColorValue;
}) {
  return (
    <SymbolView
      name={name}
      size={size}
      tintColor={color}
      style={{ width: size, height: size }}
    />
  );
}
export function Faces({
  members,
  size = 26,
}: {
  members: string[];
  size?: number;
}) {
  return (
    <View style={{ flexDirection: "row", paddingLeft: 4 }}>
      {members.map((name) => {
        const person = people.find((p) => p.name === name) ?? people[0];
        return (
          <View
            key={name}
            accessibilityLabel={name}
            style={{
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: 2,
              borderColor: palette.card,
              backgroundColor: person.background,
              marginLeft: -4,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: person.color,
                fontSize: size * 0.4,
                fontWeight: "700",
              }}
            >
              {person.initials}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
export function SectionHeading({
  title,
  detail,
}: {
  title: string;
  detail?: string;
}) {
  return (
    <View style={styles.row}>
      <Text accessibilityRole="header" style={styles.sectionTitle}>
        {title}
      </Text>
      {detail && <Text style={styles.caption}>{detail}</Text>}
    </View>
  );
}
export function useWeatherColors() {
  return useColorScheme() === "dark"
    ? { background: "#213A4B", text: "#E4F2FC", secondary: "#B1CADA" }
    : { background: "#E7F1F7", text: "#24485F", secondary: "#58778B" };
}
export const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  body: { color: palette.label, fontSize: 17 },
  caption: { color: palette.secondary, fontSize: 13 },
  sectionTitle: {
    color: palette.label,
    fontSize: 21,
    fontWeight: "700",
    letterSpacing: -0.4,
  },
  card: {
    backgroundColor: palette.card,
    borderRadius: 22,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  content: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 30, gap: 24 },
});

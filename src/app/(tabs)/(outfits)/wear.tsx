import { Link, router, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Faces, Icon, palette, styles } from "@/components/calendar/design";
import { WeatherPanel } from "@/components/calendar/weather-panel";
import { clockTime, localDate, useCalendar } from "@/features/demo/calendar";
export default function WearScreen() {
  const { events, selected } = useCalendar();
  const { eventId } = useLocalSearchParams<{ eventId?: string }>();
  const available = events.filter((event) => event.date === selected);
  const event =
    available.find((event) => event.id === eventId) ??
    available.find((event) => event.outdoors) ??
    available[0];
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}
    >
      <Text style={{ color: palette.secondary, fontSize: 15 }}>
        {localDate(selected).toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
      </Text>
      {!event ? (
        <View
          style={[styles.card, { padding: 28, gap: 16, alignItems: "center" }]}
        >
          <Icon name="sun.max" size={40} color={palette.accent} />
          <Text style={styles.sectionTitle}>An open day</Text>
          <Text
            style={[styles.caption, { textAlign: "center", lineHeight: 20 }]}
          >
            Choose a day with an event in Calendar to see what to wear.
          </Text>
          <Link href="/" style={{ color: palette.accent, padding: 14 }}>
            Open Calendar
          </Link>
        </View>
      ) : (
        <>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            {available.map((item) => (
              <Pressable
                key={item.id}
                accessibilityRole="button"
                accessibilityState={{ selected: item.id === event.id }}
                onPress={() => router.setParams({ eventId: item.id })}
                style={{
                  backgroundColor:
                    item.id === event.id ? palette.label : palette.card,
                  paddingHorizontal: 16,
                  minHeight: 44,
                  justifyContent: "center",
                  borderRadius: 22,
                }}
              >
                <Text
                  style={{
                    color:
                      item.id === event.id ? palette.card : palette.secondary,
                    fontSize: 13,
                    fontWeight: "600",
                  }}
                >
                  {item.title}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
          <Link
            href={{ pathname: "/event/[id]", params: { id: event.id } }}
            asChild
          >
            <Pressable style={{ ...styles.row, paddingHorizontal: 2 }}>
              <View style={{ flex: 1, gap: 5 }}>
                <Text
                  style={{
                    color: palette.label,
                    fontSize: 18,
                    fontWeight: "600",
                  }}
                >
                  {event.title}
                </Text>
                <Text style={styles.caption}>
                  {clockTime(event.time)} ·{" "}
                  {event.outdoors ? "Outdoors" : "Indoors"}
                </Text>
              </View>
              <Faces members={event.members} />
              <Icon name="chevron.right" size={12} />
            </Pressable>
          </Link>
          <WeatherPanel event={event} />
        </>
      )}
    </ScrollView>
  );
}

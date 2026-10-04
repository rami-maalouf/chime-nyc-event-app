import { router, Stack, useLocalSearchParams } from "expo-router";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import {
  Faces,
  Icon,
  palette,
  SectionHeading,
  styles,
} from "@/components/calendar/design";
import { WeatherPanel } from "@/components/calendar/weather-panel";
import {
  categoryColors,
  clockTime,
  localDate,
  people,
  useCalendar,
} from "@/features/demo/calendar";
export default function EventScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { events, remove } = useCalendar();
  const event = events.find((item) => item.id === id);
  if (!event)
    return (
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.content}
      >
        <Text style={styles.sectionTitle}>This event is no longer here.</Text>
        <Pressable onPress={() => router.replace("/")}>
          <Text style={{ color: palette.accent, padding: 16 }}>
            Back to calendar
          </Text>
        </Pressable>
      </ScrollView>
    );
  return (
    <>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[styles.content, { paddingTop: 20 }]}
      >
        <View style={{ gap: 12 }}>
          <Text
            style={{
              color: categoryColors[event.category],
              fontSize: 12,
              fontWeight: "700",
              letterSpacing: 1.5,
            }}
          >
            {event.category.toUpperCase()}
          </Text>
          <Text
            accessibilityRole="header"
            style={{
              color: palette.label,
              fontSize: 34,
              fontWeight: "700",
              letterSpacing: -0.8,
            }}
          >
            {event.title}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Faces members={event.members} />
            <Text style={styles.caption}>
              {people.every((person) => event.members.includes(person.name))
                ? "The whole family"
                : event.members.join(" & ")}
            </Text>
          </View>
        </View>
        <View style={[styles.card, { padding: 20, gap: 20 }]}>
          <View style={{ flexDirection: "row", gap: 14, alignItems: "center" }}>
            <Icon name="calendar" color={palette.accent} />
            <View style={{ gap: 4 }}>
              <Text style={styles.body}>
                {localDate(event.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
              <Text style={styles.caption}>
                {clockTime(event.time)} · {event.duration} minutes
              </Text>
            </View>
          </View>
          <View
            style={{
              height: 0.5,
              backgroundColor: palette.separator,
              marginLeft: 34,
            }}
          />
          <View style={{ flexDirection: "row", gap: 14, alignItems: "center" }}>
            <Icon name="mappin.and.ellipse" color={palette.accent} />
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={styles.body}>{event.location}</Text>
              <Text style={styles.caption}>
                {event.outdoors
                  ? "An outdoor get-together"
                  : "An indoor get-together"}
              </Text>
            </View>
          </View>
        </View>
        {Boolean(event.notes) && (
          <View style={{ gap: 8 }}>
            <SectionHeading title="The plan" />
            <Text
              style={{ color: palette.secondary, fontSize: 16, lineHeight: 24 }}
            >
              {event.notes}
            </Text>
          </View>
        )}
        <SectionHeading title="What to wear" />
        <WeatherPanel event={event} />
        <Pressable
          accessibilityRole="button"
          onPress={() =>
            Alert.alert(
              "Delete this event?",
              "It will be removed from your sample calendar.",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Delete Event",
                  style: "destructive",
                  onPress: () => {
                    remove(event.id);
                    router.back();
                  },
                },
              ],
            )
          }
          style={{
            minHeight: 48,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "#E04E45", fontSize: 17 }}>Delete Event</Text>
        </Pressable>
      </ScrollView>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          onPress={() =>
            router.push({ pathname: "/new-event", params: { id: event.id } })
          }
        >
          Edit
        </Stack.Toolbar.Button>
      </Stack.Toolbar>
    </>
  );
}

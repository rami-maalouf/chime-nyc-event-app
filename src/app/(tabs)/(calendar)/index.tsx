import { router, Stack } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import {
  Faces,
  Icon,
  palette,
  SectionHeading,
  styles,
  useWeatherColors,
} from "@/components/calendar/design";
import {
  categoryColors,
  clockTime,
  dateKey,
  localDate,
  people,
  useCalendar,
} from "@/features/demo/calendar";

export default function CalendarScreen() {
  const { events, selected, select } = useCalendar();
  const [month, setMonth] = useState(localDate(selected));
  const [monthSelection, setMonthSelection] = useState(selected);
  const [member, setMember] = useState("Everyone");
  if (monthSelection !== selected) {
    setMonthSelection(selected);
    setMonth(localDate(selected));
  }
  const colors = useWeatherColors();
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const rows = Math.ceil((first.getDay() + days) / 7);
  const visible = events
    .filter(
      (event) =>
        event.date === selected &&
        (member === "Everyone" || event.members.includes(member)),
    )
    .sort((a, b) => a.time.localeCompare(b.time));
  const weatherEvent =
    visible.find((event) => event.weather === "rain") ??
    visible.find((event) => event.outdoors) ??
    visible[0];
  const rainy = weatherEvent?.weather === "rain";
  const today = dateKey(new Date());
  const moveMonth = (direction: number) =>
    setMonth(new Date(month.getFullYear(), month.getMonth() + direction, 1));
  return (
    <>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.content}
      >
        <View style={[styles.row, { marginTop: -2 }]}>
          <Text style={{ color: palette.secondary, fontSize: 15 }}>
            A little more together.
          </Text>
          <Faces members={people.map((p) => p.name)} size={28} />
        </View>
        <View
          style={[
            styles.card,
            { paddingHorizontal: 12, paddingTop: 10, paddingBottom: 12 },
          ]}
        >
          <View style={[styles.row, { paddingLeft: 8, marginBottom: 8 }]}>
            <Text
              accessibilityRole="header"
              maxFontSizeMultiplier={1.3}
              style={{
                color: palette.label,
                fontSize: 21,
                fontWeight: "700",
                flexShrink: 1,
              }}
            >
              {month.toLocaleDateString("en-US", { month: "long" })}{" "}
              <Text style={{ color: palette.secondary, fontWeight: "400" }}>
                {month.getFullYear()}
              </Text>
            </Text>
            <View style={{ flexDirection: "row" }}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Previous month"
                onPress={() => moveMonth(-1)}
                style={{
                  width: 44,
                  height: 44,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name="chevron.left" size={16} color={palette.accent} />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Next month"
                onPress={() => moveMonth(1)}
                style={{
                  width: 44,
                  height: 44,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name="chevron.right" size={16} color={palette.accent} />
              </Pressable>
            </View>
          </View>
          <View style={{ flexDirection: "row", marginBottom: 4 }}>
            {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
              <Text
                key={i}
                style={{
                  width: "14.2857%",
                  textAlign: "center",
                  color: palette.secondary,
                  fontSize: 11,
                  fontWeight: "600",
                }}
              >
                {day}
              </Text>
            ))}
          </View>
          {Array.from({ length: rows }, (_, row) => (
            <View key={row} style={{ flexDirection: "row" }}>
              {Array.from({ length: 7 }, (_, column) => {
                const day = row * 7 + column - first.getDay() + 1;
                if (day < 1 || day > days)
                  return (
                    <View
                      key={column}
                      style={{ width: "14.2857%", minHeight: 45 }}
                    />
                  );
                const key = dateKey(
                  new Date(month.getFullYear(), month.getMonth(), day),
                );
                const dayEvents = events.filter((event) => event.date === key);
                return (
                  <Pressable
                    key={column}
                    accessibilityRole="button"
                    accessibilityLabel={`${localDate(key).toLocaleDateString("en-US", { month: "long", day: "numeric" })}, ${dayEvents.length} events`}
                    accessibilityState={{ selected: selected === key }}
                    onPress={() => select(key)}
                    style={{
                      width: "14.2857%",
                      minHeight: 45,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <View
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 17,
                        backgroundColor:
                          selected === key ? palette.accent : "transparent",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        maxFontSizeMultiplier={1.3}
                        style={{
                          color:
                            selected === key
                              ? "#FFFFFF"
                              : key === today
                                ? palette.accent
                                : palette.label,
                          fontSize: 17,
                          fontWeight:
                            selected === key || key === today ? "700" : "400",
                        }}
                      >
                        {day}
                      </Text>
                    </View>
                    <View style={{ height: 5, flexDirection: "row", gap: 3 }}>
                      {dayEvents.slice(0, 3).map((event) => (
                        <View
                          key={event.id}
                          style={{
                            width: 4,
                            height: 4,
                            borderRadius: 2,
                            backgroundColor: categoryColors[event.category],
                          }}
                        />
                      ))}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
          style={{ marginVertical: -8 }}
        >
          {["Everyone", ...people.map((p) => p.name)].map((name) => (
            <Pressable
              key={name}
              accessibilityRole="button"
              accessibilityState={{ selected: member === name }}
              onPress={() => setMember(name)}
              style={{
                minHeight: 44,
                flexDirection: "row",
                alignItems: "center",
                gap: 7,
                paddingHorizontal: 14,
                borderRadius: 22,
                backgroundColor: member === name ? palette.label : palette.card,
              }}
            >
              {name === "Everyone" ? (
                <Icon
                  name="person.2.fill"
                  size={15}
                  color={member === name ? palette.card : palette.secondary}
                />
              ) : (
                <Faces members={[name]} size={23} />
              )}
              <Text
                style={{
                  color: member === name ? palette.card : palette.secondary,
                  fontWeight: "600",
                  fontSize: 13,
                }}
              >
                {name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
        <View style={{ gap: 12 }}>
          <SectionHeading
            title={
              selected === today
                ? "Today"
                : localDate(selected).toLocaleDateString("en-US", {
                    weekday: "long",
                  })
            }
            detail={localDate(selected).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          />
          {weatherEvent && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`See what to wear for ${weatherEvent.title}`}
              onPress={() =>
                router.navigate({
                  pathname: "/(tabs)/(outfits)/wear",
                  params: { eventId: weatherEvent.id },
                })
              }
              style={[
                styles.row,
                {
                  backgroundColor: colors.background,
                  borderRadius: 20,
                  padding: 16,
                },
              ]}
            >
              <Icon
                name={rainy ? "cloud.rain.fill" : "cloud.sun.fill"}
                size={36}
                color="#E9B851"
              />
              <View style={{ flex: 1, gap: 4 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: colors.text,
                  }}
                >
                  {rainy
                    ? "Bring a layer for the rain"
                    : "A good day for light layers"}
                </Text>
                <Text style={{ fontSize: 12, color: colors.secondary }}>
                  {rainy ? "12°–15°" : "17°–22°"} · Sample forecast
                </Text>
              </View>
              <Icon name="chevron.right" size={12} color={colors.secondary} />
            </Pressable>
          )}
          {visible.map((event) => (
            <Pressable
              key={event.id}
              onPress={() =>
                router.push({
                  pathname: "/event/[id]",
                  params: { id: event.id },
                })
              }
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.card,
                { padding: 16, opacity: pressed ? 0.65 : 1 },
              ]}
            >
              <View style={{ flexDirection: "row", gap: 13 }}>
                <View
                  style={{
                    width: 3,
                    borderRadius: 2,
                    backgroundColor: categoryColors[event.category],
                  }}
                />
                <View style={{ flex: 1, gap: 8 }}>
                  <View style={styles.row}>
                    <Text
                      style={{
                        color: categoryColors[event.category],
                        fontSize: 12,
                        fontWeight: "600",
                      }}
                    >
                      {event.category.toUpperCase()}
                    </Text>
                    <Text style={styles.caption}>{clockTime(event.time)}</Text>
                  </View>
                  <Text
                    style={{
                      color: palette.label,
                      fontSize: 19,
                      fontWeight: "600",
                      letterSpacing: -0.3,
                    }}
                  >
                    {event.title}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <Icon name="mappin" size={12} />
                    <Text
                      numberOfLines={1}
                      style={[styles.caption, { flex: 1 }]}
                    >
                      {event.location}
                    </Text>
                  </View>
                  <View style={[styles.row, { marginTop: 4 }]}>
                    <Faces members={event.members} />
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 6,
                        alignItems: "center",
                      }}
                    >
                      <Icon
                        name={
                          event.weather === "rain"
                            ? "cloud.rain.fill"
                            : "cloud.sun.fill"
                        }
                        size={17}
                        color={event.weather === "rain" ? "#5999C0" : "#DCAA44"}
                      />
                      <Text style={styles.caption}>
                        {event.weather === "rain" ? "14°" : "21°"}
                      </Text>
                      <Icon name="chevron.right" size={10} />
                    </View>
                  </View>
                </View>
              </View>
            </Pressable>
          ))}
          {visible.length === 0 && (
            <View
              style={[
                styles.card,
                { padding: 28, alignItems: "center", gap: 12 },
              ]}
            >
              <Icon
                name="calendar.badge.checkmark"
                size={34}
                color={palette.accent}
              />
              <Text style={[styles.sectionTitle, { fontSize: 19 }]}>
                A little room to breathe
              </Text>
              <Text
                style={[
                  styles.caption,
                  { textAlign: "center", lineHeight: 20 },
                ]}
              >
                No plans{" "}
                {member === "Everyone" ? "for this day" : `for ${member}`} yet.
              </Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => router.push("/new-event")}
                style={{ minHeight: 44, justifyContent: "center" }}
              >
                <Text
                  style={{
                    color: palette.accent,
                    fontWeight: "600",
                    fontSize: 16,
                  }}
                >
                  Add an event
                </Text>
              </Pressable>
            </View>
          )}
        </View>
        <Text style={[styles.caption, { textAlign: "center" }]}>
          Your family’s sample calendar
        </Text>
      </ScrollView>
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Button
          onPress={() => {
            select(today);
            setMonth(new Date());
          }}
        >
          Today
        </Stack.Toolbar.Button>
      </Stack.Toolbar>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          icon="plus"
          accessibilityLabel="Add event"
          onPress={() => router.push("/new-event")}
        />
      </Stack.Toolbar>
    </>
  );
}

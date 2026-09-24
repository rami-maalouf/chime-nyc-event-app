import { Text, View } from "react-native";
import {
  Icon,
  palette,
  SectionHeading,
  styles,
  useWeatherColors,
} from "./design";
import { clockTime, type FamilyEvent } from "@/features/demo/calendar";

export function WeatherPanel({ event }: { event: FamilyEvent }) {
  const colors = useWeatherColors();
  const rain = event.weather === "rain";
  const items = [
    {
      icon: "tshirt.fill" as const,
      title: rain ? "A comfortable base layer" : "Keep it light",
      body: rain
        ? "A long-sleeve tee for a cooler afternoon."
        : "A cotton tee or a breathable shirt.",
      color: "#729289",
      background: "#E7EFEB",
    },
    {
      icon: "jacket" as const,
      title: rain ? "Bring a rain jacket" : "Bring a light layer",
      body: rain
        ? "A waterproof shell for passing showers."
        : "A light jacket for when the sun dips.",
      color: "#A48A68",
      background: "#F1EBE1",
    },
    {
      icon: "shoe.fill" as const,
      title: rain ? "Water-resistant shoes" : "Comfortable sneakers",
      body: rain
        ? "Keep your feet dry on wet paths."
        : "An easy choice for a little exploring.",
      color: "#7D8FA8",
      background: "#E9EDF4",
    },
    {
      icon: rain ? ("umbrella.fill" as const) : ("sunglasses.fill" as const),
      title: rain ? "Pack an umbrella" : "Don’t forget sunglasses",
      body: rain
        ? "There’s a 70% chance of rain."
        : "A little shade for the sunny stretches.",
      color: "#B68F49",
      background: "#F7EEDC",
    },
  ];
  return (
    <View style={{ gap: 24 }}>
      <View
        style={[
          styles.card,
          { backgroundColor: colors.background, padding: 22, gap: 16 },
        ]}
      >
        <View style={styles.row}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <Icon name="location.fill" size={11} color={colors.secondary} />
            <Text style={{ color: colors.secondary, fontSize: 13 }}>
              {event.location.split(",").at(-1)?.trim()}
            </Text>
          </View>
          <Text
            style={{ color: colors.secondary, fontSize: 11, fontWeight: "600" }}
          >
            SAMPLE FORECAST
          </Text>
        </View>
        <View style={styles.row}>
          <View>
            <Text
              style={{
                color: colors.text,
                fontSize: 68,
                fontWeight: "300",
                letterSpacing: -4,
              }}
            >
              {rain ? "14°" : "21°"}
            </Text>
            <Text
              style={{ color: colors.text, fontSize: 17, fontWeight: "500" }}
            >
              {rain ? "Passing showers" : "A little sun, a little cloud"}
            </Text>
          </View>
          <Icon
            name={rain ? "cloud.rain.fill" : "cloud.sun.fill"}
            size={78}
            color={rain ? "#85B4D2" : "#E6B74F"}
          />
        </View>
        <Text style={{ color: colors.secondary, fontSize: 13 }}>
          Feels like {rain ? "12°–15°" : "17°–22°"} during your event
        </Text>
        <View
          style={{
            height: 0.5,
            backgroundColor: colors.secondary,
            opacity: 0.25,
          }}
        />
        <View style={styles.row}>
          {[
            {
              icon: "drop.fill" as const,
              label: rain ? "70% rain" : "10% rain",
            },
            { icon: "wind" as const, label: "12 km/h" },
            { icon: "sun.max" as const, label: "UV 4" },
          ].map((item) => (
            <View
              key={item.label}
              style={{ flexDirection: "row", gap: 6, alignItems: "center" }}
            >
              <Icon name={item.icon} size={14} color={colors.secondary} />
              <Text style={{ color: colors.text, fontSize: 12 }}>
                {item.label}
              </Text>
            </View>
          ))}
        </View>
      </View>
      <View style={{ gap: 12 }}>
        <SectionHeading title="You’ll be comfortable in…" />
        <Text
          style={{ color: palette.secondary, fontSize: 14, lineHeight: 20 }}
        >
          {event.outdoors
            ? "A few thoughtful layers for your time outside."
            : "A few layers for the journey there and back."}
        </Text>
        <View style={styles.card}>
          {items.map((item, i) => (
            <View
              key={item.title}
              style={{
                flexDirection: "row",
                gap: 14,
                padding: 17,
                alignItems: "center",
                borderBottomWidth: i === items.length - 1 ? 0 : 0.5,
                borderBottomColor: palette.separator,
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  backgroundColor: item.background,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Icon name={item.icon} size={25} color={item.color} />
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <Text
                  style={{
                    color: palette.label,
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                >
                  {item.title}
                </Text>
                <Text
                  style={{
                    color: palette.secondary,
                    fontSize: 13,
                    lineHeight: 19,
                  }}
                >
                  {item.body}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
      <View style={{ gap: 12 }}>
        <SectionHeading title="While you’re out" />
        <View
          style={[styles.card, { flexDirection: "row", paddingVertical: 20 }]}
        >
          {Array.from({ length: 5 }, (_, i) =>
            clockTime(`${(Number(event.time.split(":")[0]) + i) % 24}:00`),
          ).map((hour, i) => (
            <View key={hour} style={{ flex: 1, alignItems: "center", gap: 12 }}>
              <Text style={styles.caption}>{hour}</Text>
              <Icon
                name={
                  rain
                    ? "cloud.rain.fill"
                    : i > 2
                      ? "sun.haze.fill"
                      : "cloud.sun.fill"
                }
                size={24}
                color={rain ? "#85B4D2" : "#DCAF50"}
              />
              <Text
                style={{
                  color: palette.label,
                  fontSize: 17,
                  fontWeight: "500",
                }}
              >
                {(rain ? 15 : 22) - i}°
              </Text>
            </View>
          ))}
        </View>
      </View>
      <Text style={[styles.caption, { textAlign: "center", lineHeight: 19 }]}>
        Sample weather for this visual preview.{"\n"}Suggestions are for
        comfort, not a live forecast.
      </Text>
    </View>
  );
}

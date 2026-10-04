import { FieldGroup, Host, Picker, Switch } from "@expo/ui";
import { DatePicker } from "@expo/ui/swift-ui";
import { datePickerStyle, tint } from "@expo/ui/swift-ui/modifiers";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { Faces, Icon, palette, styles } from "@/components/calendar/design";
import {
  dateKey,
  localDate,
  people,
  useCalendar,
  type FamilyEvent,
} from "@/features/demo/calendar";

export default function NewEventScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { events, selected, save, select } = useCalendar();
  const existing = events.find((event) => event.id === id);
  const [title, setTitle] = useState(existing?.title ?? "");
  const [location, setLocation] = useState(existing?.location ?? "");
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [date, setDate] = useState(() => {
    const value = localDate(existing?.date ?? selected);
    const [hours, minutes] = (existing?.time ?? "16:00").split(":").map(Number);
    value.setHours(hours, minutes, 0, 0);
    return value;
  });
  const [duration, setDuration] = useState(existing?.duration ?? 60);
  const [category, setCategory] = useState<FamilyEvent["category"]>(
    existing?.category ?? "Family",
  );
  const [outdoors, setOutdoors] = useState(existing?.outdoors ?? true);
  const [members, setMembers] = useState(
    existing?.members ?? people.map((p) => p.name),
  );
  const formattedTime = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  const dirty =
    dateKey(date) !== (existing?.date ?? selected) ||
    formattedTime !== (existing?.time ?? "16:00") ||
    duration !== (existing?.duration ?? 60) ||
    category !== (existing?.category ?? "Family") ||
    outdoors !== (existing?.outdoors ?? true) ||
    people.some(
      (person) =>
        members.includes(person.name) !==
        (existing?.members ?? people.map((p) => p.name)).includes(person.name),
    ) ||
    title !== (existing?.title ?? "") ||
    location !== (existing?.location ?? "") ||
    notes !== (existing?.notes ?? "");
  function dismiss() {
    if (router.canGoBack()) router.back();
    else router.replace("/");
  }
  function close() {
    if (!dirty) {
      dismiss();
      return;
    }
    Alert.alert("Discard changes?", "Your event hasn’t been saved.", [
      { text: "Keep Editing", style: "cancel" },
      { text: "Discard", style: "destructive", onPress: dismiss },
    ]);
  }
  function commit() {
    if (!title.trim()) return;
    const event: FamilyEvent = {
      id: existing?.id ?? `event-${Date.now()}`,
      title: title.trim(),
      location: location.trim() || "Location to come",
      notes: notes.trim(),
      date: dateKey(date),
      time: formattedTime,
      duration,
      category,
      outdoors,
      members,
      weather: existing?.weather ?? "sun",
    };
    save(event);
    select(event.date);
    dismiss();
  }
  const inputStyle = {
    color: palette.label,
    fontSize: 17,
    minHeight: 44,
    width: "100%" as const,
  };
  return (
    <>
      <Host style={{ flex: 1 }}>
        <FieldGroup>
          <FieldGroup.Section>
            <TextInput
              accessibilityLabel="Event title"
              placeholder="Title"
              placeholderTextColor={palette.secondary}
              value={title}
              onChangeText={setTitle}
              style={inputStyle}
              autoFocus={false}
              maxLength={100}
            />
            <TextInput
              accessibilityLabel="Location"
              placeholder="Location"
              placeholderTextColor={palette.secondary}
              value={location}
              onChangeText={setLocation}
              style={inputStyle}
              maxLength={150}
            />
          </FieldGroup.Section>
          <FieldGroup.Section title="When">
            <DatePicker
              title="Date"
              selection={date}
              displayedComponents={["date"]}
              onDateChange={setDate}
              modifiers={[datePickerStyle("compact"), tint(palette.accent)]}
            />
            <DatePicker
              title="Starts"
              selection={date}
              displayedComponents={["hourAndMinute"]}
              onDateChange={setDate}
              modifiers={[datePickerStyle("compact"), tint(palette.accent)]}
            />
            <Picker selectedValue={duration} onValueChange={setDuration}>
              <Picker.Item label="30 minutes" value={30} />
              <Picker.Item label="45 minutes" value={45} />
              <Picker.Item label="1 hour" value={60} />
              <Picker.Item label="1½ hours" value={90} />
              <Picker.Item label="2 hours" value={120} />
              <Picker.Item label="3 hours" value={180} />
            </Picker>
          </FieldGroup.Section>
          <FieldGroup.Section title="Details">
            <Picker selectedValue={category} onValueChange={setCategory}>
              <Picker.Item label="Family" value="Family" />
              <Picker.Item label="School" value="School" />
              <Picker.Item label="Activities" value="Activities" />
            </Picker>
            <Switch
              label="Outdoors"
              value={outdoors}
              onValueChange={setOutdoors}
            />
            <FieldGroup.SectionFooter>
              <Text style={[styles.caption, { lineHeight: 18 }]}>
                We’ll suggest layers for the weather while you’re out.
              </Text>
            </FieldGroup.SectionFooter>
          </FieldGroup.Section>
          <FieldGroup.Section title="Who’s coming?">
            {people.map((person) => (
              <Pressable
                key={person.name}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: members.includes(person.name) }}
                accessibilityLabel={person.name}
                onPress={() =>
                  setMembers((current) =>
                    current.includes(person.name)
                      ? current.filter((name) => name !== person.name)
                      : [...current, person.name],
                  )
                }
                style={[styles.row, { minHeight: 46 }]}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <Faces members={[person.name]} size={30} />
                  <Text style={styles.body}>{person.name}</Text>
                </View>
                {members.includes(person.name) && (
                  <Icon name="checkmark" color={palette.accent} size={17} />
                )}
              </Pressable>
            ))}
          </FieldGroup.Section>
          <FieldGroup.Section title="A little note">
            <TextInput
              accessibilityLabel="Notes"
              value={notes}
              onChangeText={setNotes}
              multiline
              placeholder="Anything to remember?"
              placeholderTextColor={palette.secondary}
              style={[
                inputStyle,
                { minHeight: 90, textAlignVertical: "top", paddingTop: 10 },
              ]}
              maxLength={1000}
            />
            <FieldGroup.SectionFooter>
              <Text style={styles.caption}>
                Saved on this preview only. No account needed.
              </Text>
            </FieldGroup.SectionFooter>
          </FieldGroup.Section>
        </FieldGroup>
      </Host>
      <Stack.Screen
        options={{
          title: existing ? "Edit Event" : "New Event",
          gestureEnabled: !dirty,
        }}
      />
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Button onPress={close}>Cancel</Stack.Toolbar.Button>
      </Stack.Toolbar>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          variant="done"
          disabled={!title.trim()}
          onPress={commit}
        >
          {existing ? "Done" : "Add"}
        </Stack.Toolbar.Button>
      </Stack.Toolbar>
    </>
  );
}

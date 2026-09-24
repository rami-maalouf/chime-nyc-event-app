import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";

export type FamilyEvent = {
  id: string;
  title: string;
  location: string;
  date: string;
  time: string;
  duration: number;
  category: "Family" | "School" | "Activities";
  members: string[];
  outdoors: boolean;
  notes: string;
  weather: "sun" | "rain" | "cloud";
};
export const people = [
  { name: "You", initials: "R", color: "#D9714B", background: "#FBE9DF" },
  { name: "Alex", initials: "A", color: "#658765", background: "#E5EDDF" },
  { name: "Emma", initials: "E", color: "#9780BD", background: "#EDE5F5" },
  { name: "Leo", initials: "L", color: "#5285AE", background: "#E1EDF6" },
];
export const categoryColors = {
  Family: "#E98450",
  School: "#9B80C7",
  Activities: "#6B9D87",
};
export function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function localDate(key: string) {
  return new Date(`${key}T12:00:00`);
}
const today = new Date();
function relativeDate(days: number) {
  const d = new Date(today);
  d.setDate(d.getDate() + days);
  return dateKey(d);
}
const initialEvents: FamilyEvent[] = [
  {
    id: "picnic",
    title: "Picnic in the park",
    location: "Central Park, New York",
    date: relativeDate(0),
    time: "16:00",
    duration: 120,
    category: "Family",
    members: ["You", "Alex", "Emma", "Leo"],
    outdoors: true,
    notes:
      "Our usual spot by the lake. Bring a blanket, sandwiches, and something to share.",
    weather: "sun",
  },
  {
    id: "piano",
    title: "Emma’s piano lesson",
    location: "West Side Music, New York",
    date: relativeDate(0),
    time: "14:30",
    duration: 45,
    category: "Activities",
    members: ["Alex", "Emma"],
    outdoors: false,
    notes: "Don’t forget the music book.",
    weather: "cloud",
  },
  {
    id: "dinner",
    title: "Dinner at Grandma’s",
    location: "Brooklyn, New York",
    date: relativeDate(0),
    time: "19:00",
    duration: 90,
    category: "Family",
    members: ["You", "Alex", "Emma", "Leo"],
    outdoors: false,
    notes: "A little family time around the table.",
    weather: "cloud",
  },
  {
    id: "soccer",
    title: "Leo’s soccer practice",
    location: "Riverside Park, New York",
    date: relativeDate(1),
    time: "16:30",
    duration: 60,
    category: "Activities",
    members: ["You", "Leo"],
    outdoors: true,
    notes: "Bring a water bottle and cleats. Meet at the north field.",
    weather: "rain",
  },
  {
    id: "school",
    title: "School open house",
    location: "Lincoln Elementary, New York",
    date: relativeDate(2),
    time: "10:00",
    duration: 90,
    category: "School",
    members: ["You", "Alex", "Emma"],
    outdoors: false,
    notes: "Meet Emma’s teachers and see the classroom.",
    weather: "sun",
  },
  {
    id: "market",
    title: "Sunday farmers market",
    location: "Union Square, New York",
    date: relativeDate(3),
    time: "09:30",
    duration: 120,
    category: "Family",
    members: ["You", "Alex"],
    outdoors: true,
    notes: "Coffee first. Bring the tote bags.",
    weather: "sun",
  },
];
type CalendarState = {
  events: FamilyEvent[];
  selected: string;
  select(date: string): void;
  save(event: FamilyEvent): void;
  remove(id: string): void;
};
const CalendarContext = createContext<CalendarState | null>(null);
export function CalendarProvider({ children }: PropsWithChildren) {
  const [events, setEvents] = useState(initialEvents);
  const [selected, select] = useState(dateKey(today));
  const save = (event: FamilyEvent) =>
    setEvents((current) => [
      ...current.filter((item) => item.id !== event.id),
      event,
    ]);
  const remove = (id: string) =>
    setEvents((current) => current.filter((event) => event.id !== id));
  return (
    <CalendarContext.Provider
      value={{ events, selected, select, save, remove }}
    >
      {children}
    </CalendarContext.Provider>
  );
}
export function useCalendar() {
  const value = useContext(CalendarContext);
  if (!value) throw new Error("CalendarProvider is missing");
  return value;
}
export function clockTime(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  return `${hour % 12 || 12}${minute ? `:${String(minute).padStart(2, "0")}` : ""} ${hour < 12 ? "AM" : "PM"}`;
}

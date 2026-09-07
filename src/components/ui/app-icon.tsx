import {
  Lucide,
  type LucideIconName,
} from "@react-native-vector-icons/lucide/static";

export type AppIconName =
  | "bell"
  | "cloud"
  | "search"
  | "check"
  | "menu"
  | "camera"
  | "chevronDown"
  | "chevrons"
  | "clock"
  | "timer"
  | "info"
  | "lock"
  | "stop"
  | "offline"
  | "wifi"
  | "wifiOff"
  | "device"
  | "sync"
  | "database"
  | "warning"
  | "upload"
  | "next"
  | "star"
  | "notes"
  | "save"
  | "history"
  | "sets"
  | "volume"
  | "intensity"
  | "flame"
  | "calories"
  | "trophy"
  | "strength"
  | "play"
  | "add"
  | "edit"
  | "open"
  | "briefcase"
  | "body"
  | "running"
  | "today"
  | "routines"
  | "exercises"
  | "home"
  | "workouts"
  | "progress"
  | "profile"
  | "trash"
  | "arrowUp"
  | "arrowDown";

const icons: Record<AppIconName, LucideIconName> = {
  bell: "bell",
  cloud: "cloud",
  search: "search",
  check: "check",
  menu: "ellipsis",
  camera: "camera",
  chevronDown: "chevron-down",
  chevrons: "chevrons-up-down",
  clock: "clock",
  timer: "timer",
  info: "info",
  lock: "lock",
  stop: "square",
  offline: "cloud-off",
  wifi: "wifi",
  wifiOff: "wifi-off",
  device: "smartphone",
  sync: "refresh-cw",
  database: "database",
  warning: "triangle-alert",
  upload: "upload",
  next: "skip-forward",
  star: "star",
  notes: "text",
  save: "save",
  history: "history",
  sets: "list",
  volume: "chart-line",
  intensity: "zap",
  flame: "flame",
  calories: "activity",
  trophy: "trophy",
  strength: "dumbbell",
  play: "play",
  add: "plus",
  edit: "pencil",
  open: "external-link",
  briefcase: "briefcase",
  body: "biceps-flexed",
  running: "activity",
  today: "calendar",
  routines: "route",
  exercises: "list",
  home: "house",
  workouts: "dumbbell",
  progress: "chart-bar",
  profile: "user",
  trash: "trash-2",
  arrowUp: "arrow-up",
  arrowDown: "arrow-down",
};

type AppIconProps = {
  color: string;
  name: AppIconName;
  size?: number;
};

export function AppIcon({ color, name, size = 16 }: AppIconProps) {
  return (
    <Lucide
      accessibilityElementsHidden
      color={color}
      name={icons[name]}
      size={size}
    />
  );
}

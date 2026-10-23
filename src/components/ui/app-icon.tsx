import {
  Lucide,
  type LucideIconName,
} from "@react-native-vector-icons/lucide/static";

export type AppIconName =
  | "bell"
  | "cloud"
  | "cloudCheck"
  | "search"
  | "check"
  | "menu"
  | "camera"
  | "chevronDown"
  | "chevronUp"
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
  | "settings"
  | "faceScan"
  | "fingerprint"
  | "shield"
  | "trash"
  | "arrowUp"
  | "arrowDown"
  | "chevronLeft"
  | "chevronRight"
  | "calendar"
  | "copy"
  | "undo"
  | "close"
  | "move"
  | "swap";

const icons: Record<AppIconName, LucideIconName> = {
  bell: "bell",
  cloud: "cloud",
  cloudCheck: "cloud-check",
  search: "search",
  check: "check",
  menu: "ellipsis",
  camera: "camera",
  chevronDown: "chevron-down",
  chevronUp: "chevron-up",
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
  settings: "settings",
  faceScan: "scan-face",
  fingerprint: "fingerprint",
  shield: "shield-check",
  trash: "trash-2",
  arrowUp: "arrow-up",
  arrowDown: "arrow-down",
  chevronLeft: "chevron-left",
  chevronRight: "chevron-right",
  calendar: "calendar-days",
  copy: "copy",
  undo: "undo-2",
  close: "x",
  move: "move-right",
  swap: "arrow-left-right",
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

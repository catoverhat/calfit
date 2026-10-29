import React from "react";

import { getTodayDashboardSnapshot, type DashboardSnapshot } from "@/db";
import { useTodayDashboard } from "./use-today-dashboard";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { act, create } = require("react-test-renderer");
let mockFocusVersion = 0;

jest.mock("expo-router", () => ({
  router: { push: jest.fn() },
  useFocusEffect: (effect: () => void) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("react").useEffect(effect, [effect, mockFocusVersion]);
  },
}));
jest.mock("@/db", () => ({
  ...jest.requireActual("@/db"),
  initializeLocalDatabase: jest.fn().mockResolvedValue({}),
  seedDemoRoutinesIfEmpty: jest.fn().mockResolvedValue(undefined),
  getTodayDashboardSnapshot: jest.fn(),
}));

const snapshot: DashboardSnapshot = {
  user: {
    user_id: "local-user",
    username: "Athlete",
    theme_preference: "system",
    email: null,
    dob: null,
    height: null,
    height_unit: "cm",
    weight_unit: "kg",
    speed_unit: "kmh",
    distance_unit: "km",
    created_at: "now",
    updated_at: "now",
  },
  activeSession: null,
  planEntry: null,
  latestBodyMeasurement: null,
  previousBodyMeasurement: null,
  workoutStreak: 0,
  completedWorkoutCount: 3,
};
let dashboard: ReturnType<typeof useTodayDashboard>;
function Probe() {
  const value = useTodayDashboard();
  React.useEffect(() => {
    dashboard = value;
  });
  return null;
}

test("recovers from load failure and keeps the dashboard visible during later focus refreshes", async () => {
  (
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true;
  jest
    .mocked(getTodayDashboardSnapshot)
    .mockRejectedValueOnce(new Error("Could not load"))
    .mockResolvedValueOnce(snapshot);
  let root: ReturnType<typeof create>;
  await act(async () => {
    root = create(<Probe />);
  });
  expect(dashboard.error).toBe("Could not load");
  await act(async () => {
    dashboard.retry();
  });
  expect(dashboard.error).toBeNull();
  expect(dashboard.data.progress.completedWorkouts).toBe(3);

  let finishRefresh!: (value: DashboardSnapshot) => void;
  jest.mocked(getTodayDashboardSnapshot).mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        finishRefresh = resolve;
      }),
  );
  mockFocusVersion += 1;
  await act(async () => {
    root.update(<Probe />);
  });
  expect(dashboard.isLoading).toBe(false);
  expect(dashboard.data.progress.completedWorkouts).toBe(3);
  await act(async () => {
    finishRefresh({ ...snapshot, completedWorkoutCount: 4 });
  });
  expect(dashboard.data.progress.completedWorkouts).toBe(4);
  await act(async () => {
    root.unmount();
  });
});

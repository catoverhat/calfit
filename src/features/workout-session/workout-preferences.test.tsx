import Storage from "expo-sqlite/kv-store";
import React from "react";
import {
  WorkoutPreferencesProvider,
  useWorkoutPreferences,
} from "./workout-preferences";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { act, create } = require("react-test-renderer");
jest.mock("expo-sqlite/kv-store", () => ({
  __esModule: true,
  default: { getItemAsync: jest.fn(), setItemAsync: jest.fn() },
}));
let preferences: ReturnType<typeof useWorkoutPreferences>;
function Probe() {
  const value = useWorkoutPreferences();
  React.useEffect(() => {
    preferences = value;
  });
  return null;
}
const tree = (
  <WorkoutPreferencesProvider>
    <Probe />
  </WorkoutPreferencesProvider>
);
beforeEach(() => {
  jest.resetAllMocks();
  jest.mocked(Storage.getItemAsync).mockResolvedValue(null);
  jest.mocked(Storage.setItemAsync).mockResolvedValue(undefined);
  (
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true;
});

test("defaults to normal timeout and restores a saved opt-in on a new mount", async () => {
  let root: ReturnType<typeof create>;
  await act(async () => {
    root = create(tree);
  });
  expect(preferences.keepScreenAwake).toBe(false);
  await act(async () => {
    await preferences.setKeepScreenAwake(true);
  });
  expect(Storage.setItemAsync).toHaveBeenCalledWith(
    "calfit.keep-screen-awake-during-workouts",
    "true",
  );
  expect(preferences.keepScreenAwake).toBe(true);
  await act(async () => {
    root.unmount();
  });
  jest.mocked(Storage.getItemAsync).mockResolvedValue("true");
  await act(async () => {
    root = create(tree);
  });
  expect(preferences.keepScreenAwake).toBe(true);
  await act(async () => {
    root.unmount();
  });
});

test("retains the previous preference when saving fails and permits retry", async () => {
  let root: ReturnType<typeof create>;
  await act(async () => {
    root = create(tree);
  });
  jest
    .mocked(Storage.setItemAsync)
    .mockRejectedValueOnce(new Error("Disk full"));
  await act(async () => {
    await preferences.setKeepScreenAwake(true);
  });
  expect(preferences.keepScreenAwake).toBe(false);
  expect(preferences.error).toContain("could not be saved");
  await act(async () => {
    await preferences.setKeepScreenAwake(true);
  });
  expect(preferences.keepScreenAwake).toBe(true);
  expect(preferences.error).toBeNull();
  await act(async () => {
    root.unmount();
  });
});

test("load failure safely allows timeout and can be recovered by saving", async () => {
  jest
    .mocked(Storage.getItemAsync)
    .mockRejectedValueOnce(new Error("Read failed"));
  let root: ReturnType<typeof create>;
  await act(async () => {
    root = create(tree);
  });
  expect(preferences.isLoading).toBe(false);
  expect(preferences.keepScreenAwake).toBe(false);
  expect(preferences.error).toContain("could not be loaded");
  await act(async () => {
    await preferences.setKeepScreenAwake(true);
  });
  expect(preferences.error).toBeNull();
  await act(async () => {
    root.unmount();
  });
});

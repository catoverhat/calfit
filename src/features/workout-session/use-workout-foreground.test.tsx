import React from "react";
import { AppState, type AppStateStatus } from "react-native";
import { useWorkoutForeground } from "./use-workout-foreground";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { act, create } = require("react-test-renderer");
let mockFocused = true;
jest.mock("expo-router", () => ({
  useFocusEffect: (effect: () => void) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("react").useEffect(
      () => (mockFocused ? effect() : undefined),
      [effect, mockFocused],
    );
  },
}));
let foreground = false;
function Probe() {
  const value = useWorkoutForeground();
  React.useEffect(() => {
    foreground = value;
  });
  return null;
}

test("requires both route focus and an active app, and unsubscribes on unmount", async () => {
  (
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true;
  const originalState = AppState.currentState;
  AppState.currentState = "active";
  let listener!: (state: AppStateStatus) => void;
  const remove = jest.fn();
  const subscription = jest
    .spyOn(AppState, "addEventListener")
    .mockImplementation((_, callback) => {
      listener = callback;
      return { remove };
    });
  let root: ReturnType<typeof create>;
  await act(async () => {
    root = create(<Probe />);
  });
  expect(foreground).toBe(true);
  await act(async () => {
    AppState.currentState = "inactive";
    listener("inactive");
  });
  expect(foreground).toBe(false);
  await act(async () => {
    AppState.currentState = "active";
    listener("active");
  });
  expect(foreground).toBe(true);
  mockFocused = false;
  await act(async () => {
    root.update(<Probe />);
  });
  expect(foreground).toBe(false);
  mockFocused = true;
  await act(async () => {
    root.update(<Probe />);
  });
  expect(foreground).toBe(true);
  await act(async () => {
    root.unmount();
  });
  expect(remove).toHaveBeenCalledTimes(1);
  subscription.mockRestore();
  AppState.currentState = originalState;
});

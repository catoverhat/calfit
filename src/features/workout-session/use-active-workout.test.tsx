import { logWorkoutSet } from "@/db";
import React from "react";
import { useActiveWorkout } from "./use-active-workout";
import type { WorkoutSessionViewModel } from "./workout-session.viewmodel";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { act, create } = require("react-test-renderer");
jest.mock("@/db", () => ({
  ...jest.requireActual("@/db"),
  initializeLocalDatabase: jest.fn().mockResolvedValue({}),
  logWorkoutSet: jest.fn().mockResolvedValue(undefined),
}));
const startedAt = "2026-10-24T12:00:00.000Z";
const workout: WorkoutSessionViewModel = {
  id: "workout",
  title: "Workout",
  startedAt,
  createdAt: startedAt,
  completedAt: null,
  scheduledFor: null,
  status: "in_progress",
  weightUnit: "kg",
  speedUnit: "kmh",
  distanceUnit: "km",
  exercises: [
    {
      id: "exercise",
      name: "Squat",
      description: null,
      imageUrl: null,
      videoUrl: null,
      sets: [
        {
          id: "set",
          completed: true,
          completedAt: startedAt,
          restTimeSeconds: 60,
          setNumber: 1,
          fields: ["reps"],
          reps: "5",
          weight: "",
          speed: "",
          distance: "",
          duration: "",
        },
      ],
    },
  ],
};
let active: ReturnType<typeof useActiveWorkout>;
function Probe({ foreground }: { foreground: boolean }) {
  const value = useActiveWorkout(workout, foreground);
  React.useEffect(() => {
    active = value;
  });
  return null;
}
beforeEach(() => {
  jest.useFakeTimers({
    doNotFake: ["queueMicrotask", "nextTick", "setImmediate"],
  });
  jest.setSystemTime(new Date(startedAt));
  jest.clearAllMocks();
  (
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true;
});
afterEach(() => {
  jest.useRealTimers();
});

test("stops ticks in background and catches elapsed and rest timers up on return", async () => {
  let root: ReturnType<typeof create>;
  await act(async () => {
    root = create(<Probe foreground />);
  });
  expect(active.restSeconds).toBe(60);
  await act(async () => {
    jest.advanceTimersByTime(5000);
  });
  expect(active.elapsedSeconds).toBe(5);
  await act(async () => {
    root.update(<Probe foreground={false} />);
  });
  expect(jest.getTimerCount()).toBe(0);
  await act(async () => {
    jest.advanceTimersByTime(90_000);
  });
  expect(active.elapsedSeconds).toBe(5);
  await act(async () => {
    root.update(<Probe foreground />);
  });
  expect(active.elapsedSeconds).toBe(95);
  expect(active.restSeconds).toBe(0);
  await act(async () => {
    root.unmount();
  });
  expect(jest.getTimerCount()).toBe(0);
});

test("saves pending input immediately when the workout loses foreground", async () => {
  let root: ReturnType<typeof create>;
  await act(async () => {
    root = create(<Probe foreground />);
  });
  await act(async () => {
    active.updateField("set", "reps", "8");
  });
  expect(logWorkoutSet).not.toHaveBeenCalled();
  await act(async () => {
    root.update(<Probe foreground={false} />);
  });
  expect(logWorkoutSet).toHaveBeenCalledWith(
    {},
    "set",
    expect.objectContaining({ reps: 8 }),
  );
  expect(jest.getTimerCount()).toBe(0);
  await act(async () => {
    root.unmount();
  });
});

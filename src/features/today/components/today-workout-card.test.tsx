import { Link } from "expo-router";
import React from "react";

import {
  createTodayDashboardData,
  type TodayDashboardData,
} from "../today-dashboard.viewmodel";
import { TodayWorkoutCard } from "./today-workout-card";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { act, create } = require("react-test-renderer");

jest.mock("expo-router", () => ({
  Link: ({ children }: { children: React.ReactNode }) => children,
}));
jest.mock("@/components/ui/app-icon", () => ({ AppIcon: () => null }));
jest.mock("@/theme/app-theme-provider", () => ({
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  useAppTheme: () => require("@/theme/palettes").AppThemes.dark,
}));

const routine = {
  id: "planned-workout",
  planEntryId: "plan",
  title: "Planned push day",
  focus: "Chest",
  exercises: 3,
  duration: "30 min",
  state: "assigned" as const,
};

beforeEach(() => {
  (
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true;
});

async function renderCard(
  data: TodayDashboardData,
  error: string | null = null,
) {
  const actions = {
    onBrowseWorkouts: jest.fn(),
    onOpenPlan: jest.fn(),
    onRetry: jest.fn(),
    onStart: jest.fn(),
  };
  let root: ReturnType<typeof create>;
  await act(async () => {
    root = create(
      <TodayWorkoutCard
        data={data}
        error={error}
        isLoading={false}
        isStarting={false}
        {...actions}
      />,
    );
  });
  return { root, actions };
}

test.each(["completed", "unavailable"] as const)(
  "can resume another active session when today’s plan is %s",
  async (state) => {
    const { root, actions } = await renderCard({
      ...createTodayDashboardData(null),
      activeSessionId: "active-session",
      activeWorkoutIsSeparate: true,
      routine: { ...routine, state },
    });
    const resume = root.root.findByProps({
      accessibilityLabel: "Resume workout",
    });
    expect(resume.props.disabled).toBe(false);
    await act(async () => {
      resume.props.onPress();
    });
    expect(actions.onStart).toHaveBeenCalledTimes(1);
    expect(root.root.findAllByType(Link)).toHaveLength(0);
    await act(async () => {
      root.unmount();
    });
  },
);

test("opens the completed session summary instead of showing a disabled start button", async () => {
  const { root } = await renderCard({
    ...createTodayDashboardData(null),
    completedSessionId: "completed-session",
    routine: { ...routine, state: "completed" },
  });
  expect(root.root.findByType(Link).props.href).toEqual({
    pathname: "/progress/summary",
    params: { sessionId: "completed-session" },
  });
  await act(async () => {
    root.unmount();
  });
});

test("offers workout discovery on an unplanned day", async () => {
  const { root, actions } = await renderCard(createTodayDashboardData(null));
  const browse = root.root.findByProps({
    accessibilityLabel: "Find a workout",
  });
  await act(async () => {
    browse.props.onPress();
  });
  expect(actions.onBrowseWorkouts).toHaveBeenCalledTimes(1);
  expect(actions.onStart).not.toHaveBeenCalled();
  await act(async () => {
    root.unmount();
  });
});

test("offers recovery after loading or starting a workout fails", async () => {
  const { root, actions } = await renderCard(
    createTodayDashboardData(null),
    "Could not load workout",
  );
  const retry = root.root.findByProps({ accessibilityLabel: "Try again" });
  await act(async () => {
    retry.props.onPress();
  });
  expect(actions.onRetry).toHaveBeenCalledTimes(1);
  await act(async () => {
    root.unmount();
  });
});

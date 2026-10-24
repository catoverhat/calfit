import React from 'react';

import { assignWorkoutToDate, getWorkoutPlanEntries, type WorkoutPlanUndo } from '@/db';
import { useWeeklyPlan } from './use-weekly-plan';

// The renderer ships with jest-expo; avoid adding a testing runtime dependency.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { act, create } = require('react-test-renderer');

jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
  useFocusEffect: (effect: () => void) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('react').useEffect(effect, [effect]);
  },
}));

jest.mock('@/db', () => ({
  initializeLocalDatabase: jest.fn().mockResolvedValue({}),
  seedDemoRoutinesIfEmpty: jest.fn().mockResolvedValue(undefined),
  getWorkoutPlanEntries: jest.fn().mockResolvedValue([]),
  getRoutineSummaries: jest.fn().mockResolvedValue([]),
  getLocalUserProfile: jest.fn().mockResolvedValue({ username: 'Athlete' }),
  assignWorkoutToDate: jest.fn(),
}));

let planner: ReturnType<typeof useWeeklyPlan>;
function Probe() {
  const value = useWeeklyPlan('2026-10-23');
  React.useEffect(() => { planner = value; });
  return null;
}

beforeEach(() => {
  jest.clearAllMocks();
  (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
});

test('assignment keeps the week visible and marks only its date busy until refreshed data arrives', async () => {
  let root: { unmount: () => void };
  await act(async () => { root = create(<Probe />); });
  expect(planner.isLoading).toBe(false);
  expect(planner.weekModel.days).toHaveLength(7);

  let finishWrite!: (value: WorkoutPlanUndo) => void;
  jest.mocked(assignWorkoutToDate).mockImplementationOnce(() => new Promise((resolve) => { finishWrite = resolve; }));
  let save!: Promise<void>;
  await act(async () => { save = planner.assign('2026-10-24', 'workout'); });
  expect(planner.isLoading).toBe(false);
  expect(planner.savingDates).toEqual(['2026-10-24']);
  expect(planner.weekModel.days).toHaveLength(7);

  await act(async () => { await planner.assign('2026-10-24', 'workout'); });
  expect(assignWorkoutToDate).toHaveBeenCalledTimes(1);

  let finishRead!: (value: never[]) => void;
  jest.mocked(getWorkoutPlanEntries).mockImplementationOnce(() => new Promise((resolve) => { finishRead = resolve; }));
  await act(async () => { finishWrite({ affectedDates: ['2026-10-24'], before: [], userId: 'local' }); });
  expect(planner.savingDates).toEqual(['2026-10-24']);
  expect(planner.isLoading).toBe(false);
  await act(async () => { finishRead([]); await save; });
  expect(planner.isSaving).toBe(false);
  expect(planner.savingDates).toEqual([]);
  await act(async () => { root!.unmount(); });
});

test('failed assignment preserves the week, clears busy state, and allows retry', async () => {
  let root: { unmount: () => void };
  await act(async () => { root = create(<Probe />); });
  jest.mocked(assignWorkoutToDate).mockRejectedValueOnce(new Error('Could not save'));
  await act(async () => { await planner.assign('2026-10-24', 'workout'); });
  expect(planner.error).toBe('Could not save');
  expect(planner.isLoading).toBe(false);
  expect(planner.isSaving).toBe(false);
  expect(planner.savingDates).toEqual([]);
  expect(planner.weekModel.days).toHaveLength(7);
  await act(async () => { await planner.assign('2026-10-24', 'workout'); });
  expect(assignWorkoutToDate).toHaveBeenCalledTimes(2);
  await act(async () => { root!.unmount(); });
});

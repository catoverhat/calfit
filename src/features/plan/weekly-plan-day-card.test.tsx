import React from 'react';
import { StyleSheet } from 'react-native';

import { DayCard } from './weekly-plan-day-card';
import type { WorkoutPlanDay } from './weekly-plan.viewmodel';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { act, create } = require('react-test-renderer');

jest.mock('react-native-reanimated', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: { View },
    LinearTransition: { duration: () => ({ reduceMotion: () => undefined }) },
    ReduceMotion: { System: 'system' },
  };
});
jest.mock('@/components/ui/app-icon', () => ({ AppIcon: () => null }));

const day: WorkoutPlanDay = {
  date: '2026-10-24', dateLabel: 'Oct 24', weekday: 'Saturday', editable: true,
  entryId: null, isToday: false, state: 'rest', stateLabel: 'Rest', workout: null,
};
const handlers = { onAssign: jest.fn(), onChange: jest.fn(), onMove: jest.fn(), onRemove: jest.fn(), onStart: jest.fn(), onView: jest.fn() };

beforeEach(() => {
  (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
});

test('assign action keeps its dimensions and centered label while saving', async () => {
  let root: ReturnType<typeof create>;
  await act(async () => { root = create(<DayCard {...handlers} day={day} busy={false} initialLoading={false} disabled={false} wide={false} />); });
  const button = root.root.findAll((node: { props: { accessibilityLabel?: string; style?: unknown } }) =>
    node.props.accessibilityLabel === `Assign a workout to ${day.weekday}, ${day.dateLabel}` && typeof node.props.style === 'function')[0];
  const idleStyle = StyleSheet.flatten(button.props.style({ pressed: false }));
  expect(idleStyle).toMatchObject({ width: 176, minHeight: 48, flexDirection: 'row', justifyContent: 'center' });
  await act(async () => { root.update(<DayCard {...handlers} day={day} busy initialLoading={false} disabled wide={false} />); });
  const saving = root.root.findByProps({ accessibilityLabel: 'Assigning workout' });
  expect(StyleSheet.flatten(saving.props.style({ pressed: false }))).toEqual(idleStyle);
  expect(saving.props.disabled).toBe(true);
  expect(JSON.stringify(root.toJSON())).toContain('Rest day');
  await act(async () => { root.unmount(); });
});

test('saving an existing assignment keeps the workout and action row mounted', async () => {
  const assigned: WorkoutPlanDay = { ...day, state: 'assigned', stateLabel: 'Assigned', entryId: 'entry', workout: { id: 'workout', title: 'Push Day', description: '', duration: '54 min', exerciseCount: 3 } };
  let root: ReturnType<typeof create>;
  await act(async () => { root = create(<DayCard {...handlers} day={assigned} busy initialLoading={false} disabled wide={false} />); });
  const content = JSON.stringify(root.toJSON());
  expect(content).toContain('Push Day');
  expect(content).toContain('Change');
  expect(content).toContain('Saving');
  expect(content).not.toContain('Loading day');
  await act(async () => { root.unmount(); });
});

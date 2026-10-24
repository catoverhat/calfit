/// <reference types="jest" />

import type { BodyMeasurementRow, UserRow, WorkoutHistoryItem } from '@/db';
import {
  createHistoryGroups,
  HISTORY_FILTERS,
  createMeasurementViewItems,
  createProgressDashboardData,
  createWorkoutSummaryData,
  validateMeasurementValues,
} from './progress.viewmodel';

const user: UserRow = {
  theme_preference: 'system',
  user_id: 'local-user', username: 'Local Athlete', email: null, dob: null, height: null,
  height_unit: 'cm', weight_unit: 'kg', speed_unit: 'kmh', distance_unit: 'km',
  created_at: '2026-07-01T12:00:00.000Z', updated_at: '2026-07-01T12:00:00.000Z',
};

const measurements: BodyMeasurementRow[] = [
  { body_measurement_id: 'new', user_id_fk: 'local-user', weight: 81.5, bmi: 23.4, body_fat_percentage: 14.2, created_at: '2026-07-06T12:00:00.000Z' },
  { body_measurement_id: 'old', user_id_fk: 'local-user', weight: 82, bmi: 23.6, body_fat_percentage: null, created_at: '2026-06-29T12:00:00.000Z' },
];

describe('progress view models', () => {
  it('maps measurements using the persisted unit and truthful missing values', () => {
    expect(createMeasurementViewItems(measurements, 'kg')).toEqual([
      expect.objectContaining({ id: 'new', weight: '81.5 kg', bmi: '23.4', bodyFat: '14.2%' }),
      expect.objectContaining({ id: 'old', bodyFat: '—' }),
    ]);
  });

  it('validates measurement dates and optional positive metrics', () => {
    expect(validateMeasurementValues({ bmi: '', bodyFat: '', date: '2026-02-30', weight: '' }).error).toBe('Enter a valid measurement date.');
    expect(validateMeasurementValues({ bmi: '', bodyFat: '101', date: '2026-07-06', weight: '82' }).error).toBe('Body fat percentage cannot exceed 100.');
    expect(validateMeasurementValues({ bmi: '', bodyFat: '', date: '2026-07-06', weight: '' }).error).toBe('Enter at least one measurement.');
    expect(validateMeasurementValues({ bmi: '23.1', bodyFat: '14,5', date: '2026-07-06', weight: '81.2' }).values).toEqual(expect.objectContaining({ bmi: 23.1, bodyFatPercentage: 14.5, weight: 81.2 }));
  });

  it('derives history status, completion, duration, volume, and month groups', () => {
    const history = [createSession('completed')];
    const groups = createHistoryGroups(history, 'completed', 'kg');
    expect(groups).toHaveLength(1);
    expect(groups[0].workouts[0]).toEqual(expect.objectContaining({ completion: 50, duration: '60m', statusLabel: 'Completed', volume: '500 kg' }));
    expect(createHistoryGroups(history, 'in_progress', 'kg')).toEqual([]);
  });

  it('exposes only supported session filters', () => {
    expect(HISTORY_FILTERS.map((filter) => filter.id)).toEqual(['all', 'completed', 'in_progress']);
  });

  it('creates a real summary from one persisted session', () => {
    expect(createWorkoutSummaryData(createSession('completed'), 'kg')).toEqual(expect.objectContaining({ duration: '60m', exerciseCount: 1, setCount: 2, statusLabel: 'Completed', title: 'Strength A', volume: '500 kg' }));
  });

  it('derives dashboard measurements, trends, weekly sessions, volume, and consistency', () => {
    const data = createProgressDashboardData({ history: [createSession('completed')], measurements, now: new Date(2026, 6, 6, 12), user });
    expect(data.metrics.map((metric) => metric.value)).toEqual(['23.4', '14.2%']);
    expect(data.latestWeight).toBe('81.5');
    expect(data.weightSegments).toHaveLength(1);
    expect(data.volumeTotal).toBe('500 kg');
    expect(data.weeklySessions.reduce((total, day) => total + day.value, 0)).toBe(1);
    expect(data.consistencyRows.flat()).toContain(1);
  });

  it.each([
    [7, 3, 2],
    [30, 5, 4],
    [90, 7, 6],
  ] as const)('filters workouts, training days, volume and chart buckets to %i calendar days', (period, count, days) => {
    const now = new Date(2026, 9, 23, 12);
    const history: WorkoutHistoryItem[] = [0, 0, 6, 7, 29, 30, 89, 90, -1].map((daysAgo, index) => ({
      ...createSession('completed'),
      workout_session_id: `completed-${index}`,
      completed_at: new Date(2026, 9, 23 - daysAgo, 23, 59).toISOString(),
    }));
    history.push({ ...createSession('in_progress'), started_at: now.toISOString() });
    const data = createProgressDashboardData({ history, measurements, now, period, user });
    expect(data.sessionCount).toBe(count);
    expect(data.trainingMetrics.map((metric) => metric.value)).toEqual([String(count), String(days)]);
    expect(data.weeklySessions.reduce((sum, bar) => sum + bar.value, 0)).toBe(count);
    expect(data.volumeTotal).toBe(`${new Intl.NumberFormat('en-US').format(count * 500)} kg`);
    expect(data.volumeSegments).toHaveLength(count - 1);
  });

  it('includes Sunday, aligns the calendar to Monday, and leaves future dates blank', () => {
    const sunday = { ...createSession('completed'), completed_at: new Date(2026, 6, 5, 12).toISOString() };
    const data = createProgressDashboardData({ history: [sunday], measurements: [], now: new Date(2026, 6, 6, 12), user });
    expect(data.consistencyRows).toHaveLength(7);
    expect(data.consistencyRows.every((row) => row.length === 13)).toBe(true);
    expect(data.consistencyRows[6][11]).toBe(1);
    expect(data.consistencyRows[0][12]).toBe(0);
    expect(data.consistencyRows[1][12]).toBeNull();
    expect(data.consistencySummary).toBe('1 training day in the last 13 weeks, including this week.');
  });

  it('keeps the latest weight when the newest measurement only records body fat', () => {
    const latest = { ...measurements[0], body_measurement_id: 'body-fat-only', created_at: '2026-07-07T12:00:00.000Z', weight: null };
    const data = createProgressDashboardData({ history: [], measurements: [latest, ...measurements], now: new Date(2026, 6, 7, 12), user });
    expect(data.latestWeight).toBe('81.5');
    expect(data.weightSummary).toContain('From 82 to 81.5 kg');
    expect(data.sessionCount).toBe(0);
    expect(data.sessionSummary).toBe('No completed workouts in the last 7 days.');
    expect(data.weeklySessions.every((bar) => bar.value === 0 && bar.height === 2)).toBe(true);
  });

  it('sums every workout in the selected period, including more than six', () => {
    const history = Array.from({ length: 8 }, () => createSession('completed'));
    const data = createProgressDashboardData({ history, measurements: [], now: new Date(2026, 6, 6, 12), user });
    expect(data.volumeTotal).toBe('4,000 kg');
    expect(data.volumeSegments).toHaveLength(7);
    expect(data.trainingMetrics[1].value).toBe('1');
    expect(data.consistencyRows[0][12]).toBe(3);
  });
});

function createSession(status: WorkoutHistoryItem['status']): WorkoutHistoryItem {
  return {
    workout_session_id: `session-${status}`, user_id_fk: 'local-user', routine_id_fk: 'routine-1', routine_name: 'Strength A', scheduled_for: null,
    started_at: '2026-07-06T13:00:00.000Z', completed_at: status === 'completed' ? '2026-07-06T14:00:00.000Z' : null, status, created_at: '2026-07-06T13:00:00.000Z',
    exercises: [{
      workout_exercise_id: 'workout-exercise-1', workout_session_id_fk: `session-${status}`, exercise_id_fk: 'exercise-1', order_index: 0, created_at: '2026-07-06T13:00:00.000Z',
      exercise: { exercise_id: 'exercise-1', name: 'Squat', description: null, image_url: null, video_url: null, active: 1, user_id_fk: null, category_id_fk: 'cat-legs', created_at: '2026-07-01T12:00:00.000Z', updated_at: '2026-07-01T12:00:00.000Z' },
      sets: [createSet('set-1', 5, 100, 1), createSet('set-2', 10, 100, 0)],
    }],
  };
}

function createSet(id: string, reps: number, weight: number, completed: number) {
  return { workout_set_id: id, workout_exercise_id_fk: 'workout-exercise-1', set_number: Number(id.at(-1)), reps, weight, speed: null, duration_seconds: null, distance: null, rest_time_seconds: 90, completed, completed_at: completed ? '2026-07-06T13:05:00.000Z' : null, created_at: '2026-07-06T13:00:00.000Z' };
}

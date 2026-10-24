/// <reference types="jest" />

import {
  createTodayDashboardData,
} from '@/features/today/today-dashboard.viewmodel';
import type { DashboardSnapshot, RoutineDetail, UserRow } from '@/db';

const user: UserRow = {
  theme_preference: 'system',
  user_id: 'local-user',
  username: 'Local Athlete',
  email: null,
  dob: null,
  height: null,
  height_unit: 'cm',
  weight_unit: 'kg',
  speed_unit: 'kmh',
  distance_unit: 'km',
  created_at: '2026-07-06T12:00:00.000Z',
  updated_at: '2026-07-06T12:00:00.000Z',
};

const routine: RoutineDetail = {
  routine_id: 'routine-1',
  user_id_fk: 'local-user',
  name: 'Push Day',
  description: 'Hypertrophy - Chest, Shoulders, Triceps',
  active: 1,
  created_at: '2026-07-06T12:00:00.000Z',
  updated_at: '2026-07-06T12:00:00.000Z',
  exercises: [
    {
      routine_exercise_id: 'routine-exercise-1',
      routine_id_fk: 'routine-1',
      exercise_id_fk: 'exercise-1',
      order_index: 0,
      created_at: '2026-07-06T12:00:00.000Z',
      exercise: {
        exercise_id: 'exercise-1',
        name: 'Bench Press',
        description: null,
        image_url: null,
        video_url: null,
        active: 1,
        user_id_fk: 'local-user',
        category_id_fk: 'cat-chest',
        created_at: '2026-07-06T12:00:00.000Z',
        updated_at: '2026-07-06T12:00:00.000Z',
      },
      targets: [
        {
          routine_exercise_target_id: 'target-1',
          routine_exercise_id_fk: 'routine-exercise-1',
          set_number: 1,
          target_reps: 10,
          target_weight: 60,
          target_speed: null,
          target_duration_seconds: null,
          target_distance: null,
          rest_time_seconds: 90,
          created_at: '2026-07-06T12:00:00.000Z',
        },
      ],
    },
  ],
};

const baseSnapshot: DashboardSnapshot = {
  activeSession: null,
  user,
  planEntry: {
    workout_plan_entry_id: 'plan-1',
    user_id_fk: 'local-user',
    routine_id_fk: 'routine-1',
    planned_date: '2026-07-06',
    workout_session_id_fk: null,
    created_at: '2026-07-06T08:00:00.000Z',
    updated_at: '2026-07-06T08:00:00.000Z',
    routine,
    session: null,
  },
  latestBodyMeasurement: null,
  previousBodyMeasurement: null,
  workoutStreak: 0,
  completedWorkoutCount: 0,
};

describe('today dashboard view models', () => {
  it('maps a dashboard snapshot without body measurements into truthful empty progress', () => {
    const data = createTodayDashboardData(baseSnapshot, new Date('2026-07-06T12:00:00.000Z'));

    expect(data.dateLabel).toBe('Monday, Jul 6');
    expect(data.syncLabel).toBe('Saved locally');
    expect(data.name).toBe('Local Athlete');
    expect(data.progress).toEqual({
      bodyWeight: 'Not logged',
      bodyWeightDelta: 'Add a measurement',
      streak: '0 days',
      streakProgress: 0,
    });
    expect('calories' in data.progress).toBe(false);
    expect(data.routine).toEqual(
      expect.objectContaining({
        id: 'routine-1',
        title: 'Push Day',
        focus: 'Hypertrophy - Chest, Shoulders, Triceps',
        exercises: 1,
      })
    );
  });

  it('maps one body measurement without inventing a delta', () => {
    const data = createTodayDashboardData(
      {
        ...baseSnapshot,
        latestBodyMeasurement: {
          body_measurement_id: 'measurement-1',
          user_id_fk: 'local-user',
          weight: 81.7,
          bmi: null,
          body_fat_percentage: null,
          created_at: '2026-07-06T08:00:00.000Z',
        },
      },
      new Date('2026-07-06T12:00:00.000Z')
    );

    expect(data.progress.bodyWeight).toBe('81.7 kg');
    expect(data.progress.bodyWeightDelta).toBe('Add another measurement');
  });

  it('maps two body measurements and completed-session streak', () => {
    const data = createTodayDashboardData(
      {
        ...baseSnapshot,
        latestBodyMeasurement: {
          body_measurement_id: 'measurement-2',
          user_id_fk: 'local-user',
          weight: 81.7,
          bmi: null,
          body_fat_percentage: null,
          created_at: '2026-07-06T08:00:00.000Z',
        },
        previousBodyMeasurement: {
          body_measurement_id: 'measurement-1',
          user_id_fk: 'local-user',
          weight: 82.4,
          bmi: null,
          body_fat_percentage: null,
          created_at: '2026-07-01T08:00:00.000Z',
        },
        workoutStreak: 2,
        completedWorkoutCount: 2,
      },
      new Date('2026-07-06T12:00:00.000Z')
    );

    expect(data.progress.bodyWeight).toBe('81.7 kg');
    expect(data.progress.bodyWeightDelta).toBe('-0.7 kg vs previous');
    expect(data.progress.streak).toBe('2 days');
    expect(data.progress.streakProgress).toBeCloseTo(2 / 7);
  });

  it('exposes the newest active session as a resume action', () => {
    const data = createTodayDashboardData({
      ...baseSnapshot,
      activeSession: {
        workout_session_id: 'session-active',
        user_id_fk: 'local-user',
        routine_id_fk: 'routine-1',
        scheduled_for: null,
        started_at: '2026-07-06T13:00:00.000Z',
        completed_at: null,
        status: 'in_progress',
        created_at: '2026-07-06T13:00:00.000Z',
      },
    });

    expect(data.actionLabel).toBe('Resume Workout');
    expect(data.activeSessionId).toBe('session-active');
  });

  it('shows a planned rest day when no workout is assigned', () => {
    const data = createTodayDashboardData({ ...baseSnapshot, planEntry: null });
    expect(data.routine).toBeNull();
    expect(data.actionLabel).toBe('Start Workout');
    expect(data.tip).toContain('Recovery');
  });

  it('derives in-progress, completed, and unavailable states from linked data', () => {
    const linkedSession = {
      workout_session_id: 'session-linked',
      user_id_fk: 'local-user',
      routine_id_fk: 'routine-1',
      scheduled_for: '2026-07-06',
      started_at: '2026-07-06T13:00:00.000Z',
      completed_at: null,
      status: 'in_progress' as const,
      created_at: '2026-07-06T13:00:00.000Z',
    };
    const inProgress = createTodayDashboardData({
      ...baseSnapshot,
      activeSession: linkedSession,
      planEntry: { ...baseSnapshot.planEntry!, session: linkedSession },
    });
    const completed = createTodayDashboardData({
      ...baseSnapshot,
      planEntry: {
        ...baseSnapshot.planEntry!,
        session: {
          ...linkedSession,
          completed_at: '2026-07-06T14:00:00.000Z',
          status: 'completed',
        },
      },
    });
    const unavailable = createTodayDashboardData({
      ...baseSnapshot,
      planEntry: {
        ...baseSnapshot.planEntry!,
        routine: { ...routine, active: 0 },
      },
    });

    expect(inProgress.routine?.state).toBe('in_progress');
    expect(inProgress.actionLabel).toBe('Resume Workout');
    expect(completed.routine?.state).toBe('completed');
    expect(completed.actionLabel).toBe('Workout Complete');
    expect(unavailable.routine?.state).toBe('unavailable');
  });
});

import { router, type Href } from 'expo-router';
import { useCallback, useState } from 'react';

import { MOCK_USER, MOCK_WORKOUTS } from '@/constants/mock-data';
import {
  createTodayDashboardData,
  type TodayDashboardData,
} from '@/hooks/today-dashboard-view-model';
import type { DashboardSnapshot, RoutineDetail } from '@/db';

const mockNow = new Date(0).toISOString();
const mockRoutine: RoutineDetail = {
  routine_id: MOCK_WORKOUTS[0].id,
  user_id_fk: 'web-mock-user',
  name: MOCK_WORKOUTS[0].title,
  description: 'Hypertrophy - Chest, Shoulders, Triceps',
  active: 1,
  created_at: mockNow,
  updated_at: mockNow,
  exercises: MOCK_WORKOUTS[0].exercises.map((exercise, index) => ({
    routine_exercise_id: `web-routine-exercise-${exercise.id}`,
    routine_id_fk: MOCK_WORKOUTS[0].id,
    exercise_id_fk: exercise.id,
    order_index: index,
    created_at: mockNow,
    exercise: {
      exercise_id: exercise.id,
      name: exercise.name,
      description: null,
      image_url: null,
      video_url: null,
      active: 1,
      user_id_fk: 'web-mock-user',
      category_id_fk: null,
      created_at: mockNow,
      updated_at: mockNow,
    },
    targets: Array.from({ length: exercise.sets }, (_, targetIndex) => ({
      routine_exercise_target_id: `web-target-${exercise.id}-${targetIndex + 1}`,
      routine_exercise_id_fk: `web-routine-exercise-${exercise.id}`,
      set_number: targetIndex + 1,
      target_reps: null,
      target_weight: null,
      target_speed: null,
      target_duration_seconds: null,
      target_distance: null,
      rest_time_seconds: null,
      created_at: mockNow,
    })),
  })),
};

const mockSnapshot: DashboardSnapshot = {
  user: {
    user_id: 'web-mock-user',
    username: MOCK_USER.name,
    email: null,
    dob: null,
    height: null,
    height_unit: 'cm',
    weight_unit: 'kg',
    speed_unit: 'kmh',
    distance_unit: 'm',
    created_at: mockNow,
    updated_at: mockNow,
  },
  routine: mockRoutine,
  latestBodyMeasurement: {
    body_measurement_id: 'web-measurement-latest',
    user_id_fk: 'web-mock-user',
    weight: 78.4,
    bmi: null,
    body_fat_percentage: null,
    created_at: mockNow,
  },
  previousBodyMeasurement: {
    body_measurement_id: 'web-measurement-previous',
    user_id_fk: 'web-mock-user',
    weight: 78.2,
    bmi: null,
    body_fat_percentage: null,
    created_at: mockNow,
  },
  workoutStreak: 12,
  completedWorkoutCount: 12,
};

interface TodayDashboardState {
  data: TodayDashboardData;
  isLoading: boolean;
  isStarting: boolean;
  error: string | null;
}

export function useTodayDashboard(): TodayDashboardState & { startWorkout: () => Promise<void> } {
  const [isStarting, setIsStarting] = useState(false);

  const startWorkout = useCallback(async () => {
    setIsStarting(true);
    router.push({
      pathname: '/workout-session/[id]',
      params: { id: MOCK_WORKOUTS[0].id },
    } as unknown as Href);
    setIsStarting(false);
  }, []);

  return {
    data: createTodayDashboardData(mockSnapshot),
    isLoading: false,
    isStarting,
    error: null,
    startWorkout,
  };
}

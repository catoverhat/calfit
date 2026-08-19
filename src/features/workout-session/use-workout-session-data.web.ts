import { useMemo } from 'react';

import { MOCK_WORKOUTS } from '@/fixtures/mock-data';
import {
  mapMockWorkoutToViewModel,
  type WorkoutSessionViewModel,
} from './workout-session.viewmodel';

interface WorkoutSessionDataState {
  workout: WorkoutSessionViewModel | null;
  isLoading: boolean;
  error: string | null;
}

export function useWorkoutSessionData(sessionId?: string): WorkoutSessionDataState {
  const workout = useMemo(() => {
    const mockWorkout = MOCK_WORKOUTS.find((item) => item.id === sessionId);

    return mapMockWorkoutToViewModel(mockWorkout);
  }, [sessionId]);

  return {
    workout,
    isLoading: false,
    error: null,
  };
}

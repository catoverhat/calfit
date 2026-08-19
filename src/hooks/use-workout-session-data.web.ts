import { useMemo } from 'react';

import { MOCK_WORKOUTS } from '@/constants/mock-data';
import {
  mapMockWorkoutToViewModel,
  type WorkoutViewModel,
} from '@/hooks/today-dashboard-view-model';

interface WorkoutSessionDataState {
  workout: WorkoutViewModel | null;
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

import { useEffect, useState } from 'react';

import { MOCK_WORKOUTS } from '@/constants/mock-data';
import { getWorkoutSessionDetail, initializeLocalDatabase } from '@/db';
import {
  mapMockWorkoutToViewModel,
  mapWorkoutSessionToViewModel,
  type WorkoutViewModel,
} from '@/hooks/today-dashboard-view-model';

interface WorkoutSessionDataState {
  workout: WorkoutViewModel | null;
  isLoading: boolean;
  error: string | null;
}

export function useWorkoutSessionData(sessionId?: string): WorkoutSessionDataState {
  const [state, setState] = useState<WorkoutSessionDataState>({
    workout: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let mounted = true;

    async function load() {
      if (!sessionId) {
        setState({
          workout: mapMockWorkoutToViewModel(),
          isLoading: false,
          error: null,
        });
        return;
      }

      try {
        const db = await initializeLocalDatabase();
        const localSession = await getWorkoutSessionDetail(db, sessionId);
        const mockWorkout = MOCK_WORKOUTS.find((workout) => workout.id === sessionId);
        const workout = localSession
          ? mapWorkoutSessionToViewModel(localSession)
          : mapMockWorkoutToViewModel(mockWorkout);

        if (!mounted) {
          return;
        }

        setState({ workout, isLoading: false, error: null });
      } catch (error) {
        if (!mounted) {
          return;
        }

        setState({
          workout: mapMockWorkoutToViewModel(),
          isLoading: false,
          error: error instanceof Error ? error.message : 'Workout session could not be loaded.',
        });
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [sessionId]);

  return state;
}

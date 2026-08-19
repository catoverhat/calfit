import { router, type Href } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

import {
  createTodayDashboardData,
  type TodayDashboardData,
} from '@/hooks/today-dashboard-view-model';
import {
  getTodayRoutine,
  getTodayDashboardSnapshot,
  initializeLocalDatabase,
  seedStarterRoutineIfEmpty,
  startWorkoutFromRoutine,
} from '@/db';

interface TodayDashboardState {
  data: TodayDashboardData;
  isLoading: boolean;
  isStarting: boolean;
  error: string | null;
}

export function useTodayDashboard(): TodayDashboardState & { startWorkout: () => Promise<void> } {
  const [state, setState] = useState<TodayDashboardState>({
    data: createTodayDashboardData(null),
    isLoading: true,
    isStarting: false,
    error: null,
  });

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const db = await initializeLocalDatabase();
        const routine = (await getTodayRoutine(db)) ?? (await seedStarterRoutineIfEmpty(db));
        const snapshot = await getTodayDashboardSnapshot(db);

        if (!mounted) {
          return;
        }

        setState((current) => ({
          ...current,
          data: createTodayDashboardData({ ...snapshot, routine }),
          isLoading: false,
          error: null,
        }));
      } catch (error) {
        if (!mounted) {
          return;
        }

        setState((current) => ({
          ...current,
          data: createTodayDashboardData(null),
          isLoading: false,
          error: error instanceof Error ? error.message : 'Local database could not be loaded.',
        }));
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const startWorkout = useCallback(async () => {
    if (!state.data.routine || state.isStarting) {
      return;
    }

    setState((current) => ({ ...current, isStarting: true, error: null }));

    try {
      const db = await initializeLocalDatabase();
      const session = await startWorkoutFromRoutine(db, {
        routineId: state.data.routine.id,
      });

      router.push({
        pathname: '/workout-session/[id]',
        params: { id: session.workout_session_id },
      } as unknown as Href);
    } catch (error) {
      setState((current) => ({
        ...current,
        error: error instanceof Error ? error.message : 'Workout session could not be started.',
      }));
    } finally {
      setState((current) => ({ ...current, isStarting: false }));
    }
  }, [state.data.routine, state.isStarting]);

  return { ...state, startWorkout };
}

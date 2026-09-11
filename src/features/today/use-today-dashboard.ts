import { router, type Href, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import {
  getTodayDashboardSnapshot,
  initializeLocalDatabase,
  seedStarterRoutineIfEmpty,
  startOrResumeWorkoutFromRoutine,
} from '@/db';
import {
  createTodayDashboardData,
  type TodayDashboardData,
} from './today-dashboard.viewmodel';

interface TodayDashboardState {
  data: TodayDashboardData;
  error: string | null;
  isLoading: boolean;
  isStarting: boolean;
}

export function useTodayDashboard(): TodayDashboardState & { startWorkout: () => Promise<void> } {
  const [state, setState] = useState<TodayDashboardState>({
    data: createTodayDashboardData(null),
    error: null,
    isLoading: true,
    isStarting: false,
  });

  useFocusEffect(
    useCallback(() => {
      let active = true;
      async function load() {
        setState((current) => ({ ...current, error: null, isLoading: true }));
        try {
          const db = await initializeLocalDatabase();
          await seedStarterRoutineIfEmpty(db);
          const snapshot = await getTodayDashboardSnapshot(db);
          if (active) {
            setState({
              data: createTodayDashboardData(snapshot),
              error: null,
              isLoading: false,
              isStarting: false,
            });
          }
        } catch (error) {
          if (active) {
            setState((current) => ({
              ...current,
              error: error instanceof Error ? error.message : 'Local database could not be loaded.',
              isLoading: false,
            }));
          }
        }
      }
      void load();
      return () => {
        active = false;
      };
    }, [])
  );

  const startWorkout = useCallback(async () => {
    if (state.isStarting) return;
    if (state.data.activeSessionId) {
      router.push(workoutHref(state.data.activeSessionId));
      return;
    }
    if (!state.data.routine) return;

    setState((current) => ({ ...current, error: null, isStarting: true }));
    try {
      const db = await initializeLocalDatabase();
      const result = await startOrResumeWorkoutFromRoutine(db, {
        routineId: state.data.routine.id,
      });
      router.push(workoutHref(result.session.workout_session_id));
    } catch (error) {
      setState((current) => ({
        ...current,
        error: error instanceof Error ? error.message : 'Workout session could not be opened.',
        isStarting: false,
      }));
    }
  }, [state.data.activeSessionId, state.data.routine, state.isStarting]);

  return { ...state, startWorkout };
}

function workoutHref(id: string): Href {
  return { pathname: '/workout-session/[id]', params: { id } } as Href;
}

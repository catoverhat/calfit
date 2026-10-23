import { router, type Href, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import {
  getTodayDashboardSnapshot,
  initializeLocalDatabase,
  seedStarterRoutineIfEmpty,
  startOrResumeWorkoutFromPlanEntry,
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

export function useTodayDashboard(): TodayDashboardState & {
  openPlan: () => void;
  openWorkouts: () => void;
  startWorkout: () => Promise<void>;
} {
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
    if (!state.data.routine || state.data.routine.state === 'completed' || state.data.routine.state === 'unavailable') return;

    setState((current) => ({ ...current, error: null, isStarting: true }));
    try {
      const db = await initializeLocalDatabase();
      const result = await startOrResumeWorkoutFromPlanEntry(db, state.data.routine.planEntryId);
      router.push(workoutHref(result.session.workout_session_id));
    } catch (error) {
      setState((current) => ({
        ...current,
        error: error instanceof Error ? error.message : 'Workout session could not be opened.',
        isStarting: false,
      }));
    }
  }, [state.data.activeSessionId, state.data.routine, state.isStarting]);

  const openPlan = useCallback(() => {
    const now = new Date();
    const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')}`;
    router.push({ pathname: '/plan', params: { date } } as unknown as Href);
  }, []);
  const openWorkouts = useCallback(() => router.push('/workouts' as Href), []);

  return { ...state, openPlan, openWorkouts, startWorkout };
}

function workoutHref(id: string): Href {
  return { pathname: '/workout-session/[id]', params: { id } } as Href;
}

import { router, type Href, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import {
  getRoutineDetail,
  initializeLocalDatabase,
  startWorkoutFromRoutine,
  type RoutineDetail,
} from '@/db';

interface RoutineDetailState {
  error: string | null;
  isLoading: boolean;
  isStarting: boolean;
  routine: RoutineDetail | null;
}

export function useRoutineDetail(routineId?: string): RoutineDetailState & {
  reload: () => void;
  startWorkout: () => Promise<void>;
} {
  const [reloadKey, setReloadKey] = useState(0);
  const [state, setState] = useState<RoutineDetailState>({
    error: null,
    isLoading: true,
    isStarting: false,
    routine: null,
  });

  useFocusEffect(
    useCallback(() => {
      let active = true;
      async function load() {
        if (!routineId) {
          setState({ error: 'Routine id is missing.', isLoading: false, isStarting: false, routine: null });
          return;
        }
        setState((current) => ({
          ...current,
          error: null,
          isLoading: true,
          routine: reloadKey > 0 ? current.routine : null,
        }));
        try {
          const db = await initializeLocalDatabase();
          const routine = await getRoutineDetail(db, routineId);
          if (active) setState({ error: null, isLoading: false, isStarting: false, routine });
        } catch (error) {
          if (active) {
            setState({
              error: error instanceof Error ? error.message : 'Routine could not be loaded.',
              isLoading: false,
              isStarting: false,
              routine: null,
            });
          }
        }
      }
      load();
      return () => {
        active = false;
      };
    }, [reloadKey, routineId])
  );

  const startWorkout = useCallback(async () => {
    if (!state.routine || state.isStarting) return;
    setState((current) => ({ ...current, error: null, isStarting: true }));
    try {
      const db = await initializeLocalDatabase();
      const session = await startWorkoutFromRoutine(db, { routineId: state.routine.routine_id });
      router.push({
        pathname: '/workout-session/[id]',
        params: { id: session.workout_session_id },
      } as unknown as Href);
    } catch (error) {
      setState((current) => ({
        ...current,
        error: error instanceof Error ? error.message : 'Workout could not be started.',
        isStarting: false,
      }));
    }
  }, [state.isStarting, state.routine]);

  return { ...state, reload: () => setReloadKey((value) => value + 1), startWorkout };
}

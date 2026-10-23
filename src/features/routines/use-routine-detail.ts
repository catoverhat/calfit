import { router, type Href, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import {
  getInProgressWorkoutSession,
  getLocalUserProfile,
  getRoutineDetail,
  initializeLocalDatabase,
  startOrResumeWorkoutFromRoutine,
  normalizeDistanceUnit,
  normalizeSpeedUnit,
  normalizeWeightUnit,
  type DistanceUnit,
  type RoutineDetail,
  type SpeedUnit,
  type WeightUnit,
} from '@/db';

interface RoutineDetailState {
  activeSessionId: string | null;
  error: string | null;
  isLoading: boolean;
  isStarting: boolean;
  routine: RoutineDetail | null;
  units: { distanceUnit: DistanceUnit; speedUnit: SpeedUnit; weightUnit: WeightUnit };
}

export function useRoutineDetail(routineId?: string): RoutineDetailState & {
  reload: () => void;
  startWorkout: () => Promise<void>;
} {
  const [reloadKey, setReloadKey] = useState(0);
  const [state, setState] = useState<RoutineDetailState>({
    activeSessionId: null,
    error: null,
    isLoading: true,
    isStarting: false,
    routine: null,
    units: { distanceUnit: 'km', speedUnit: 'kmh', weightUnit: 'kg' },
  });

  useFocusEffect(
    useCallback(() => {
      let active = true;
      async function load() {
        if (!routineId) {
          setState((current) => ({ ...current, activeSessionId: null, error: 'Workout id is missing.', isLoading: false, isStarting: false, routine: null }));
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
          const [routine, activeSession, user] = await Promise.all([
            getRoutineDetail(db, routineId),
            getInProgressWorkoutSession(db),
            getLocalUserProfile(db),
          ]);
          if (active) setState({ activeSessionId: activeSession?.workout_session_id ?? null, error: null, isLoading: false, isStarting: false, routine, units: { distanceUnit: normalizeDistanceUnit(user.distance_unit), speedUnit: normalizeSpeedUnit(user.speed_unit), weightUnit: normalizeWeightUnit(user.weight_unit) } });
        } catch (error) {
          if (active) {
            setState({
              activeSessionId: null,
              error: error instanceof Error ? error.message : 'Workout could not be loaded.',
              isLoading: false,
              isStarting: false,
              routine: null,
              units: { distanceUnit: 'km', speedUnit: 'kmh', weightUnit: 'kg' },
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
      const result = await startOrResumeWorkoutFromRoutine(db, { routineId: state.routine.routine_id });
      router.push({
        pathname: '/workout-session/[id]',
        params: { id: result.session.workout_session_id },
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

import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import {
  getLocalUserProfile,
  getRoutineSummaries,
  initializeLocalDatabase,
  seedDemoRoutinesIfEmpty,
} from '@/db';
import { mapRoutineSummary, type RoutineSummaryViewModel } from './routine.viewmodel';

interface RoutineListState {
  error: string | null;
  isLoading: boolean;
  profileName: string;
  routines: RoutineSummaryViewModel[];
}

export function useRoutineList(): RoutineListState & { reload: () => void } {
  const [reloadKey, setReloadKey] = useState(0);
  const [state, setState] = useState<RoutineListState>({
    error: null,
    isLoading: true,
    profileName: 'Local Athlete',
    routines: [],
  });

  useFocusEffect(
    useCallback(() => {
      let active = true;
      async function load() {
        setState((current) => ({
          ...current,
          error: null,
          isLoading: true,
          routines: reloadKey > 0 ? current.routines : [],
        }));
        try {
          const db = await initializeLocalDatabase();
          await seedDemoRoutinesIfEmpty(db);
          const [user, routines] = await Promise.all([
            getLocalUserProfile(db),
            getRoutineSummaries(db),
          ]);
          if (active) {
            setState({
              error: null,
              isLoading: false,
              profileName: user?.username ?? 'Local Athlete',
              routines: routines.map(mapRoutineSummary),
            });
          }
        } catch (error) {
          if (active) {
            setState((current) => ({
              ...current,
              error: error instanceof Error ? error.message : 'Workouts could not be loaded.',
              isLoading: false,
            }));
          }
        }
      }
      load();
      return () => {
        active = false;
      };
    }, [reloadKey])
  );

  return { ...state, reload: () => setReloadKey((value) => value + 1) };
}

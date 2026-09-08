import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { getLocalUserProfile, getRecentBodyMeasurements, getWorkoutHistory, initializeLocalDatabase } from '@/db';
import { createProgressDashboardData, type ProgressDashboardData } from './progress.viewmodel';

type State = { data: ProgressDashboardData | null; error: string | null; isLoading: boolean };

export function useProgressDashboard(): State {
  const [state, setState] = useState<State>({ data: null, error: null, isLoading: true });

  useFocusEffect(
    useCallback(() => {
      let active = true;
      async function load() {
        setState((current) => ({ ...current, error: null, isLoading: true }));
        try {
          const db = await initializeLocalDatabase();
          const [user, measurements, history] = await Promise.all([
            getLocalUserProfile(db),
            getRecentBodyMeasurements(db, undefined, 30),
            getWorkoutHistory(db),
          ]);
          if (active) setState({ data: createProgressDashboardData({ history, measurements, user }), error: null, isLoading: false });
        } catch (error) {
          if (active) setState({ data: null, error: error instanceof Error ? error.message : 'Progress could not be loaded.', isLoading: false });
        }
      }
      load();
      return () => { active = false; };
    }, [])
  );

  return state;
}

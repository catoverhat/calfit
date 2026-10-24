import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';

import {
  getLocalUserProfile,
  getRecentBodyMeasurements,
  getWorkoutHistory,
  initializeLocalDatabase,
  type BodyMeasurementRow,
  type UserRow,
  type WorkoutHistoryItem,
} from '@/db';
import { createProgressDashboardData, type ProgressPeriod } from './progress.viewmodel';

type Snapshot = { history: WorkoutHistoryItem[]; measurements: BodyMeasurementRow[]; user: UserRow };
type State = { snapshot: Snapshot | null; error: string | null; isLoading: boolean };

export function useProgressDashboard() {
  const [state, setState] = useState<State>({ snapshot: null, error: null, isLoading: true });
  const [period, setPeriod] = useState<ProgressPeriod>(7);
  const loadVersion = useRef(0);

  const reload = useCallback(async () => {
    const version = ++loadVersion.current;
    setState((current) => ({ ...current, error: null, isLoading: current.snapshot === null }));
    try {
      const db = await initializeLocalDatabase();
      const [user, measurements, history] = await Promise.all([
        getLocalUserProfile(db),
        getRecentBodyMeasurements(db, undefined, 30),
        getWorkoutHistory(db),
      ]);
      if (version === loadVersion.current) {
        setState({ snapshot: { history, measurements, user }, error: null, isLoading: false });
      }
    } catch (error) {
      if (version === loadVersion.current) {
        setState((current) => ({ ...current, error: error instanceof Error ? error.message : 'Progress could not be loaded.', isLoading: false }));
      }
    }
  }, []);

  useFocusEffect(useCallback(() => {
    void reload();
    return () => { loadVersion.current += 1; };
  }, [reload]));

  const data = useMemo(
    () => state.snapshot ? createProgressDashboardData({ ...state.snapshot, period }) : null,
    [state.snapshot, period]
  );

  return { data, error: state.error, isLoading: state.isLoading, period, setPeriod, reload };
}

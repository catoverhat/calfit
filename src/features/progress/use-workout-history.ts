import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { getLocalUserProfile, getWorkoutHistory, initializeLocalDatabase, type WorkoutHistoryItem } from '@/db';

type State = { error: string | null; history: WorkoutHistoryItem[]; isLoading: boolean; profileName: string; weightUnit: string };

export function useWorkoutHistory(): State {
  const [state, setState] = useState<State>({ error: null, history: [], isLoading: true, profileName: 'Local Athlete', weightUnit: 'kg' });
  useFocusEffect(useCallback(() => {
    let active = true;
    async function load() {
      setState((current) => ({ ...current, error: null, isLoading: true }));
      try {
        const db = await initializeLocalDatabase();
        const [user, history] = await Promise.all([getLocalUserProfile(db), getWorkoutHistory(db)]);
        if (active) setState({ error: null, history, isLoading: false, profileName: user.username, weightUnit: user.weight_unit });
      } catch (error) {
        if (active) setState((current) => ({ ...current, error: error instanceof Error ? error.message : 'Workout history could not be loaded.', isLoading: false }));
      }
    }
    load();
    return () => { active = false; };
  }, []));
  return state;
}

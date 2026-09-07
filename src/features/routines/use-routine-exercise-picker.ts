import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import {
  getExerciseCatalog,
  getExerciseCategories,
  initializeLocalDatabase,
  seedBuiltInExercisesIfEmpty,
  type ExerciseCatalogRow,
} from '@/db';

interface ExercisePickerState {
  categories: string[];
  error: string | null;
  exercises: ExerciseCatalogRow[];
  isLoading: boolean;
}

export function useRoutineExercisePicker(): ExercisePickerState & { reload: () => void } {
  const [reloadKey, setReloadKey] = useState(0);
  const [state, setState] = useState<ExercisePickerState>({
    categories: ['All Categories'],
    error: null,
    exercises: [],
    isLoading: true,
  });
  useFocusEffect(
    useCallback(() => {
      let active = true;
      async function load() {
        setState((current) => ({
          ...current,
          error: null,
          exercises: reloadKey > 0 ? current.exercises : [],
          isLoading: true,
        }));
        try {
          const db = await initializeLocalDatabase();
          await seedBuiltInExercisesIfEmpty(db);
          const [categories, exercises] = await Promise.all([
            getExerciseCategories(db),
            getExerciseCatalog(db),
          ]);
          if (active) {
            setState({
              categories: ['All Categories', ...categories.map((category) => category.name)],
              error: null,
              exercises,
              isLoading: false,
            });
          }
        } catch (error) {
          if (active) {
            setState((current) => ({
              ...current,
              error: error instanceof Error ? error.message : 'Exercises could not be loaded.',
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

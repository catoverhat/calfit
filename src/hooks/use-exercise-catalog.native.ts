import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import {
  getExerciseCatalog,
  getExerciseCategories,
  getLocalUserProfile,
  initializeLocalDatabase,
  seedBuiltInExercisesIfEmpty,
} from '@/db';
import {
  createEmptyExerciseCatalogData,
  createExerciseCatalogData,
  type ExerciseCatalogData,
} from '@/hooks/exercise-catalog-view-model';

interface ExerciseCatalogState {
  data: ExerciseCatalogData;
  error: string | null;
  isLoading: boolean;
}

export function useExerciseCatalog(): ExerciseCatalogState {
  const [state, setState] = useState<ExerciseCatalogState>({
    data: createEmptyExerciseCatalogData(),
    error: null,
    isLoading: true,
  });

  useFocusEffect(
    useCallback(() => {
      let active = true;

      async function load() {
        setState((current) => ({ ...current, isLoading: true, error: null }));

        try {
          const db = await initializeLocalDatabase();
          await seedBuiltInExercisesIfEmpty(db);

          const [user, categories, exercises] = await Promise.all([
            getLocalUserProfile(db),
            getExerciseCategories(db),
            getExerciseCatalog(db),
          ]);

          if (!active) {
            return;
          }

          setState({
            data: createExerciseCatalogData({ categories, exercises, user }),
            error: null,
            isLoading: false,
          });
        } catch (error) {
          if (!active) {
            return;
          }

          setState((current) => ({
            ...current,
            error: error instanceof Error ? error.message : 'Exercise catalog could not be loaded.',
            isLoading: false,
          }));
        }
      }

      load();

      return () => {
        active = false;
      };
    }, [])
  );

  return state;
}

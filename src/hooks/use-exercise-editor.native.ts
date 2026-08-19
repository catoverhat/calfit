import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

import {
  createExercise,
  getExerciseCategories,
  getExerciseDetail,
  getLocalUserProfile,
  initializeLocalDatabase,
  seedBuiltInExercisesIfEmpty,
  updateExercise,
} from '@/db';
import {
  createEmptyExerciseEditorData,
  createExerciseEditorData,
  type ExerciseEditorData,
  type ExerciseEditorSaveInput,
} from '@/hooks/exercise-catalog-view-model';

interface UseExerciseEditorInput {
  exerciseId?: string;
  mode: 'create' | 'edit';
}

interface ExerciseEditorState {
  data: ExerciseEditorData;
  error: string | null;
  isLoading: boolean;
  isSaving: boolean;
}

export function useExerciseEditor({
  exerciseId,
  mode,
}: UseExerciseEditorInput): ExerciseEditorState & {
  saveExercise: (input: ExerciseEditorSaveInput) => Promise<void>;
} {
  const [state, setState] = useState<ExerciseEditorState>({
    data: createEmptyExerciseEditorData(mode),
    error: null,
    isLoading: true,
    isSaving: false,
  });

  useEffect(() => {
    let mounted = true;

    async function load() {
      setState((current) => ({ ...current, isLoading: true, error: null }));

      try {
        const db = await initializeLocalDatabase();
        await seedBuiltInExercisesIfEmpty(db);

        const [user, categories, exercise] = await Promise.all([
          getLocalUserProfile(db),
          getExerciseCategories(db),
          mode === 'edit' && exerciseId ? getExerciseDetail(db, exerciseId) : Promise.resolve(null),
        ]);

        if (mode === 'edit' && !exercise) {
          throw new Error('Exercise could not be found.');
        }

        if (!mounted) {
          return;
        }

        setState({
          data: createExerciseEditorData({ categories, exercise, mode, user }),
          error: null,
          isLoading: false,
          isSaving: false,
        });
      } catch (error) {
        if (!mounted) {
          return;
        }

        setState((current) => ({
          ...current,
          error: error instanceof Error ? error.message : 'Exercise editor could not be loaded.',
          isLoading: false,
          isSaving: false,
        }));
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [exerciseId, mode]);

  const saveExercise = useCallback(
    async (input: ExerciseEditorSaveInput) => {
      const name = input.name.trim();

      if (!name) {
        setState((current) => ({ ...current, error: 'Exercise name is required.' }));
        return;
      }

      if (!input.categoryId) {
        setState((current) => ({ ...current, error: 'Choose a category before saving.' }));
        return;
      }

      if (mode === 'edit' && !exerciseId) {
        setState((current) => ({ ...current, error: 'Exercise id is missing.' }));
        return;
      }

      setState((current) => ({ ...current, error: null, isSaving: true }));

      try {
        const db = await initializeLocalDatabase();
        const description = input.description.trim() || null;

        if (mode === 'edit') {
          await updateExercise(db, {
            exerciseId: exerciseId as string,
            name,
            description,
            imageUrl: input.imageUrl ?? null,
            videoUrl: input.videoUrl ?? null,
            active: input.active,
            categoryId: input.categoryId,
          });
        } else {
          await createExercise(db, {
            name,
            description,
            imageUrl: input.imageUrl ?? null,
            videoUrl: input.videoUrl ?? null,
            active: input.active,
            categoryId: input.categoryId,
          });
        }

        router.replace('/exercises');
      } catch (error) {
        setState((current) => ({
          ...current,
          error: error instanceof Error ? error.message : 'Exercise could not be saved.',
          isSaving: false,
        }));
      }
    },
    [exerciseId, mode]
  );

  return { ...state, saveExercise };
}

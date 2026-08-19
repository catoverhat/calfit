import { router } from 'expo-router';
import { useMemo } from 'react';

import { EXERCISE_CATALOG } from '@/db/seed-data/exercise-catalog';
import type {
  ExerciseEditorData,
  ExerciseEditorSaveInput,
} from '@/features/exercises/exercise-catalog.viewmodel';

interface UseExerciseEditorInput {
  exerciseId?: string;
  mode: 'create' | 'edit';
}

const WEB_CATEGORIES = [
  { id: 'cat-chest', label: 'Chest', muscleGroup: 'Chest' },
  { id: 'cat-back', label: 'Back', muscleGroup: 'Back' },
  { id: 'cat-legs', label: 'Legs', muscleGroup: 'Legs' },
  { id: 'cat-shoulders', label: 'Shoulders', muscleGroup: 'Shoulders' },
];

export function useExerciseEditor({
  exerciseId,
  mode,
}: UseExerciseEditorInput): {
  data: ExerciseEditorData;
  error: string | null;
  isLoading: boolean;
  isSaving: boolean;
  saveExercise: (input: ExerciseEditorSaveInput) => Promise<void>;
} {
  const data = useMemo<ExerciseEditorData>(() => {
    const sourceExercise = EXERCISE_CATALOG.find((exercise) => exercise.id === exerciseId);
    const category = WEB_CATEGORIES.find((item) => item.muscleGroup === sourceExercise?.muscleGroup) ?? WEB_CATEGORIES[0];

    return {
      categories: WEB_CATEGORIES,
      initialValues: {
        active: true,
        categoryId: category.id,
        description:
          mode === 'edit' && sourceExercise
            ? `Refine ${sourceExercise.name.toLowerCase()} mechanics with controlled tempo, stable positioning, and clean range of motion.`
            : '',
        imageUrl:
          sourceExercise?.imageUrl ??
          'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?auto=format&fit=crop&w=1200&q=85',
        muscleGroup: category.muscleGroup,
        name: mode === 'edit' ? sourceExercise?.name ?? 'Dumbbell Incline Bench Press' : '',
        videoUrl: null,
      },
      profileName: 'Dan',
    };
  }, [exerciseId, mode]);

  return {
    data,
    error: null,
    isLoading: false,
    isSaving: false,
    saveExercise: async () => {
      router.replace('/exercises');
    },
  };
}

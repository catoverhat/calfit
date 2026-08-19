import { EXERCISE_CATALOG } from '@/db/seed-data/exercise-catalog';
import { MOCK_USER } from '@/fixtures/mock-data';
import type { ExerciseCatalogData } from '@/features/exercises/exercise-catalog.viewmodel';

const WEB_FILTERS = ['All Categories', 'Strength', 'Cardio', 'Mobility'];

export function useExerciseCatalog(): {
  data: ExerciseCatalogData;
  error: string | null;
  isLoading: boolean;
} {
  return {
    data: {
      avatarUrl: MOCK_USER.avatarUrl,
      filters: WEB_FILTERS,
      items: EXERCISE_CATALOG.filter((exercise) =>
        ['bench-press', 'squat', 'pull-ups', 'running'].includes(exercise.id)
      ).map((exercise) => ({
        id: exercise.id,
        name: exercise.name,
        description: `${exercise.muscleGroup} movement`,
        imageUrl: exercise.imageUrl,
        category: exercise.catalogCategory,
        muscleGroup: exercise.muscleGroup,
        tags: [...exercise.tags],
        sourceLabel: 'Built-in',
      })),
      profileName: MOCK_USER.name,
    },
    error: null,
    isLoading: false,
  };
}

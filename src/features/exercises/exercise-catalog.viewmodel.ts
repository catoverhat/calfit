import type { CategoryRow, ExerciseCatalogRow, ExerciseDetail, UserRow } from '@/db';

export interface ExerciseCatalogViewItem {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  category: string;
  muscleGroup: string;
  tags: string[];
  sourceLabel: 'Built-in' | 'Custom';
}

export interface ExerciseCatalogData {
  avatarUrl: string | null;
  filters: string[];
  items: ExerciseCatalogViewItem[];
  profileName: string;
}

export interface ExerciseEditorCategoryOption {
  id: string;
  label: string;
  muscleGroup: string;
}

export interface ExerciseEditorValues {
  active: boolean;
  categoryId: string | null;
  description: string;
  imageUrl: string | null;
  muscleGroup: string;
  name: string;
  videoUrl: string | null;
}

export interface ExerciseEditorData {
  categories: ExerciseEditorCategoryOption[];
  initialValues: ExerciseEditorValues;
  profileName: string;
}

export interface ExerciseEditorSaveInput {
  active: boolean;
  categoryId: string | null;
  description: string;
  imageUrl?: string | null;
  name: string;
  videoUrl?: string | null;
}

const ALL_CATEGORIES_FILTER = 'All Categories';

export function createExerciseCatalogData(input: {
  categories: CategoryRow[];
  exercises: ExerciseCatalogRow[];
  user: UserRow | null;
}): ExerciseCatalogData {
  return {
    avatarUrl: null,
    filters: [ALL_CATEGORIES_FILTER, ...input.categories.map((category) => category.name)],
    items: input.exercises.map(mapExerciseCatalogRowToItem),
    profileName: input.user?.username ?? 'Local Athlete',
  };
}

export function createEmptyExerciseCatalogData(): ExerciseCatalogData {
  return {
    avatarUrl: null,
    filters: [ALL_CATEGORIES_FILTER],
    items: [],
    profileName: 'Local Athlete',
  };
}

export function filterExerciseCatalogItems(
  items: ExerciseCatalogViewItem[],
  selectedFilter: string,
  query: string
): ExerciseCatalogViewItem[] {
  const normalizedQuery = query.trim().toLowerCase();

  return items.filter((exercise) => {
    const matchesFilter =
      selectedFilter === ALL_CATEGORIES_FILTER || exercise.category === selectedFilter;
    const searchableText = [
      exercise.name,
      exercise.description,
      exercise.category,
      exercise.muscleGroup,
      exercise.sourceLabel,
      ...exercise.tags,
    ]
      .join(' ')
      .toLowerCase();
    const matchesQuery = normalizedQuery.length === 0 || searchableText.includes(normalizedQuery);

    return matchesFilter && matchesQuery;
  });
}

export function createExerciseEditorData(input: {
  categories: CategoryRow[];
  exercise: ExerciseDetail | null;
  mode: 'create' | 'edit';
  user: UserRow | null;
}): ExerciseEditorData {
  const categoryOptions = input.categories.map(mapCategoryToOption);
  const firstCategory = categoryOptions[0] ?? null;
  const exerciseCategory = categoryOptions.find(
    (category) => category.id === input.exercise?.category_id_fk
  );
  const selectedCategory = exerciseCategory ?? firstCategory;

  return {
    categories: categoryOptions,
    initialValues: {
      active: input.exercise ? input.exercise.active === 1 : true,
      categoryId: selectedCategory?.id ?? null,
      description: input.exercise?.description ?? '',
      imageUrl: input.exercise?.image_url ?? null,
      muscleGroup: selectedCategory?.muscleGroup ?? 'Uncategorized',
      name: input.mode === 'edit' ? input.exercise?.name ?? '' : '',
      videoUrl: input.exercise?.video_url ?? null,
    },
    profileName: input.user?.username ?? 'Local Athlete',
  };
}

export function createEmptyExerciseEditorData(mode: 'create' | 'edit'): ExerciseEditorData {
  return createExerciseEditorData({
    categories: [],
    exercise: null,
    mode,
    user: null,
  });
}

export function mapExerciseCatalogRowToItem(row: ExerciseCatalogRow): ExerciseCatalogViewItem {
  const category = row.category_name ?? 'Uncategorized';
  const muscleGroup = row.category_muscle_group ?? category;
  const sourceLabel = row.user_id_fk ? 'Custom' : 'Built-in';
  const tags = Array.from(new Set([category, muscleGroup, sourceLabel]));

  return {
    id: row.exercise_id,
    name: row.name,
    description: row.description ?? `${muscleGroup} movement`,
    imageUrl: row.image_url,
    category,
    muscleGroup,
    tags,
    sourceLabel,
  };
}

function mapCategoryToOption(category: CategoryRow): ExerciseEditorCategoryOption {
  return {
    id: category.category_id,
    label: category.name,
    muscleGroup: category.muscle_group,
  };
}

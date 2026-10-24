/// <reference types="jest" />

import {
  createEmptyExerciseCatalogData,
  createExerciseCatalogData,
  createExerciseEditorData,
  filterExerciseCatalogItems,
} from '@/features/exercises/exercise-catalog.viewmodel';
import type { CategoryRow, ExerciseCatalogRow, UserRow } from '@/db';

const user: UserRow = {
  theme_preference: 'system',
  user_id: 'local-user',
  username: 'Local Athlete',
  email: null,
  dob: null,
  height: null,
  height_unit: 'cm',
  weight_unit: 'kg',
  speed_unit: 'kmh',
  distance_unit: 'km',
  created_at: '2026-07-06T12:00:00.000Z',
  updated_at: '2026-07-06T12:00:00.000Z',
};

const categories: CategoryRow[] = [
  { category_id: 'cat-chest', name: 'Chest', muscle_group: 'Chest' },
  { category_id: 'cat-back', name: 'Back', muscle_group: 'Back' },
];

const exercises: ExerciseCatalogRow[] = [
  {
    exercise_id: 'bench-press',
    name: 'Bench Press',
    description: null,
    image_url: 'https://example.com/bench.jpg',
    video_url: null,
    active: 1,
    user_id_fk: null,
    category_id_fk: 'cat-chest',
    category_name: 'Chest',
    category_muscle_group: 'Chest',
    created_at: '2026-07-06T12:00:00.000Z',
    updated_at: '2026-07-06T12:00:00.000Z',
  },
  {
    exercise_id: 'local-row',
    name: 'Chest Supported Row',
    description: 'Stable upper-back row.',
    image_url: null,
    video_url: null,
    active: 1,
    user_id_fk: 'local-user',
    category_id_fk: 'cat-back',
    category_name: 'Back',
    category_muscle_group: 'Back',
    created_at: '2026-07-06T12:00:00.000Z',
    updated_at: '2026-07-06T12:00:00.000Z',
  },
];

describe('exercise catalog view models', () => {
  it('maps DB rows into catalog cards with source tags', () => {
    const data = createExerciseCatalogData({ categories, exercises, user });

    expect(data.profileName).toBe('Local Athlete');
    expect(data.filters).toEqual(['All Categories', 'Chest', 'Back']);
    expect(data.items).toEqual([
      expect.objectContaining({
        id: 'bench-press',
        category: 'Chest',
        description: 'Chest movement',
        sourceLabel: 'Built-in',
        tags: ['Chest', 'Built-in'],
      }),
      expect.objectContaining({
        id: 'local-row',
        category: 'Back',
        description: 'Stable upper-back row.',
        sourceLabel: 'Custom',
        tags: ['Back', 'Custom'],
      }),
    ]);
  });

  it('supports truthful empty state data', () => {
    expect(createEmptyExerciseCatalogData()).toEqual({
      avatarUrl: null,
      filters: ['All Categories'],
      items: [],
      profileName: 'Local Athlete',
    });
  });

  it('creates a blank active editor using the first persisted category', () => {
    const data = createExerciseEditorData({ categories, exercise: null, mode: 'create', user });

    expect(data).toEqual({
      categories: [
        { id: 'cat-chest', label: 'Chest', muscleGroup: 'Chest' },
        { id: 'cat-back', label: 'Back', muscleGroup: 'Back' },
      ],
      initialValues: {
        active: true,
        categoryId: 'cat-chest',
        description: '',
        imageUrl: null,
        muscleGroup: 'Chest',
        name: '',
        videoUrl: null,
      },
      profileName: 'Local Athlete',
    });
  });

  it('hydrates every persisted editor value for built-in and custom exercises', () => {
    const exercise = {
      ...exercises[0],
      active: 0,
      description: 'Keep the bar path controlled.',
      image_url: 'https://example.com/bench-edit.jpg',
      video_url: 'https://example.com/bench-edit.mp4',
    };

    const data = createExerciseEditorData({ categories, exercise, mode: 'edit', user });

    expect(data.initialValues).toEqual({
      active: false,
      categoryId: 'cat-chest',
      description: 'Keep the bar path controlled.',
      imageUrl: 'https://example.com/bench-edit.jpg',
      muscleGroup: 'Chest',
      name: 'Bench Press',
      videoUrl: 'https://example.com/bench-edit.mp4',
    });
  });

  it('filters by category and searches name, description, and source label', () => {
    const data = createExerciseCatalogData({ categories, exercises, user });

    expect(filterExerciseCatalogItems(data.items, 'Back', '')).toEqual([
      expect.objectContaining({ id: 'local-row' }),
    ]);
    expect(filterExerciseCatalogItems(data.items, 'All Categories', 'upper-back')).toEqual([
      expect.objectContaining({ id: 'local-row' }),
    ]);
    expect(filterExerciseCatalogItems(data.items, 'All Categories', 'built-in')).toEqual([
      expect.objectContaining({ id: 'bench-press' }),
    ]);
  });
});

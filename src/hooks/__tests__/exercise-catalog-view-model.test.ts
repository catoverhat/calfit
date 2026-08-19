/// <reference types="jest" />

import {
  createEmptyExerciseCatalogData,
  createExerciseCatalogData,
  filterExerciseCatalogItems,
} from '@/hooks/exercise-catalog-view-model';
import type { CategoryRow, ExerciseCatalogRow, UserRow } from '@/db';

const user: UserRow = {
  user_id: 'local-user',
  username: 'Local Athlete',
  email: null,
  dob: null,
  height: null,
  height_unit: 'cm',
  weight_unit: 'kg',
  speed_unit: 'kmh',
  distance_unit: 'm',
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

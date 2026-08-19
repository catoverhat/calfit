/// <reference types="jest" />

import {
  createExercise,
  getExerciseCatalog,
  getExerciseCategories,
  getExerciseDetail,
  initializeLocalDatabase,
  LOCAL_USER_ID,
  seedBuiltInExercisesIfEmpty,
  updateExercise,
} from '@/db';
import { MemoryDb } from '../testing/memory-database';

describe('exercise repository', () => {
  it('seeds built-in exercises once and loads catalog rows with categories', async () => {
    const db = new MemoryDb();

    await initializeLocalDatabase(db);
    await seedBuiltInExercisesIfEmpty(db);
    await seedBuiltInExercisesIfEmpty(db);

    const categories = await getExerciseCategories(db);
    const catalog = await getExerciseCatalog(db);

    expect(db.tables.get('exercises')).toHaveLength(7);
    expect(categories.map((category) => category.name)).toEqual([
      'Arms',
      'Back',
      'Chest',
      'Core',
      'Legs',
      'Shoulders',
    ]);
    expect(catalog).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          exercise_id: 'bench-press',
          name: 'Bench Press',
          user_id_fk: null,
          category_name: 'Chest',
          category_muscle_group: 'Chest',
        }),
        expect.objectContaining({
          exercise_id: 'running',
          name: 'Running',
          category_name: 'Legs',
        }),
      ])
    );
  });

  it('creates, updates, filters, and loads exercise detail from local rows', async () => {
    const db = new MemoryDb();

    await initializeLocalDatabase(db);
    await seedBuiltInExercisesIfEmpty(db);

    const inactiveExercise = await createExercise(db, {
      id: 'local-inactive-curl',
      name: 'Cable Curl',
      active: false,
      categoryId: 'cat-arms',
      description: 'Elbow flexion accessory.',
      now: '2026-07-06T12:00:00.000Z',
    });
    const activeExercise = await createExercise(db, {
      id: 'local-row',
      name: 'Chest Supported Row',
      categoryId: 'cat-back',
      description: 'Stable upper-back row.',
      now: '2026-07-06T12:00:00.000Z',
    });

    let catalog = await getExerciseCatalog(db);
    const inactiveDetail = await getExerciseDetail(db, inactiveExercise.exercise_id);

    expect(catalog.some((exercise) => exercise.exercise_id === inactiveExercise.exercise_id)).toBe(false);
    expect(inactiveDetail).toEqual(
      expect.objectContaining({
        exercise_id: 'local-inactive-curl',
        active: 0,
        category_name: 'Arms',
      })
    );
    expect(catalog).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          exercise_id: activeExercise.exercise_id,
          user_id_fk: LOCAL_USER_ID,
          category_name: 'Back',
        }),
      ])
    );

    await updateExercise(db, {
      exerciseId: inactiveExercise.exercise_id,
      name: 'Cable Curl Updated',
      description: 'Updated cue.',
      active: true,
      categoryId: 'cat-arms',
      imageUrl: 'https://example.com/curl.jpg',
      now: '2026-07-07T12:00:00.000Z',
    });

    catalog = await getExerciseCatalog(db);
    const updatedDetail = await getExerciseDetail(db, inactiveExercise.exercise_id);

    expect(updatedDetail).toEqual(
      expect.objectContaining({
        name: 'Cable Curl Updated',
        description: 'Updated cue.',
        image_url: 'https://example.com/curl.jpg',
        active: 1,
        updated_at: '2026-07-07T12:00:00.000Z',
      })
    );
    expect(catalog.some((exercise) => exercise.exercise_id === inactiveExercise.exercise_id)).toBe(true);
  });

});

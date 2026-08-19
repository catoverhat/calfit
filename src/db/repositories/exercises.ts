import { createLocalId } from '../id';
import { EXERCISE_CATALOG } from '../seed-data/exercise-catalog';
import { LOCAL_USER_ID, STARTER_CATEGORIES } from '../schema';
import type { CategoryRow, ExerciseRow, LocalDatabase } from '../types';

export interface CreateExerciseInput {
  id?: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  videoUrl?: string | null;
  active?: boolean;
  userId?: string | null;
  categoryId?: string | null;
  now?: string;
}

export interface ExerciseCatalogRow extends ExerciseRow {
  category_name: string | null;
  category_muscle_group: string | null;
}

export type ExerciseDetail = ExerciseCatalogRow;


export interface UpdateExerciseInput {
  exerciseId: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  videoUrl?: string | null;
  active?: boolean;
  categoryId?: string | null;
  now?: string;
}


export async function createExercise(db: LocalDatabase, input: CreateExerciseInput): Promise<ExerciseRow> {
  const now = input.now ?? new Date().toISOString();
  const exercise: ExerciseRow = {
    exercise_id: input.id ?? createLocalId('exercise'),
    name: input.name,
    description: input.description ?? null,
    image_url: input.imageUrl ?? null,
    video_url: input.videoUrl ?? null,
    active: input.active === false ? 0 : 1,
    user_id_fk: input.userId === undefined ? LOCAL_USER_ID : input.userId,
    category_id_fk: input.categoryId ?? null,
    created_at: now,
    updated_at: now,
  };

  await db.runAsync(
    `INSERT INTO exercises (
      exercise_id,
      name,
      description,
      image_url,
      video_url,
      active,
      user_id_fk,
      category_id_fk,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    exercise.exercise_id,
    exercise.name,
    exercise.description,
    exercise.image_url,
    exercise.video_url,
    exercise.active,
    exercise.user_id_fk,
    exercise.category_id_fk,
    exercise.created_at,
    exercise.updated_at
  );

  return exercise;
}

export async function seedBuiltInExercisesIfEmpty(db: LocalDatabase): Promise<void> {
  const now = new Date().toISOString();

  for (const exercise of EXERCISE_CATALOG) {
    await db.runAsync(
      `INSERT OR IGNORE INTO exercises (
        exercise_id,
        name,
        description,
        image_url,
        video_url,
        active,
        user_id_fk,
        category_id_fk,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      exercise.id,
      exercise.name,
      null,
      exercise.imageUrl,
      null,
      1,
      null,
      getBuiltInCategoryId(exercise.muscleGroup),
      now,
      now
    );
  }
}

export async function getExerciseCategories(db: LocalDatabase): Promise<CategoryRow[]> {
  return db.getAllAsync<CategoryRow>('SELECT * FROM categories ORDER BY name ASC');
}

export async function getExerciseCatalog(
  db: LocalDatabase,
  userId = LOCAL_USER_ID
): Promise<ExerciseCatalogRow[]> {
  return db.getAllAsync<ExerciseCatalogRow>(
    `SELECT
      exercises.*,
      categories.name AS category_name,
      categories.muscle_group AS category_muscle_group
    FROM exercises
    LEFT JOIN categories ON categories.category_id = exercises.category_id_fk
    WHERE exercises.active = 1
      AND (exercises.user_id_fk IS NULL OR exercises.user_id_fk = ?)
    ORDER BY categories.name ASC, exercises.name ASC`,
    userId
  );
}

export async function getExerciseDetail(
  db: LocalDatabase,
  exerciseId: string
): Promise<ExerciseDetail | null> {
  return db.getFirstAsync<ExerciseDetail>(
    `SELECT
      exercises.*,
      categories.name AS category_name,
      categories.muscle_group AS category_muscle_group
    FROM exercises
    LEFT JOIN categories ON categories.category_id = exercises.category_id_fk
    WHERE exercises.exercise_id = ?`,
    exerciseId
  );
}

export async function updateExercise(db: LocalDatabase, input: UpdateExerciseInput): Promise<void> {
  await db.runAsync(
    `UPDATE exercises
    SET name = ?,
      description = ?,
      image_url = ?,
      video_url = ?,
      active = ?,
      category_id_fk = ?,
      updated_at = ?
    WHERE exercise_id = ?`,
    input.name,
    input.description ?? null,
    input.imageUrl ?? null,
    input.videoUrl ?? null,
    input.active === false ? 0 : 1,
    input.categoryId ?? null,
    input.now ?? new Date().toISOString(),
    input.exerciseId
  );
}


function getBuiltInCategoryId(muscleGroup: string): string | null {
  return (
    STARTER_CATEGORIES.find(
      (category) => category.name === muscleGroup || category.muscle_group === muscleGroup
    )?.category_id ?? null
  );
}


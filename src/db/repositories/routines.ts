import { createLocalId } from '../id';
import { LOCAL_USER_ID } from '../schema';
import type {
  ExerciseRow,
  LocalDatabase,
  RoutineDetail,
  RoutineExerciseRow,
  RoutineExerciseTargetRow,
  RoutineExerciseWithTargets,
  RoutineRow,
} from '../types';

export interface CreateRoutineTargetInput {
  id?: string;
  setNumber?: number;
  targetReps?: number | null;
  targetWeight?: number | null;
  targetSpeed?: number | null;
  targetDurationSeconds?: number | null;
  targetDistance?: number | null;
  restTimeSeconds?: number | null;
}

export interface CreateRoutineExerciseInput {
  id?: string;
  exerciseId: string;
  targets: CreateRoutineTargetInput[];
}

export interface CreateRoutineInput {
  id?: string;
  userId?: string;
  name: string;
  description?: string | null;
  active?: boolean;
  exercises: CreateRoutineExerciseInput[];
  now?: string;
}


export interface UpdateRoutineInput {
  routineId: string;
  name: string;
  description?: string | null;
  active?: boolean;
  now?: string;
}


export interface UpdateRoutineTargetInput {
  routineExerciseTargetId: string;
  targetReps?: number | null;
  targetWeight?: number | null;
  targetSpeed?: number | null;
  targetDurationSeconds?: number | null;
  targetDistance?: number | null;
  restTimeSeconds?: number | null;
}


interface RoutineExerciseQueryRow extends RoutineExerciseRow {
  exercise_id: string;
  exercise_name: string;
  exercise_description: string | null;
  exercise_image_url: string | null;
  exercise_video_url: string | null;
  exercise_active: number;
  exercise_user_id: string | null;
  exercise_category_id: string | null;
  exercise_created_at: string;
  exercise_updated_at: string;
}


const STARTER_ROUTINE_ID = 'starter-routine-push-day';
const STARTER_EXERCISES = [
  {
    exercise_id: 'starter-exercise-bench-press',
    name: 'Bench Press',
    description: 'Horizontal press for chest, shoulders, and triceps.',
    category_id_fk: 'cat-chest',
  },
  {
    exercise_id: 'starter-exercise-shoulder-press',
    name: 'Shoulder Press',
    description: 'Vertical press for shoulder strength.',
    category_id_fk: 'cat-shoulders',
  },
  {
    exercise_id: 'starter-exercise-push-ups',
    name: 'Push-ups',
    description: 'Bodyweight finisher for chest and triceps.',
    category_id_fk: 'cat-chest',
  },
] as const;

const STARTER_ROUTINE_EXERCISES = [
  {
    routine_exercise_id: 'starter-routine-exercise-bench-press',
    exercise_id_fk: 'starter-exercise-bench-press',
    targets: [
      { routine_exercise_target_id: 'starter-target-bench-1', set_number: 1, target_reps: 10, target_weight: 60 },
      { routine_exercise_target_id: 'starter-target-bench-2', set_number: 2, target_reps: 8, target_weight: 65 },
      { routine_exercise_target_id: 'starter-target-bench-3', set_number: 3, target_reps: 8, target_weight: 70 },
    ],
  },
  {
    routine_exercise_id: 'starter-routine-exercise-shoulder-press',
    exercise_id_fk: 'starter-exercise-shoulder-press',
    targets: [
      { routine_exercise_target_id: 'starter-target-press-1', set_number: 1, target_reps: 10, target_weight: 35 },
      { routine_exercise_target_id: 'starter-target-press-2', set_number: 2, target_reps: 10, target_weight: 35 },
      { routine_exercise_target_id: 'starter-target-press-3', set_number: 3, target_reps: 8, target_weight: 40 },
    ],
  },
  {
    routine_exercise_id: 'starter-routine-exercise-push-ups',
    exercise_id_fk: 'starter-exercise-push-ups',
    targets: [
      { routine_exercise_target_id: 'starter-target-push-up-1', set_number: 1, target_reps: 15, target_weight: null },
      { routine_exercise_target_id: 'starter-target-push-up-2', set_number: 2, target_reps: 12, target_weight: null },
      { routine_exercise_target_id: 'starter-target-push-up-3', set_number: 3, target_reps: 12, target_weight: null },
    ],
  },
] as const;


export async function createRoutine(db: LocalDatabase, input: CreateRoutineInput): Promise<RoutineDetail> {
  const routineId = input.id ?? createLocalId('routine');
  const now = input.now ?? new Date().toISOString();
  const userId = input.userId ?? LOCAL_USER_ID;

  await runInExclusiveTransaction(db, async (txn) => {
    await txn.runAsync(
      `INSERT INTO routines (
        routine_id,
        user_id_fk,
        name,
        description,
        active,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      routineId,
      userId,
      input.name,
      input.description ?? null,
      input.active === false ? 0 : 1,
      now,
      now
    );

    for (const [exerciseIndex, exercise] of input.exercises.entries()) {
      const routineExerciseId = exercise.id ?? createLocalId('routine_exercise');

      await txn.runAsync(
        `INSERT INTO routine_exercises (
          routine_exercise_id,
          routine_id_fk,
          exercise_id_fk,
          order_index,
          created_at
        ) VALUES (?, ?, ?, ?, ?)`,
        routineExerciseId,
        routineId,
        exercise.exerciseId,
        exerciseIndex,
        now
      );

      for (const [targetIndex, target] of exercise.targets.entries()) {
        await txn.runAsync(
          `INSERT INTO routine_exercise_targets (
            routine_exercise_target_id,
            routine_exercise_id_fk,
            set_number,
            target_reps,
            target_weight,
            target_speed,
            target_duration_seconds,
            target_distance,
            rest_time_seconds,
            created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          target.id ?? createLocalId('routine_target'),
          routineExerciseId,
          target.setNumber ?? targetIndex + 1,
          target.targetReps ?? null,
          target.targetWeight ?? null,
          target.targetSpeed ?? null,
          target.targetDurationSeconds ?? null,
          target.targetDistance ?? null,
          target.restTimeSeconds ?? null,
          now
        );
      }
    }
  });

  const routine = await getRoutineDetail(db, routineId);

  if (!routine) {
    throw new Error(`Routine was not created: ${routineId}`);
  }

  return routine;
}

export async function seedStarterRoutineIfEmpty(db: LocalDatabase, userId = LOCAL_USER_ID): Promise<RoutineDetail> {
  const existingRoutine = await getTodayRoutine(db, userId);

  if (existingRoutine) {
    return existingRoutine;
  }

  const now = new Date().toISOString();

  await runInExclusiveTransaction(db, async (txn) => {
    for (const exercise of STARTER_EXERCISES) {
      await txn.runAsync(
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
        exercise.exercise_id,
        exercise.name,
        exercise.description,
        null,
        null,
        1,
        userId,
        exercise.category_id_fk,
        now,
        now
      );
    }

    await txn.runAsync(
      `INSERT OR IGNORE INTO routines (
        routine_id,
        user_id_fk,
        name,
        description,
        active,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      STARTER_ROUTINE_ID,
      userId,
      'Push Day',
      'Hypertrophy - Chest, Shoulders, Triceps',
      1,
      now,
      now
    );

    for (const [orderIndex, routineExercise] of STARTER_ROUTINE_EXERCISES.entries()) {
      await txn.runAsync(
        `INSERT OR IGNORE INTO routine_exercises (
          routine_exercise_id,
          routine_id_fk,
          exercise_id_fk,
          order_index,
          created_at
        ) VALUES (?, ?, ?, ?, ?)`,
        routineExercise.routine_exercise_id,
        STARTER_ROUTINE_ID,
        routineExercise.exercise_id_fk,
        orderIndex,
        now
      );

      for (const target of routineExercise.targets) {
        await txn.runAsync(
          `INSERT OR IGNORE INTO routine_exercise_targets (
            routine_exercise_target_id,
            routine_exercise_id_fk,
            set_number,
            target_reps,
            target_weight,
            target_speed,
            target_duration_seconds,
            target_distance,
            rest_time_seconds,
            created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          target.routine_exercise_target_id,
          routineExercise.routine_exercise_id,
          target.set_number,
          target.target_reps,
          target.target_weight,
          null,
          null,
          null,
          90,
          now
        );
      }
    }
  });

  const seededRoutine = await getTodayRoutine(db, userId);

  if (!seededRoutine) {
    throw new Error('Starter routine was not created.');
  }

  return seededRoutine;
}

export async function updateRoutine(db: LocalDatabase, input: UpdateRoutineInput): Promise<void> {
  await db.runAsync(
    `UPDATE routines
    SET name = ?, description = ?, active = ?, updated_at = ?
    WHERE routine_id = ?`,
    input.name,
    input.description ?? null,
    input.active === false ? 0 : 1,
    input.now ?? new Date().toISOString(),
    input.routineId
  );
}

export async function updateRoutineExerciseTarget(
  db: LocalDatabase,
  input: UpdateRoutineTargetInput
): Promise<void> {
  await db.runAsync(
    `UPDATE routine_exercise_targets
    SET target_reps = ?,
      target_weight = ?,
      target_speed = ?,
      target_duration_seconds = ?,
      target_distance = ?,
      rest_time_seconds = ?
    WHERE routine_exercise_target_id = ?`,
    input.targetReps ?? null,
    input.targetWeight ?? null,
    input.targetSpeed ?? null,
    input.targetDurationSeconds ?? null,
    input.targetDistance ?? null,
    input.restTimeSeconds ?? null,
    input.routineExerciseTargetId
  );
}

export async function getRoutineDetail(db: LocalDatabase, routineId: string): Promise<RoutineDetail | null> {
  const routine = await db.getFirstAsync<RoutineRow>('SELECT * FROM routines WHERE routine_id = ?', routineId);

  if (!routine) {
    return null;
  }

  const rows = await db.getAllAsync<RoutineExerciseQueryRow>(
    `SELECT
      routine_exercises.*,
      exercises.exercise_id AS exercise_id,
      exercises.name AS exercise_name,
      exercises.description AS exercise_description,
      exercises.image_url AS exercise_image_url,
      exercises.video_url AS exercise_video_url,
      exercises.active AS exercise_active,
      exercises.user_id_fk AS exercise_user_id,
      exercises.category_id_fk AS exercise_category_id,
      exercises.created_at AS exercise_created_at,
      exercises.updated_at AS exercise_updated_at
    FROM routine_exercises
    JOIN exercises ON exercises.exercise_id = routine_exercises.exercise_id_fk
    WHERE routine_exercises.routine_id_fk = ?
    ORDER BY routine_exercises.order_index ASC`,
    routineId
  );

  const exercises: RoutineExerciseWithTargets[] = [];

  for (const row of rows) {
    const targets = await db.getAllAsync<RoutineExerciseTargetRow>(
      `SELECT *
      FROM routine_exercise_targets
      WHERE routine_exercise_id_fk = ?
      ORDER BY set_number ASC`,
      row.routine_exercise_id
    );

    exercises.push({
      routine_exercise_id: row.routine_exercise_id,
      routine_id_fk: row.routine_id_fk,
      exercise_id_fk: row.exercise_id_fk,
      order_index: row.order_index,
      created_at: row.created_at,
      exercise: mapExerciseFromRoutineJoin(row),
      targets,
    });
  }

  return { ...routine, exercises };
}

export async function getTodayRoutine(db: LocalDatabase, userId = LOCAL_USER_ID): Promise<RoutineDetail | null> {
  const routine = await db.getFirstAsync<RoutineRow>(
    `SELECT *
    FROM routines
    WHERE user_id_fk = ? AND active = 1
    ORDER BY updated_at DESC, created_at DESC
    LIMIT 1`,
    userId
  );

  if (!routine) {
    return null;
  }

  return getRoutineDetail(db, routine.routine_id);
}


async function runInExclusiveTransaction<T>(
  db: LocalDatabase,
  task: (txn: LocalDatabase) => Promise<T>
): Promise<T> {
  if (db.withExclusiveTransactionAsync) {
    return db.withExclusiveTransactionAsync(task);
  }

  return task(db);
}


function mapExerciseFromRoutineJoin(row: RoutineExerciseQueryRow): ExerciseRow {
  return {
    exercise_id: row.exercise_id,
    name: row.exercise_name,
    description: row.exercise_description,
    image_url: row.exercise_image_url,
    video_url: row.exercise_video_url,
    active: row.exercise_active,
    user_id_fk: row.exercise_user_id,
    category_id_fk: row.exercise_category_id,
    created_at: row.exercise_created_at,
    updated_at: row.exercise_updated_at,
  };
}

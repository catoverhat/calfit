import { createLocalId } from './id';
import { EXERCISE_CATALOG } from '@/constants/exercise-catalog';

import { LOCAL_USER_ID, STARTER_CATEGORIES } from './schema';
import type {
  BodyMeasurementRow,
  CategoryRow,
  DashboardSnapshot,
  ExerciseRow,
  LocalDatabase,
  RoutineDetail,
  RoutineExerciseRow,
  RoutineExerciseTargetRow,
  RoutineExerciseWithTargets,
  RoutineRow,
  SqlValue,
  UserRow,
  WorkoutExerciseRow,
  WorkoutExerciseWithSets,
  WorkoutHistoryItem,
  WorkoutSessionDetail,
  WorkoutSessionRow,
  WorkoutSetRow,
  WorkoutSessionStatus,
} from './types';

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

export interface StartWorkoutFromRoutineInput {
  id?: string;
  userId?: string;
  routineId: string;
  scheduledFor?: string | null;
  startedAt?: string;
  now?: string;
  status?: Extract<WorkoutSessionStatus, 'scheduled' | 'in_progress'>;
}

export interface LogWorkoutSetInput {
  reps?: number | null;
  weight?: number | null;
  speed?: number | null;
  durationSeconds?: number | null;
  distance?: number | null;
  restTimeSeconds?: number | null;
  completed?: boolean;
}

export interface UpdateRoutineInput {
  routineId: string;
  name: string;
  description?: string | null;
  active?: boolean;
  now?: string;
}

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

export interface UpdateRoutineTargetInput {
  routineExerciseTargetId: string;
  targetReps?: number | null;
  targetWeight?: number | null;
  targetSpeed?: number | null;
  targetDurationSeconds?: number | null;
  targetDistance?: number | null;
  restTimeSeconds?: number | null;
}

export interface CreateBodyMeasurementInput {
  id?: string;
  userId?: string;
  weight?: number | null;
  bmi?: number | null;
  bodyFatPercentage?: number | null;
  createdAt?: string;
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

interface WorkoutExerciseQueryRow extends WorkoutExerciseRow {
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

interface WorkoutSessionQueryRow extends WorkoutSessionRow {
  routine_name: string | null;
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

export async function getLocalUserProfile(db: LocalDatabase, userId = LOCAL_USER_ID): Promise<UserRow> {
  const user = await db.getFirstAsync<UserRow>('SELECT * FROM users WHERE user_id = ?', userId);

  if (!user) {
    throw new Error(`Local user profile not found: ${userId}`);
  }

  return user;
}

export async function createBodyMeasurement(
  db: LocalDatabase,
  input: CreateBodyMeasurementInput
): Promise<BodyMeasurementRow> {
  const measurement: BodyMeasurementRow = {
    body_measurement_id: input.id ?? createLocalId('body_measurement'),
    user_id_fk: input.userId ?? LOCAL_USER_ID,
    weight: input.weight ?? null,
    bmi: input.bmi ?? null,
    body_fat_percentage: input.bodyFatPercentage ?? null,
    created_at: input.createdAt ?? new Date().toISOString(),
  };

  await db.runAsync(
    `INSERT INTO body_measurements (
      body_measurement_id,
      user_id_fk,
      weight,
      bmi,
      body_fat_percentage,
      created_at
    ) VALUES (?, ?, ?, ?, ?, ?)`,
    measurement.body_measurement_id,
    measurement.user_id_fk,
    measurement.weight,
    measurement.bmi,
    measurement.body_fat_percentage,
    measurement.created_at
  );

  return measurement;
}

export async function getLatestBodyMeasurement(
  db: LocalDatabase,
  userId = LOCAL_USER_ID
): Promise<BodyMeasurementRow | null> {
  return db.getFirstAsync<BodyMeasurementRow>(
    `SELECT *
    FROM body_measurements
    WHERE user_id_fk = ?
    ORDER BY created_at DESC
    LIMIT 1`,
    userId
  );
}

export async function getRecentBodyMeasurements(
  db: LocalDatabase,
  userId = LOCAL_USER_ID,
  limit = 2
): Promise<BodyMeasurementRow[]> {
  return db.getAllAsync<BodyMeasurementRow>(
    `SELECT *
    FROM body_measurements
    WHERE user_id_fk = ?
    ORDER BY created_at DESC
    LIMIT ?`,
    userId,
    limit
  );
}

export async function getWorkoutStreak(
  db: LocalDatabase,
  userId = LOCAL_USER_ID,
  asOf = new Date()
): Promise<number> {
  const rows = await db.getAllAsync<{ completed_at: string }>(
    `SELECT completed_at
    FROM workout_sessions
    WHERE user_id_fk = ? AND status = ? AND completed_at IS NOT NULL
    ORDER BY completed_at DESC`,
    userId,
    'completed'
  );
  const completedDays = new Set(rows.map((row) => toLocalDateKey(new Date(row.completed_at))));
  let streak = 0;
  const cursor = startOfLocalDay(asOf);

  while (completedDays.has(toLocalDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export async function getTodayDashboardSnapshot(
  db: LocalDatabase,
  userId = LOCAL_USER_ID,
  asOf = new Date()
): Promise<DashboardSnapshot> {
  const user = await getLocalUserProfile(db, userId);
  const routine = await getTodayRoutine(db, userId);
  const measurements = await getRecentBodyMeasurements(db, userId, 2);
  const workoutStreak = await getWorkoutStreak(db, userId, asOf);
  const completedWorkoutRow = await db.getFirstAsync<{ completed_count: number }>(
    `SELECT COUNT(*) AS completed_count
    FROM workout_sessions
    WHERE user_id_fk = ? AND status = ?`,
    userId,
    'completed'
  );

  return {
    user,
    routine,
    latestBodyMeasurement: measurements[0] ?? null,
    previousBodyMeasurement: measurements[1] ?? null,
    workoutStreak,
    completedWorkoutCount: completedWorkoutRow?.completed_count ?? 0,
  };
}

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

export async function startWorkoutFromRoutine(
  db: LocalDatabase,
  input: StartWorkoutFromRoutineInput
): Promise<WorkoutSessionRow> {
  const workoutSessionId = input.id ?? createLocalId('workout_session');
  const now = input.now ?? new Date().toISOString();
  const startedAt = input.startedAt ?? now;
  const userId = input.userId ?? LOCAL_USER_ID;
  const status = input.status ?? 'in_progress';

  await runInExclusiveTransaction(db, async (txn) => {
    const routineExercises = await txn.getAllAsync<RoutineExerciseRow>(
      `SELECT *
      FROM routine_exercises
      WHERE routine_id_fk = ?
      ORDER BY order_index ASC`,
      input.routineId
    );

    if (routineExercises.length === 0) {
      throw new Error(`Routine has no exercises: ${input.routineId}`);
    }

    await txn.runAsync(
      `INSERT INTO workout_sessions (
        workout_session_id,
        user_id_fk,
        routine_id_fk,
        scheduled_for,
        started_at,
        completed_at,
        status,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      workoutSessionId,
      userId,
      input.routineId,
      input.scheduledFor ?? null,
      status === 'in_progress' ? startedAt : null,
      null,
      status,
      now
    );

    for (const routineExercise of routineExercises) {
      const workoutExerciseId = createLocalId('workout_exercise');

      await txn.runAsync(
        `INSERT INTO workout_exercises (
          workout_exercise_id,
          workout_session_id_fk,
          exercise_id_fk,
          order_index,
          created_at
        ) VALUES (?, ?, ?, ?, ?)`,
        workoutExerciseId,
        workoutSessionId,
        routineExercise.exercise_id_fk,
        routineExercise.order_index,
        now
      );

      const targets = await txn.getAllAsync<RoutineExerciseTargetRow>(
        `SELECT *
        FROM routine_exercise_targets
        WHERE routine_exercise_id_fk = ?
        ORDER BY set_number ASC`,
        routineExercise.routine_exercise_id
      );

      for (const target of targets) {
        await txn.runAsync(
          `INSERT INTO workout_sets (
            workout_set_id,
            workout_exercise_id_fk,
            set_number,
            reps,
            weight,
            speed,
            duration_seconds,
            distance,
            rest_time_seconds,
            completed,
            created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          createLocalId('workout_set'),
          workoutExerciseId,
          target.set_number,
          target.target_reps,
          target.target_weight,
          target.target_speed,
          target.target_duration_seconds,
          target.target_distance,
          target.rest_time_seconds,
          0,
          now
        );
      }
    }
  });

  const session = await db.getFirstAsync<WorkoutSessionRow>(
    'SELECT * FROM workout_sessions WHERE workout_session_id = ?',
    workoutSessionId
  );

  if (!session) {
    throw new Error(`Workout session was not created: ${workoutSessionId}`);
  }

  return session;
}

export async function logWorkoutSet(
  db: LocalDatabase,
  workoutSetId: string,
  input: LogWorkoutSetInput
): Promise<void> {
  const current = await db.getFirstAsync<WorkoutSetRow>(
    'SELECT * FROM workout_sets WHERE workout_set_id = ?',
    workoutSetId
  );

  if (!current) {
    throw new Error(`Workout set not found: ${workoutSetId}`);
  }

  await db.runAsync(
    `UPDATE workout_sets
    SET reps = ?,
      weight = ?,
      speed = ?,
      duration_seconds = ?,
      distance = ?,
      rest_time_seconds = ?,
      completed = ?
    WHERE workout_set_id = ?`,
    coalesceSql(input.reps, current.reps),
    coalesceSql(input.weight, current.weight),
    coalesceSql(input.speed, current.speed),
    coalesceSql(input.durationSeconds, current.duration_seconds),
    coalesceSql(input.distance, current.distance),
    coalesceSql(input.restTimeSeconds, current.rest_time_seconds),
    input.completed === undefined ? current.completed : input.completed ? 1 : 0,
    workoutSetId
  );
}

export async function completeWorkoutSession(
  db: LocalDatabase,
  workoutSessionId: string,
  completedAt = new Date().toISOString()
): Promise<void> {
  await db.runAsync(
    `UPDATE workout_sessions
    SET status = ?, completed_at = ?
    WHERE workout_session_id = ?`,
    'completed',
    completedAt,
    workoutSessionId
  );
}

export async function getWorkoutSessionDetail(
  db: LocalDatabase,
  workoutSessionId: string
): Promise<WorkoutSessionDetail | null> {
  const session = await db.getFirstAsync<WorkoutSessionQueryRow>(
    `SELECT
      workout_sessions.*,
      routines.name AS routine_name
    FROM workout_sessions
    LEFT JOIN routines ON routines.routine_id = workout_sessions.routine_id_fk
    WHERE workout_sessions.workout_session_id = ?`,
    workoutSessionId
  );

  if (!session) {
    return null;
  }

  const exercises = await getWorkoutSessionExercises(db, session.workout_session_id);

  return { ...session, exercises };
}

export async function getWorkoutHistory(db: LocalDatabase, userId = LOCAL_USER_ID): Promise<WorkoutHistoryItem[]> {
  const sessions = await db.getAllAsync<WorkoutSessionQueryRow>(
    `SELECT
      workout_sessions.*,
      routines.name AS routine_name
    FROM workout_sessions
    LEFT JOIN routines ON routines.routine_id = workout_sessions.routine_id_fk
    WHERE workout_sessions.user_id_fk = ?
    ORDER BY workout_sessions.started_at DESC, workout_sessions.created_at DESC`,
    userId
  );

  const history: WorkoutHistoryItem[] = [];

  for (const session of sessions) {
    const exercises = await getWorkoutSessionExercises(db, session.workout_session_id);

    history.push({ ...session, exercises });
  }

  return history;
}

async function getWorkoutSessionExercises(
  db: LocalDatabase,
  workoutSessionId: string
): Promise<WorkoutExerciseWithSets[]> {
  const workoutExercises = await db.getAllAsync<WorkoutExerciseQueryRow>(
    `SELECT
      workout_exercises.*,
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
    FROM workout_exercises
    JOIN exercises ON exercises.exercise_id = workout_exercises.exercise_id_fk
    WHERE workout_exercises.workout_session_id_fk = ?
    ORDER BY workout_exercises.order_index ASC`,
    workoutSessionId
  );

  const exercises: WorkoutExerciseWithSets[] = [];

  for (const row of workoutExercises) {
    const sets = await db.getAllAsync<WorkoutSetRow>(
      `SELECT *
      FROM workout_sets
      WHERE workout_exercise_id_fk = ?
      ORDER BY set_number ASC`,
      row.workout_exercise_id
    );

    exercises.push({
      workout_exercise_id: row.workout_exercise_id,
      workout_session_id_fk: row.workout_session_id_fk,
      exercise_id_fk: row.exercise_id_fk,
      order_index: row.order_index,
      created_at: row.created_at,
      exercise: mapExerciseFromWorkoutJoin(row),
      sets,
    });
  }

  return exercises;
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

function coalesceSql(nextValue: SqlValue | undefined, fallback: SqlValue): SqlValue {
  return nextValue === undefined ? fallback : nextValue;
}

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function toLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getBuiltInCategoryId(muscleGroup: string): string | null {
  return (
    STARTER_CATEGORIES.find(
      (category) => category.name === muscleGroup || category.muscle_group === muscleGroup
    )?.category_id ?? null
  );
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

function mapExerciseFromWorkoutJoin(row: WorkoutExerciseQueryRow): ExerciseRow {
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

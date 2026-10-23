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
  RoutineScheduleRow,
} from '../types';
import { seedBuiltInExercisesIfEmpty } from './exercises';

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
  scheduleDays?: number[];
  now?: string;
}

export interface UpdateRoutineInput {
  routineId: string;
  name: string;
  description?: string | null;
  active?: boolean;
  exercises?: CreateRoutineExerciseInput[];
  scheduleDays?: number[];
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

export interface RoutineSummary extends RoutineRow {
  exercise_count: number;
  set_count: number;
  schedule_days: number[];
  last_completed_at: string | null;
  image_url: string | null;
  focus: 'cardio' | 'strength';
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

const DEMO_ROUTINES: readonly CreateRoutineInput[] = [
  {
    id: 'push-day',
    name: 'Push Day',
    description: 'Focus on chest, shoulders, and triceps with heavy compound movements.',
    scheduleDays: [1, 3, 5],
    exercises: [
      strengthExercise('bench-press', 4, 8, 70),
      strengthExercise('shoulder-press', 3, 10, 35),
      strengthExercise('push-ups', 3, 12, null),
    ],
  },
  {
    id: 'leg-day',
    name: 'Leg Day',
    description: 'High volume hypertrophy for quads, hamstrings, and calves.',
    scheduleDays: [2],
    exercises: [
      strengthExercise('squat', 4, 8, 80),
      strengthExercise('romanian-deadlift', 4, 10, 70),
      strengthExercise('calf-raise', 4, 15, 45),
    ],
  },
  {
    id: 'full-body-power',
    name: 'Full Body',
    description: 'Efficient full body conditioning for busy days.',
    scheduleDays: [5],
    exercises: [
      strengthExercise('goblet-squat', 4, 10, 28),
      strengthExercise('dumbbell-press', 4, 8, 24),
      strengthExercise('single-arm-row', 3, 12, 26),
    ],
  },
  {
    id: 'running-day',
    name: 'Running Day',
    description: 'Tempo running and intervals for cardiovascular endurance.',
    scheduleDays: [3, 6],
    exercises: [
      cardioExercise('warm-up-jog', { targetDurationSeconds: 480, targetSpeed: 8 }),
      cardioExercise('tempo-run', { targetDistance: 5000, targetSpeed: 11 }),
      cardioExercise('cooldown-walk', { targetDurationSeconds: 300, targetSpeed: 5 }),
    ],
  },
];

export async function getRoutineSummaries(
  db: LocalDatabase,
  userId = LOCAL_USER_ID
): Promise<RoutineSummary[]> {
  const routines = await db.getAllAsync<RoutineRow>(
    `SELECT * FROM routines
    WHERE user_id_fk = ?
    ORDER BY updated_at DESC, created_at DESC`,
    userId
  );

  return Promise.all(
    routines.map(async (routine) => {
      const detail = await getRoutineDetail(db, routine.routine_id);
      const completed = await db.getFirstAsync<{ completed_at: string }>(
        `SELECT completed_at FROM workout_sessions
        WHERE routine_id_fk = ? AND status = 'completed' AND completed_at IS NOT NULL
        ORDER BY completed_at DESC
        LIMIT 1`,
        routine.routine_id
      );
      const exercises = detail?.exercises ?? [];
      const targets = exercises.flatMap((exercise) => exercise.targets);
      const isCardio = targets.some(
        (target) =>
          target.target_distance !== null ||
          target.target_duration_seconds !== null ||
          target.target_speed !== null
      );

      return {
        ...routine,
        exercise_count: exercises.length,
        set_count: targets.length,
        schedule_days: (detail?.schedules ?? []).map((schedule) => schedule.day_of_week),
        last_completed_at: completed?.completed_at ?? null,
        image_url: exercises.find((exercise) => exercise.exercise.image_url)?.exercise.image_url ?? null,
        focus: isCardio ? 'cardio' : 'strength',
      };
    })
  );
}

export async function createRoutine(db: LocalDatabase, input: CreateRoutineInput): Promise<RoutineDetail> {
  const routineId = input.id ?? createLocalId('routine');
  const now = input.now ?? new Date().toISOString();
  const userId = input.userId ?? LOCAL_USER_ID;

  await runInExclusiveTransaction(db, async (txn) => {
    await txn.runAsync(
      `INSERT INTO routines (
        routine_id, user_id_fk, name, description, active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      routineId,
      userId,
      input.name,
      input.description ?? null,
      input.active === false ? 0 : 1,
      now,
      now
    );
    await insertRoutineExercises(txn, routineId, input.exercises, now);
    await insertRoutineSchedules(txn, routineId, userId, input.scheduleDays ?? [], now);
  });

  const routine = await getRoutineDetail(db, routineId);
  if (!routine) throw new Error(`Workout was not created: ${routineId}`);
  return routine;
}

export async function updateRoutine(db: LocalDatabase, input: UpdateRoutineInput): Promise<void> {
  const now = input.now ?? new Date().toISOString();

  await runInExclusiveTransaction(db, async (txn) => {
    const existing = await txn.getFirstAsync<RoutineRow>(
      'SELECT * FROM routines WHERE routine_id = ?',
      input.routineId
    );
    if (!existing) throw new Error('Workout could not be found.');

    await txn.runAsync(
      `UPDATE routines
      SET name = ?, description = ?, active = ?, updated_at = ?
      WHERE routine_id = ?`,
      input.name,
      input.description ?? null,
      input.active === false ? 0 : 1,
      now,
      input.routineId
    );

    if (input.exercises) {
      await txn.runAsync(
        `DELETE FROM routine_exercise_targets
        WHERE routine_exercise_id_fk IN (
          SELECT routine_exercise_id FROM routine_exercises WHERE routine_id_fk = ?
        )`,
        input.routineId
      );
      await txn.runAsync('DELETE FROM routine_exercises WHERE routine_id_fk = ?', input.routineId);
      await insertRoutineExercises(txn, input.routineId, input.exercises, now);
    }

    if (input.scheduleDays) {
      await txn.runAsync('DELETE FROM routine_schedules WHERE routine_id_fk = ?', input.routineId);
      await insertRoutineSchedules(
        txn,
        input.routineId,
        existing.user_id_fk,
        input.scheduleDays,
        now
      );
    }
  });
}

export async function updateRoutineExerciseTarget(
  db: LocalDatabase,
  input: UpdateRoutineTargetInput
): Promise<void> {
  await db.runAsync(
    `UPDATE routine_exercise_targets
    SET target_reps = ?, target_weight = ?, target_speed = ?, target_duration_seconds = ?,
      target_distance = ?, rest_time_seconds = ?
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

export async function getRoutineDetail(
  db: LocalDatabase,
  routineId: string
): Promise<RoutineDetail | null> {
  const routine = await db.getFirstAsync<RoutineRow>(
    'SELECT * FROM routines WHERE routine_id = ?',
    routineId
  );
  if (!routine) return null;

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
      `SELECT * FROM routine_exercise_targets
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

  const schedules = await db.getAllAsync<RoutineScheduleRow>(
    `SELECT * FROM routine_schedules
    WHERE routine_id_fk = ? AND active = 1
    ORDER BY day_of_week ASC`,
    routineId
  );
  return { ...routine, exercises, schedules };
}

export async function getTodayRoutine(
  db: LocalDatabase,
  userId = LOCAL_USER_ID,
  asOf = new Date()
): Promise<RoutineDetail | null> {
  const active = (await getRoutineSummaries(db, userId)).filter((routine) => routine.active === 1);
  const weekday = asOf.getDay();
  const due = active.filter((routine) => routine.schedule_days.includes(weekday));
  const selected = due.sort(compareDueRoutines)[0] ?? active.sort(compareFallbackRoutines)[0];

  return selected ? getRoutineDetail(db, selected.routine_id) : null;
}

export async function seedDemoRoutinesIfEmpty(
  db: LocalDatabase,
  userId = LOCAL_USER_ID,
  now = new Date().toISOString()
): Promise<RoutineDetail> {
  const count = await db.getFirstAsync<{ routine_count: number }>(
    'SELECT COUNT(*) AS routine_count FROM routines WHERE user_id_fk = ?',
    userId
  );
  if ((count?.routine_count ?? 0) === 0) {
    await seedBuiltInExercisesIfEmpty(db);
    for (const routine of DEMO_ROUTINES) {
      await createRoutine(db, { ...routine, userId, now });
    }
  }

  const summaries = await getRoutineSummaries(db, userId);
  const existingRoutine = summaries.find((routine) => routine.active === 1) ?? summaries[0];
  const routine = existingRoutine
    ? await getRoutineDetail(db, existingRoutine.routine_id)
    : null;
  if (!routine) throw new Error('A starter workout could not be loaded.');
  return routine;
}

/** Kept for compatibility with the Today feature. */
export const seedStarterRoutineIfEmpty = seedDemoRoutinesIfEmpty;

async function insertRoutineExercises(
  db: LocalDatabase,
  routineId: string,
  exercises: CreateRoutineExerciseInput[],
  now: string
): Promise<void> {
  for (const [exerciseIndex, exercise] of exercises.entries()) {
    const routineExerciseId = exercise.id ?? createLocalId('routine_exercise');
    await db.runAsync(
      `INSERT INTO routine_exercises (
        routine_exercise_id, routine_id_fk, exercise_id_fk, order_index, created_at
      ) VALUES (?, ?, ?, ?, ?)`,
      routineExerciseId,
      routineId,
      exercise.exerciseId,
      exerciseIndex,
      now
    );
    for (const [targetIndex, target] of exercise.targets.entries()) {
      await db.runAsync(
        `INSERT INTO routine_exercise_targets (
          routine_exercise_target_id, routine_exercise_id_fk, set_number, target_reps,
          target_weight, target_speed, target_duration_seconds, target_distance,
          rest_time_seconds, created_at
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
}

async function insertRoutineSchedules(
  db: LocalDatabase,
  routineId: string,
  userId: string,
  scheduleDays: number[],
  now: string
): Promise<void> {
  const uniqueDays = [...new Set(scheduleDays)].sort((left, right) => left - right);
  for (const day of uniqueDays) {
    if (!Number.isInteger(day) || day < 0 || day > 6) {
      throw new Error(`Invalid routine schedule day: ${day}`);
    }
    await db.runAsync(
      `INSERT INTO routine_schedules (
        routine_schedule_id, user_id_fk, routine_id_fk, day_of_week, start_date,
        end_date, recurrent, active, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      createLocalId('routine_schedule'),
      userId,
      routineId,
      day,
      now.slice(0, 10),
      null,
      1,
      1,
      now
    );
  }
}

async function runInExclusiveTransaction<T>(
  db: LocalDatabase,
  task: (txn: LocalDatabase) => Promise<T>
): Promise<T> {
  if (!db.withExclusiveTransactionAsync) return task(db);

  let result!: T;
  await db.withExclusiveTransactionAsync(async (txn) => {
    result = await task(txn);
  });
  return result;
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

function compareDueRoutines(left: RoutineSummary, right: RoutineSummary): number {
  if (left.last_completed_at === null && right.last_completed_at !== null) return -1;
  if (left.last_completed_at !== null && right.last_completed_at === null) return 1;
  const completionCompare = String(left.last_completed_at ?? '').localeCompare(
    String(right.last_completed_at ?? '')
  );
  return completionCompare !== 0 ? completionCompare : compareFallbackRoutines(left, right);
}

function compareFallbackRoutines(left: RoutineSummary, right: RoutineSummary): number {
  const updatedCompare = right.updated_at.localeCompare(left.updated_at);
  return updatedCompare !== 0 ? updatedCompare : left.routine_id.localeCompare(right.routine_id);
}

function strengthExercise(
  exerciseId: string,
  sets: number,
  targetReps: number,
  targetWeight: number | null
): CreateRoutineExerciseInput {
  return {
    exerciseId,
    targets: Array.from({ length: sets }, (_, index) => ({
      setNumber: index + 1,
      targetReps,
      targetWeight,
      restTimeSeconds: 90,
    })),
  };
}

function cardioExercise(
  exerciseId: string,
  target: Pick<
    CreateRoutineTargetInput,
    'targetDistance' | 'targetDurationSeconds' | 'targetSpeed'
  >
): CreateRoutineExerciseInput {
  return { exerciseId, targets: [{ ...target, restTimeSeconds: 60 }] };
}

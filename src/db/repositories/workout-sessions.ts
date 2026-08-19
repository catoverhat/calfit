import { createLocalId } from '../id';
import { LOCAL_USER_ID } from '../schema';
import type {
  ExerciseRow,
  LocalDatabase,
  RoutineExerciseRow,
  RoutineExerciseTargetRow,
  SqlValue,
  WorkoutExerciseRow,
  WorkoutExerciseWithSets,
  WorkoutHistoryItem,
  WorkoutSessionDetail,
  WorkoutSessionRow,
  WorkoutSessionStatus,
  WorkoutSetRow,
} from '../types';

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

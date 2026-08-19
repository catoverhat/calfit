/// <reference types="jest" />

import {
  createBodyMeasurement,
  completeWorkoutSession,
  createExercise,
  createRoutine,
  EXPECTED_TABLES,
  getExerciseCatalog,
  getExerciseCategories,
  getExerciseDetail,
  getRoutineDetail,
  getLatestBodyMeasurement,
  getLocalUserProfile,
  getTodayRoutine,
  getTodayDashboardSnapshot,
  getWorkoutHistory,
  getWorkoutSessionDetail,
  getWorkoutStreak,
  initializeLocalDatabase,
  LOCAL_USER_ID,
  logWorkoutSet,
  migrateDbIfNeeded,
  seedBuiltInExercisesIfEmpty,
  seedStarterData,
  seedStarterRoutineIfEmpty,
  STARTER_CATEGORIES,
  startWorkoutFromRoutine,
  updateExercise,
  updateRoutine,
  updateRoutineExerciseTarget,
} from '../index';
import type { LocalDatabase, SqlRunResult, SqlValue } from '../types';

type TableRow = Record<string, SqlValue>;

const PRIMARY_KEYS: Record<string, string> = {
  users: 'user_id',
  categories: 'category_id',
  exercises: 'exercise_id',
  routines: 'routine_id',
  routine_exercises: 'routine_exercise_id',
  routine_exercise_targets: 'routine_exercise_target_id',
  workout_sessions: 'workout_session_id',
  workout_exercises: 'workout_exercise_id',
  workout_sets: 'workout_set_id',
  body_measurements: 'body_measurement_id',
};

class MemoryDb implements LocalDatabase {
  readonly tables = new Map<string, TableRow[]>();
  readonly createdTables = new Set<string>();
  userVersion = 0;

  async execAsync(source: string): Promise<void> {
    const normalized = normalizeSql(source);
    const createMatch = normalized.match(/^create table if not exists (\w+)/);
    const versionMatch = normalized.match(/^pragma user_version = (\d+)/);

    if (createMatch) {
      this.createdTables.add(createMatch[1]);
      this.ensureTable(createMatch[1]);
      return;
    }

    if (versionMatch) {
      this.userVersion = Number(versionMatch[1]);
    }
  }

  async getAllAsync<T>(source: string, ...params: SqlValue[]): Promise<T[]> {
    const normalized = normalizeSql(source);

    if (normalized === 'pragma user_version') {
      return [{ user_version: this.userVersion } as T];
    }

    if (normalized === 'select * from routines where routine_id = ?') {
      return this.selectBy('routines', 'routine_id', params[0]) as T[];
    }

    if (normalized === 'select * from users where user_id = ?') {
      return this.selectBy('users', 'user_id', params[0]) as T[];
    }

    if (normalized === 'select * from categories order by name asc') {
      return [...this.ensureTable('categories')].sort((left, right) =>
        String(left.name).localeCompare(String(right.name))
      ) as T[];
    }

    if (
      normalized ===
      'select * from body_measurements where user_id_fk = ? order by created_at desc limit 1'
    ) {
      return this.selectBy('body_measurements', 'user_id_fk', params[0])
        .sort((left, right) => compareNullableDates(right.created_at, left.created_at))
        .slice(0, 1) as T[];
    }

    if (
      normalized ===
      'select * from body_measurements where user_id_fk = ? order by created_at desc limit ?'
    ) {
      return this.selectBy('body_measurements', 'user_id_fk', params[0])
        .sort((left, right) => compareNullableDates(right.created_at, left.created_at))
        .slice(0, Number(params[1])) as T[];
    }

    if (
      normalized ===
      'select * from routines where user_id_fk = ? and active = 1 order by updated_at desc, created_at desc limit 1'
    ) {
      return this.selectBy('routines', 'user_id_fk', params[0])
        .filter((row) => row.active === 1)
        .sort((left, right) => compareNullableDates(right.updated_at, left.updated_at)) as T[];
    }

    if (normalized === 'select * from workout_sessions where workout_session_id = ?') {
      return this.selectBy('workout_sessions', 'workout_session_id', params[0]) as T[];
    }

    if (normalized === 'select * from workout_sets where workout_set_id = ?') {
      return this.selectBy('workout_sets', 'workout_set_id', params[0]) as T[];
    }

    if (
      normalized ===
      'select completed_at from workout_sessions where user_id_fk = ? and status = ? and completed_at is not null order by completed_at desc'
    ) {
      return this.selectBy('workout_sessions', 'user_id_fk', params[0])
        .filter((row) => row.status === params[1] && row.completed_at !== null)
        .sort((left, right) => compareNullableDates(right.completed_at, left.completed_at))
        .map((row) => ({ completed_at: row.completed_at })) as T[];
    }

    if (
      normalized ===
      'select count(*) as completed_count from workout_sessions where user_id_fk = ? and status = ?'
    ) {
      const completedCount = this.selectBy('workout_sessions', 'user_id_fk', params[0]).filter(
        (row) => row.status === params[1]
      ).length;

      return [{ completed_count: completedCount } as T];
    }

    if (normalized.startsWith('select routine_exercises.*')) {
      return this.routineExerciseJoin(params[0] as string) as T[];
    }

    if (normalized.startsWith('select exercises.*') && normalized.includes('exercises.active = 1')) {
      return this.exerciseCatalogJoin(params[0] as string) as T[];
    }

    if (normalized.startsWith('select exercises.*') && normalized.includes('where exercises.exercise_id = ?')) {
      return this.exerciseDetailJoin(params[0] as string) as T[];
    }

    if (
      normalized ===
      'select * from routine_exercise_targets where routine_exercise_id_fk = ? order by set_number asc'
    ) {
      return this.selectBy('routine_exercise_targets', 'routine_exercise_id_fk', params[0]).sort(
        byNumber('set_number')
      ) as T[];
    }

    if (normalized === 'select * from routine_exercises where routine_id_fk = ? order by order_index asc') {
      return this.selectBy('routine_exercises', 'routine_id_fk', params[0]).sort(byNumber('order_index')) as T[];
    }

    if (normalized.startsWith('select workout_sessions.*') && normalized.includes('workout_session_id = ?')) {
      return this.workoutSessionById(params[0] as string) as T[];
    }

    if (normalized.startsWith('select workout_sessions.*')) {
      return this.workoutSessionJoin(params[0] as string) as T[];
    }

    if (normalized.startsWith('select workout_exercises.*')) {
      return this.workoutExerciseJoin(params[0] as string) as T[];
    }

    if (normalized === 'select * from workout_sets where workout_exercise_id_fk = ? order by set_number asc') {
      return this.selectBy('workout_sets', 'workout_exercise_id_fk', params[0]).sort(byNumber('set_number')) as T[];
    }

    throw new Error(`Unhandled getAllAsync SQL: ${source}`);
  }

  async getFirstAsync<T>(source: string, ...params: SqlValue[]): Promise<T | null> {
    const rows = await this.getAllAsync<T>(source, ...params);

    return rows[0] ?? null;
  }

  async runAsync(source: string, ...params: SqlValue[]): Promise<SqlRunResult> {
    const normalized = normalizeSql(source);

    if (normalized.startsWith('insert')) {
      return this.insert(source, params);
    }

    if (normalized.startsWith('update routines')) {
      return this.updateById('routines', 'routine_id', params[4], {
        name: params[0],
        description: params[1],
        active: params[2],
        updated_at: params[3],
      });
    }

    if (normalized.startsWith('update exercises')) {
      return this.updateById('exercises', 'exercise_id', params[7], {
        name: params[0],
        description: params[1],
        image_url: params[2],
        video_url: params[3],
        active: params[4],
        category_id_fk: params[5],
        updated_at: params[6],
      });
    }

    if (normalized.startsWith('update routine_exercise_targets')) {
      return this.updateById('routine_exercise_targets', 'routine_exercise_target_id', params[6], {
        target_reps: params[0],
        target_weight: params[1],
        target_speed: params[2],
        target_duration_seconds: params[3],
        target_distance: params[4],
        rest_time_seconds: params[5],
      });
    }

    if (normalized.startsWith('update workout_sets')) {
      return this.updateById('workout_sets', 'workout_set_id', params[7], {
        reps: params[0],
        weight: params[1],
        speed: params[2],
        duration_seconds: params[3],
        distance: params[4],
        rest_time_seconds: params[5],
        completed: params[6],
      });
    }

    if (normalized.startsWith('update workout_sessions')) {
      return this.updateById('workout_sessions', 'workout_session_id', params[2], {
        status: params[0],
        completed_at: params[1],
      });
    }

    throw new Error(`Unhandled runAsync SQL: ${source}`);
  }

  async withExclusiveTransactionAsync<T>(task: (txn: LocalDatabase) => Promise<T>): Promise<T> {
    return task(this);
  }

  private ensureTable(tableName: string): TableRow[] {
    if (!this.tables.has(tableName)) {
      this.tables.set(tableName, []);
    }

    return this.tables.get(tableName) ?? [];
  }

  private insert(source: string, params: SqlValue[]): SqlRunResult {
    const match = source.match(/INSERT(?: OR IGNORE)? INTO\s+(\w+)\s*\(([\s\S]*?)\)\s*VALUES/i);

    if (!match) {
      throw new Error(`Could not parse insert SQL: ${source}`);
    }

    const [, tableName, rawColumns] = match;
    const columns = rawColumns.split(',').map((column) => column.trim());
    const rows = this.ensureTable(tableName);
    const row = columns.reduce<TableRow>((nextRow, column, index) => {
      nextRow[column] = params[index];
      return nextRow;
    }, {});

    if (source.toLowerCase().includes('insert or ignore')) {
      const primaryKey = PRIMARY_KEYS[tableName];
      const exists = rows.some((existingRow) => existingRow[primaryKey] === row[primaryKey]);

      if (exists) {
        return { changes: 0 };
      }
    }

    rows.push(row);

    return { changes: 1, lastInsertRowId: rows.length };
  }

  private selectBy(tableName: string, column: string, value: SqlValue): TableRow[] {
    return [...this.ensureTable(tableName)].filter((row) => row[column] === value);
  }

  private updateById(tableName: string, idColumn: string, idValue: SqlValue, patch: TableRow): SqlRunResult {
    const row = this.ensureTable(tableName).find((candidate) => candidate[idColumn] === idValue);

    if (!row) {
      return { changes: 0 };
    }

    Object.assign(row, patch);

    return { changes: 1 };
  }

  private routineExerciseJoin(routineId: string): TableRow[] {
    return this.selectBy('routine_exercises', 'routine_id_fk', routineId)
      .sort(byNumber('order_index'))
      .map((routineExercise) => {
        const exercise = this.requireRow('exercises', 'exercise_id', routineExercise.exercise_id_fk);

        return {
          ...routineExercise,
          exercise_id: exercise.exercise_id,
          exercise_name: exercise.name,
          exercise_description: exercise.description,
          exercise_image_url: exercise.image_url,
          exercise_video_url: exercise.video_url,
          exercise_active: exercise.active,
          exercise_user_id: exercise.user_id_fk,
          exercise_category_id: exercise.category_id_fk,
          exercise_created_at: exercise.created_at,
          exercise_updated_at: exercise.updated_at,
        };
      });
  }

  private exerciseCatalogJoin(userId: string): TableRow[] {
    return this.ensureTable('exercises')
      .filter((exercise) => exercise.active === 1 && (exercise.user_id_fk === null || exercise.user_id_fk === userId))
      .map((exercise) => this.mapExerciseCategoryJoin(exercise))
      .sort((left, right) => {
        const categoryCompare = String(left.category_name ?? '').localeCompare(String(right.category_name ?? ''));

        return categoryCompare === 0 ? String(left.name).localeCompare(String(right.name)) : categoryCompare;
      });
  }

  private exerciseDetailJoin(exerciseId: string): TableRow[] {
    return this.selectBy('exercises', 'exercise_id', exerciseId).map((exercise) =>
      this.mapExerciseCategoryJoin(exercise)
    );
  }

  private mapExerciseCategoryJoin(exercise: TableRow): TableRow {
    const category = this.ensureTable('categories').find(
      (candidate) => candidate.category_id === exercise.category_id_fk
    );

    return {
      ...exercise,
      category_name: category?.name ?? null,
      category_muscle_group: category?.muscle_group ?? null,
    };
  }

  private workoutSessionJoin(userId: string): TableRow[] {
    return this.selectBy('workout_sessions', 'user_id_fk', userId)
      .map<TableRow>((session) => {
        const routine = this.ensureTable('routines').find((candidate) => candidate.routine_id === session.routine_id_fk);

        return {
          ...session,
          routine_name: routine?.name ?? null,
        };
      })
      .sort((left, right) => compareNullableDates(right.started_at, left.started_at));
  }

  private workoutSessionById(workoutSessionId: string): TableRow[] {
    const session = this.ensureTable('workout_sessions').find(
      (candidate) => candidate.workout_session_id === workoutSessionId
    );

    if (!session) {
      return [];
    }

    const routine = this.ensureTable('routines').find((candidate) => candidate.routine_id === session.routine_id_fk);

    return [
      {
        ...session,
        routine_name: routine?.name ?? null,
      },
    ];
  }

  private workoutExerciseJoin(workoutSessionId: string): TableRow[] {
    return this.selectBy('workout_exercises', 'workout_session_id_fk', workoutSessionId)
      .sort(byNumber('order_index'))
      .map((workoutExercise) => {
        const exercise = this.requireRow('exercises', 'exercise_id', workoutExercise.exercise_id_fk);

        return {
          ...workoutExercise,
          exercise_id: exercise.exercise_id,
          exercise_name: exercise.name,
          exercise_description: exercise.description,
          exercise_image_url: exercise.image_url,
          exercise_video_url: exercise.video_url,
          exercise_active: exercise.active,
          exercise_user_id: exercise.user_id_fk,
          exercise_category_id: exercise.category_id_fk,
          exercise_created_at: exercise.created_at,
          exercise_updated_at: exercise.updated_at,
        };
      });
  }

  private requireRow(tableName: string, column: string, value: SqlValue): TableRow {
    const row = this.ensureTable(tableName).find((candidate) => candidate[column] === value);

    if (!row) {
      throw new Error(`Missing ${tableName}.${column}: ${String(value)}`);
    }

    return row;
  }
}

describe('local SQLite database layer', () => {
  it('migrates the v1 schema and seeds local starter data', async () => {
    const db = new MemoryDb();

    await migrateDbIfNeeded(db);
    await seedStarterData(db, '2026-07-06T12:00:00.000Z');

    expect(db.userVersion).toBe(2);
    expect([...db.createdTables].sort()).toEqual([...EXPECTED_TABLES].sort());
    expect(db.tables.get('users')).toEqual(
      expect.arrayContaining([expect.objectContaining({ user_id: LOCAL_USER_ID, username: 'Local Athlete' })])
    );
    expect(db.tables.get('categories')).toHaveLength(STARTER_CATEGORIES.length);
    expect(db.createdTables.has('body_measurements')).toBe(true);
  });

  it('upgrades a v1 database by adding body measurements', async () => {
    const db = new MemoryDb();
    db.userVersion = 1;

    await migrateDbIfNeeded(db);

    expect(db.userVersion).toBe(2);
    expect(db.createdTables.has('body_measurements')).toBe(true);
  });

  it('runs the first routine-to-workout slice with copied workout history', async () => {
    const db = new MemoryDb();
    const now = '2026-07-06T12:00:00.000Z';

    await initializeLocalDatabase(db);

    const squat = await createExercise(db, {
      id: 'exercise-squat',
      name: 'Back Squat',
      categoryId: 'cat-legs',
      now,
    });
    const bench = await createExercise(db, {
      id: 'exercise-bench',
      name: 'Bench Press',
      categoryId: 'cat-chest',
      now,
    });

    const routine = await createRoutine(db, {
      id: 'routine-strength',
      name: 'Strength A',
      description: 'Heavy compound day',
      now,
      exercises: [
        {
          id: 'routine-exercise-squat',
          exerciseId: squat.exercise_id,
          targets: [
            { id: 'target-squat-1', targetReps: 5, targetWeight: 140, restTimeSeconds: 180 },
            { id: 'target-squat-2', targetReps: 5, targetWeight: 140, restTimeSeconds: 180 },
          ],
        },
        {
          id: 'routine-exercise-bench',
          exerciseId: bench.exercise_id,
          targets: [{ id: 'target-bench-1', targetReps: 8, targetWeight: 90, restTimeSeconds: 120 }],
        },
      ],
    });

    expect(routine.exercises.map((exercise) => exercise.exercise.name)).toEqual(['Back Squat', 'Bench Press']);
    expect(routine.exercises.map((exercise) => exercise.order_index)).toEqual([0, 1]);

    const session = await startWorkoutFromRoutine(db, {
      id: 'session-strength',
      routineId: routine.routine_id,
      startedAt: '2026-07-06T13:00:00.000Z',
      now: '2026-07-06T13:00:00.000Z',
    });
    let history = await getWorkoutHistory(db);
    const squatFirstSet = history[0].exercises[0].sets[0];

    await logWorkoutSet(db, squatFirstSet.workout_set_id, {
      reps: 5,
      weight: 142.5,
      completed: true,
    });
    await completeWorkoutSession(db, session.workout_session_id, '2026-07-06T14:05:00.000Z');
    await updateRoutine(db, {
      routineId: routine.routine_id,
      name: 'Strength A Edited',
      description: 'Edited later',
      now: '2026-07-07T09:00:00.000Z',
    });
    await updateRoutineExerciseTarget(db, {
      routineExerciseTargetId: 'target-squat-1',
      targetReps: 3,
      targetWeight: 160,
      restTimeSeconds: 240,
    });

    history = await getWorkoutHistory(db);
    const updatedRoutine = await getRoutineDetail(db, routine.routine_id);
    const completedSession = history[0];

    expect(updatedRoutine?.name).toBe('Strength A Edited');
    expect(updatedRoutine?.exercises[0].targets[0]).toEqual(
      expect.objectContaining({ target_reps: 3, target_weight: 160, rest_time_seconds: 240 })
    );
    expect(completedSession.status).toBe('completed');
    expect(completedSession.completed_at).toBe('2026-07-06T14:05:00.000Z');
    expect(completedSession.exercises.map((exercise) => exercise.exercise.name)).toEqual(['Back Squat', 'Bench Press']);
    expect(completedSession.exercises[0].sets[0]).toEqual(
      expect.objectContaining({
        reps: 5,
        weight: 142.5,
        rest_time_seconds: 180,
        completed: 1,
      })
    );
    expect(completedSession.exercises[0].sets[1]).toEqual(
      expect.objectContaining({
        reps: 5,
        weight: 140,
        rest_time_seconds: 180,
        completed: 0,
      })
    );
  });

  it('seeds a starter routine once and can load today/session detail', async () => {
    const db = new MemoryDb();

    await initializeLocalDatabase(db);

    const seededRoutine = await seedStarterRoutineIfEmpty(db);
    const seededAgain = await seedStarterRoutineIfEmpty(db);
    const todayRoutine = await getTodayRoutine(db);

    expect(seededRoutine.routine_id).toBe(seededAgain.routine_id);
    expect(db.tables.get('routines')).toHaveLength(1);
    expect(todayRoutine?.exercises.map((exercise) => exercise.exercise.name)).toEqual([
      'Bench Press',
      'Shoulder Press',
      'Push-ups',
    ]);

    const session = await startWorkoutFromRoutine(db, {
      id: 'starter-session',
      routineId: seededRoutine.routine_id,
      now: '2026-07-06T15:00:00.000Z',
      startedAt: '2026-07-06T15:00:00.000Z',
    });
    const detail = await getWorkoutSessionDetail(db, session.workout_session_id);

    expect(detail?.routine_name).toBe('Push Day');
    expect(detail?.exercises).toHaveLength(3);
    expect(detail?.exercises[0].sets).toHaveLength(3);
    expect(detail?.exercises[0].sets[0]).toEqual(
      expect.objectContaining({
        reps: 10,
        weight: 60,
        rest_time_seconds: 90,
        completed: 0,
      })
    );
  });

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

  it('loads body measurements, dashboard snapshot, and workout streak from local data', async () => {
    const db = new MemoryDb();

    await initializeLocalDatabase(db);
    await seedStarterRoutineIfEmpty(db);

    const profile = await getLocalUserProfile(db);
    const emptySnapshot = await getTodayDashboardSnapshot(db, LOCAL_USER_ID, new Date('2026-07-06T12:00:00.000Z'));

    expect(profile.username).toBe('Local Athlete');
    expect(emptySnapshot.latestBodyMeasurement).toBeNull();
    expect(emptySnapshot.workoutStreak).toBe(0);

    await createBodyMeasurement(db, {
      id: 'measurement-old',
      weight: 82.4,
      createdAt: '2026-07-01T08:00:00.000Z',
    });
    await createBodyMeasurement(db, {
      id: 'measurement-new',
      weight: 81.7,
      createdAt: '2026-07-06T08:00:00.000Z',
    });

    const latestMeasurement = await getLatestBodyMeasurement(db);
    expect(latestMeasurement?.body_measurement_id).toBe('measurement-new');

    const routine = await getTodayRoutine(db);
    if (!routine) throw new Error('Expected seeded routine');

    const todaySession = await startWorkoutFromRoutine(db, {
      id: 'session-today',
      routineId: routine.routine_id,
      now: '2026-07-06T10:00:00.000Z',
      startedAt: '2026-07-06T10:00:00.000Z',
    });
    await completeWorkoutSession(db, todaySession.workout_session_id, '2026-07-06T11:00:00.000Z');

    const yesterdaySession = await startWorkoutFromRoutine(db, {
      id: 'session-yesterday',
      routineId: routine.routine_id,
      now: '2026-07-05T10:00:00.000Z',
      startedAt: '2026-07-05T10:00:00.000Z',
    });
    await completeWorkoutSession(db, yesterdaySession.workout_session_id, '2026-07-05T11:00:00.000Z');

    const streak = await getWorkoutStreak(db, LOCAL_USER_ID, new Date('2026-07-06T12:00:00.000Z'));
    const snapshot = await getTodayDashboardSnapshot(db, LOCAL_USER_ID, new Date('2026-07-06T12:00:00.000Z'));

    expect(streak).toBe(2);
    expect(snapshot.latestBodyMeasurement?.body_measurement_id).toBe('measurement-new');
    expect(snapshot.previousBodyMeasurement?.body_measurement_id).toBe('measurement-old');
    expect(snapshot.workoutStreak).toBe(2);
    expect(snapshot.completedWorkoutCount).toBe(2);
  });
});

function normalizeSql(source: string): string {
  return source.replace(/\s+/g, ' ').trim().toLowerCase();
}

function byNumber(column: string): (left: TableRow, right: TableRow) => number {
  return (left, right) => Number(left[column] ?? 0) - Number(right[column] ?? 0);
}

function compareNullableDates(left: SqlValue, right: SqlValue): number {
  return String(left ?? '').localeCompare(String(right ?? ''));
}

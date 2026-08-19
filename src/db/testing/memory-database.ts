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

export class MemoryDb implements LocalDatabase {
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


function normalizeSql(source: string): string {
  return source.replace(/\s+/g, ' ').trim().toLowerCase();
}

function byNumber(column: string): (left: TableRow, right: TableRow) => number {
  return (left, right) => Number(left[column] ?? 0) - Number(right[column] ?? 0);
}

function compareNullableDates(left: SqlValue, right: SqlValue): number {
  return String(left ?? '').localeCompare(String(right ?? ''));
}

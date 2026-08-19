import type { LocalDatabase } from './types';

export const DATABASE_NAME = 'calfit.db';
export const DATABASE_VERSION = 2;
export const LOCAL_USER_ID = 'local-user';

export const STARTER_CATEGORIES = [
  { category_id: 'cat-chest', name: 'Chest', muscle_group: 'Chest' },
  { category_id: 'cat-back', name: 'Back', muscle_group: 'Back' },
  { category_id: 'cat-legs', name: 'Legs', muscle_group: 'Legs' },
  { category_id: 'cat-shoulders', name: 'Shoulders', muscle_group: 'Shoulders' },
  { category_id: 'cat-arms', name: 'Arms', muscle_group: 'Arms' },
  { category_id: 'cat-core', name: 'Core', muscle_group: 'Core' },
] as const;

export const EXPECTED_TABLES = [
  'users',
  'categories',
  'exercises',
  'routines',
  'routine_exercises',
  'routine_exercise_targets',
  'workout_sessions',
  'workout_exercises',
  'workout_sets',
  'body_measurements',
] as const;

export const CREATE_TABLE_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS users (
    user_id TEXT PRIMARY KEY NOT NULL,
    username TEXT NOT NULL,
    email TEXT,
    dob TEXT,
    height REAL,
    height_unit TEXT NOT NULL DEFAULT 'cm',
    weight_unit TEXT NOT NULL DEFAULT 'kg',
    speed_unit TEXT NOT NULL DEFAULT 'kmh',
    distance_unit TEXT NOT NULL DEFAULT 'm',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS categories (
    category_id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    muscle_group TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS exercises (
    exercise_id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    video_url TEXT,
    active INTEGER NOT NULL DEFAULT 1,
    user_id_fk TEXT,
    category_id_fk TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (user_id_fk) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id_fk) REFERENCES categories(category_id) ON DELETE SET NULL
  )`,
  `CREATE TABLE IF NOT EXISTS routines (
    routine_id TEXT PRIMARY KEY NOT NULL,
    user_id_fk TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (user_id_fk) REFERENCES users(user_id) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS routine_exercises (
    routine_exercise_id TEXT PRIMARY KEY NOT NULL,
    routine_id_fk TEXT NOT NULL,
    exercise_id_fk TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (routine_id_fk) REFERENCES routines(routine_id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id_fk) REFERENCES exercises(exercise_id) ON DELETE RESTRICT,
    UNIQUE (routine_id_fk, order_index)
  )`,
  `CREATE TABLE IF NOT EXISTS routine_exercise_targets (
    routine_exercise_target_id TEXT PRIMARY KEY NOT NULL,
    routine_exercise_id_fk TEXT NOT NULL,
    set_number INTEGER NOT NULL,
    target_reps INTEGER,
    target_weight REAL,
    target_speed REAL,
    target_duration_seconds INTEGER,
    target_distance REAL,
    rest_time_seconds INTEGER,
    created_at TEXT NOT NULL,
    FOREIGN KEY (routine_exercise_id_fk) REFERENCES routine_exercises(routine_exercise_id) ON DELETE CASCADE,
    UNIQUE (routine_exercise_id_fk, set_number)
  )`,
  `CREATE TABLE IF NOT EXISTS workout_sessions (
    workout_session_id TEXT PRIMARY KEY NOT NULL,
    user_id_fk TEXT NOT NULL,
    routine_id_fk TEXT,
    scheduled_for TEXT,
    started_at TEXT,
    completed_at TEXT,
    status TEXT NOT NULL CHECK (status IN ('scheduled', 'in_progress', 'completed', 'skipped')),
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id_fk) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (routine_id_fk) REFERENCES routines(routine_id) ON DELETE SET NULL
  )`,
  `CREATE TABLE IF NOT EXISTS workout_exercises (
    workout_exercise_id TEXT PRIMARY KEY NOT NULL,
    workout_session_id_fk TEXT NOT NULL,
    exercise_id_fk TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (workout_session_id_fk) REFERENCES workout_sessions(workout_session_id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id_fk) REFERENCES exercises(exercise_id) ON DELETE RESTRICT,
    UNIQUE (workout_session_id_fk, order_index)
  )`,
  `CREATE TABLE IF NOT EXISTS workout_sets (
    workout_set_id TEXT PRIMARY KEY NOT NULL,
    workout_exercise_id_fk TEXT NOT NULL,
    set_number INTEGER NOT NULL,
    reps INTEGER,
    weight REAL,
    speed REAL,
    duration_seconds INTEGER,
    distance REAL,
    rest_time_seconds INTEGER,
    completed INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    FOREIGN KEY (workout_exercise_id_fk) REFERENCES workout_exercises(workout_exercise_id) ON DELETE CASCADE,
    UNIQUE (workout_exercise_id_fk, set_number)
  )`,
  `CREATE TABLE IF NOT EXISTS body_measurements (
    body_measurement_id TEXT PRIMARY KEY NOT NULL,
    user_id_fk TEXT NOT NULL,
    weight REAL,
    bmi REAL,
    body_fat_percentage REAL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id_fk) REFERENCES users(user_id) ON DELETE CASCADE
  )`,
] as const;

export const CREATE_INDEX_STATEMENTS = [
  'CREATE INDEX IF NOT EXISTS idx_exercises_user ON exercises(user_id_fk)',
  'CREATE INDEX IF NOT EXISTS idx_routines_user ON routines(user_id_fk)',
  'CREATE INDEX IF NOT EXISTS idx_routine_exercises_routine ON routine_exercises(routine_id_fk, order_index)',
  'CREATE INDEX IF NOT EXISTS idx_routine_targets_exercise ON routine_exercise_targets(routine_exercise_id_fk, set_number)',
  'CREATE INDEX IF NOT EXISTS idx_workout_sessions_user ON workout_sessions(user_id_fk, started_at)',
  'CREATE INDEX IF NOT EXISTS idx_workout_exercises_session ON workout_exercises(workout_session_id_fk, order_index)',
  'CREATE INDEX IF NOT EXISTS idx_workout_sets_exercise ON workout_sets(workout_exercise_id_fk, set_number)',
  'CREATE INDEX IF NOT EXISTS idx_body_measurements_user ON body_measurements(user_id_fk, created_at)',
] as const;

export async function migrateDbIfNeeded(db: LocalDatabase): Promise<void> {
  const versionRow = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  const currentVersion = versionRow?.user_version ?? 0;

  if (currentVersion >= DATABASE_VERSION) {
    await db.execAsync('PRAGMA foreign_keys = ON');
    return;
  }

  if (currentVersion > DATABASE_VERSION) {
    throw new Error(`Unsupported local database version: ${currentVersion}`);
  }

  await db.execAsync('PRAGMA journal_mode = WAL');
  await db.execAsync('PRAGMA foreign_keys = ON');

  if (currentVersion < 1) {
    for (const statement of CREATE_TABLE_STATEMENTS) {
      await db.execAsync(statement);
    }
  }

  if (currentVersion === 1) {
    await db.execAsync(CREATE_TABLE_STATEMENTS[CREATE_TABLE_STATEMENTS.length - 1]);
  }

  for (const statement of CREATE_INDEX_STATEMENTS) {
    await db.execAsync(statement);
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

export async function seedStarterData(db: LocalDatabase, now = new Date().toISOString()): Promise<void> {
  await db.runAsync(
    `INSERT OR IGNORE INTO users (
      user_id,
      username,
      email,
      dob,
      height,
      height_unit,
      weight_unit,
      speed_unit,
      distance_unit,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    LOCAL_USER_ID,
    'Local Athlete',
    null,
    null,
    null,
    'cm',
    'kg',
    'kmh',
    'm',
    now,
    now
  );

  for (const category of STARTER_CATEGORIES) {
    await db.runAsync(
      'INSERT OR IGNORE INTO categories (category_id, name, muscle_group) VALUES (?, ?, ?)',
      category.category_id,
      category.name,
      category.muscle_group
    );
  }
}

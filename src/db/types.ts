import type { DistanceUnit, HeightUnit, SpeedUnit, WeightUnit } from './units';

export type SqlValue = string | number | boolean | null;

export interface SqlRunResult {
  changes: number;
  lastInsertRowId?: number;
}

export interface LocalDatabase {
  execAsync(source: string): Promise<void>;
  getAllAsync<T>(source: string, ...params: SqlValue[]): Promise<T[]>;
  getFirstAsync<T>(source: string, ...params: SqlValue[]): Promise<T | null>;
  runAsync(source: string, ...params: SqlValue[]): Promise<SqlRunResult>;
  withExclusiveTransactionAsync?(task: (txn: LocalDatabase) => Promise<void>): Promise<void>;
}

export type WorkoutSessionStatus = 'scheduled' | 'in_progress' | 'completed' | 'skipped';

export interface UserRow {
  user_id: string;
  username: string;
  email: string | null;
  dob: string | null;
  height: number | null;
  height_unit: HeightUnit;
  weight_unit: WeightUnit;
  speed_unit: SpeedUnit;
  distance_unit: DistanceUnit | 'm';
  created_at: string;
  updated_at: string;
}

export interface CategoryRow {
  category_id: string;
  name: string;
  muscle_group: string;
}

export interface ExerciseRow {
  exercise_id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  video_url: string | null;
  active: number;
  user_id_fk: string | null;
  category_id_fk: string | null;
  created_at: string;
  updated_at: string;
}

export interface RoutineRow {
  routine_id: string;
  user_id_fk: string;
  name: string;
  description: string | null;
  active: number;
  created_at: string;
  updated_at: string;
}

export interface RoutineExerciseRow {
  routine_exercise_id: string;
  routine_id_fk: string;
  exercise_id_fk: string;
  order_index: number;
  created_at: string;
}

export interface RoutineExerciseTargetRow {
  routine_exercise_target_id: string;
  routine_exercise_id_fk: string;
  set_number: number;
  target_reps: number | null;
  target_weight: number | null;
  target_speed: number | null;
  target_duration_seconds: number | null;
  target_distance: number | null;
  rest_time_seconds: number | null;
  created_at: string;
}

export interface RoutineScheduleRow {
  routine_schedule_id: string;
  user_id_fk: string;
  routine_id_fk: string;
  day_of_week: number;
  start_date: string;
  end_date: string | null;
  recurrent: number;
  active: number;
  created_at: string;
}

export interface WorkoutSessionRow {
  workout_session_id: string;
  user_id_fk: string;
  routine_id_fk: string | null;
  scheduled_for: string | null;
  started_at: string | null;
  completed_at: string | null;
  status: WorkoutSessionStatus;
  created_at: string;
}

export interface WorkoutExerciseRow {
  workout_exercise_id: string;
  workout_session_id_fk: string;
  exercise_id_fk: string;
  order_index: number;
  created_at: string;
}

export interface WorkoutSetRow {
  workout_set_id: string;
  workout_exercise_id_fk: string;
  set_number: number;
  reps: number | null;
  weight: number | null;
  speed: number | null;
  duration_seconds: number | null;
  distance: number | null;
  rest_time_seconds: number | null;
  completed: number;
  completed_at: string | null;
  created_at: string;
}

export interface WorkoutPlanEntryRow {
  workout_plan_entry_id: string;
  user_id_fk: string;
  routine_id_fk: string;
  planned_date: string;
  workout_session_id_fk: string | null;
  created_at: string;
  updated_at: string;
}

export interface WorkoutPlanSettingsRow {
  user_id_fk: string;
  legacy_import_handled: number;
  created_at: string;
  updated_at: string;
}

export interface BodyMeasurementRow {
  body_measurement_id: string;
  user_id_fk: string;
  weight: number | null;
  bmi: number | null;
  body_fat_percentage: number | null;
  created_at: string;
}

export interface RoutineExerciseWithTargets extends RoutineExerciseRow {
  exercise: ExerciseRow;
  targets: RoutineExerciseTargetRow[];
}

export interface RoutineDetail extends RoutineRow {
  exercises: RoutineExerciseWithTargets[];
  schedules: RoutineScheduleRow[];
}

export interface WorkoutExerciseWithSets extends WorkoutExerciseRow {
  exercise: ExerciseRow;
  sets: WorkoutSetRow[];
}

export interface WorkoutHistoryItem extends WorkoutSessionRow {
  routine_name: string | null;
  exercises: WorkoutExerciseWithSets[];
}

export interface WorkoutSessionDetail extends WorkoutSessionRow {
  routine_name: string | null;
  exercises: WorkoutExerciseWithSets[];
}

export interface WorkoutPlanEntryDetail extends WorkoutPlanEntryRow {
  routine: RoutineDetail;
  session: WorkoutSessionRow | null;
}

/** User-plan domain name; persisted workout identifiers still reference `routines`. */
export type WorkoutPlanEntry = WorkoutPlanEntryDetail;

export interface DashboardSnapshot {
  activeSession: WorkoutSessionRow | null;
  user: UserRow;
  planEntry: WorkoutPlanEntryDetail | null;
  latestBodyMeasurement: BodyMeasurementRow | null;
  previousBodyMeasurement: BodyMeasurementRow | null;
  workoutStreak: number;
  completedWorkoutCount: number;
}

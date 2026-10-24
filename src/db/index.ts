export { initializeLocalDatabase, openLocalDatabase } from './database';
export { createLocalId } from './id';
export {
  CREATE_TABLE_STATEMENTS,
  DATABASE_NAME,
  DATABASE_VERSION,
  EXPECTED_TABLES,
  LOCAL_USER_ID,
  STARTER_CATEGORIES,
  migrateDbIfNeeded,
  seedStarterData,
} from './schema';
export {
  createExercise,
  getExerciseCatalog,
  getExerciseCategories,
  getExerciseDetail,
  seedBuiltInExercisesIfEmpty,
  updateExercise,
} from './repositories/exercises';
export type {
  CreateExerciseInput,
  ExerciseCatalogRow,
  ExerciseDetail,
  UpdateExerciseInput,
} from './repositories/exercises';
export { getLocalUserProfile, saveLocalProfile, saveThemePreference } from './repositories/users';
export type { SaveLocalProfileInput } from './repositories/users';
export {
  createBodyMeasurement,
  getLatestBodyMeasurement,
  getRecentBodyMeasurements,
} from './repositories/body-measurements';
export type { CreateBodyMeasurementInput } from './repositories/body-measurements';
export { getTodayDashboardSnapshot, getWorkoutStreak } from './repositories/dashboard';
export {
  assignWorkoutToDate,
  copyWorkoutPlanWeek,
  getWorkoutPlanEntries,
  getWorkoutPlanEntryForDate,
  moveWorkoutPlanEntry,
  removeWorkoutPlanEntry,
  removeFutureWorkoutPlanEntriesForRoutine,
  replaceAndMoveWorkoutPlanEntry,
  startOrResumeWorkoutFromPlanEntry,
  undoWorkoutPlanChange,
} from './repositories/workout-plan';
export type {
  WorkoutPlanUndo,
} from './repositories/workout-plan';
export {
  createRoutine,
  getRoutineDetail,
  getRoutineSummaries,
  seedDemoRoutinesIfEmpty,
  updateRoutine,
} from './repositories/routines';
export type {
  CreateRoutineExerciseInput,
  CreateRoutineInput,
  CreateRoutineTargetInput,
  UpdateRoutineInput,
  RoutineSummary,
} from './repositories/routines';
export {
  completeWorkoutSession,
  createWorkoutSessionFromRoutine,
  getInProgressWorkoutSession,
  getWorkoutHistory,
  getWorkoutSessionDetail,
  logWorkoutSet,
  startOrResumeWorkoutFromRoutine,
  startWorkoutFromRoutine,
} from './repositories/workout-sessions';
export type {
  LogWorkoutSetInput,
  StartOrResumeWorkoutResult,
  StartWorkoutFromRoutineInput,
} from './repositories/workout-sessions';
export {
  distanceFromCanonical,
  distanceToCanonical,
  formatUnitNumber,
  heightFromCanonical,
  heightToCanonical,
  normalizeDistanceUnit,
  normalizeHeightUnit,
  normalizeSpeedUnit,
  normalizeWeightUnit,
  speedFromCanonical,
  speedToCanonical,
  weightFromCanonical,
  weightToCanonical,
} from './units';
export type { DistanceUnit, HeightUnit, SpeedUnit, WeightUnit } from './units';
export type {
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
  SqlRunResult,
  SqlValue,
  UserRow,
  ThemePreference,
  WorkoutExerciseRow,
  WorkoutExerciseWithSets,
  WorkoutHistoryItem,
  WorkoutPlanEntryDetail,
  WorkoutPlanEntryRow,
  WorkoutSessionDetail,
  WorkoutSessionRow,
  WorkoutSessionStatus,
  WorkoutSetRow,
} from './types';

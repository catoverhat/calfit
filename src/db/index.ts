export { initializeLocalDatabase, openLocalDatabase, resetLocalDatabaseCache } from './database';
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
export { getLocalUserProfile } from './repositories/users';
export {
  createBodyMeasurement,
  getLatestBodyMeasurement,
  getRecentBodyMeasurements,
} from './repositories/body-measurements';
export type { CreateBodyMeasurementInput } from './repositories/body-measurements';
export { getTodayDashboardSnapshot, getWorkoutStreak } from './repositories/dashboard';
export {
  createRoutine,
  getRoutineDetail,
  getTodayRoutine,
  seedStarterRoutineIfEmpty,
  updateRoutine,
  updateRoutineExerciseTarget,
} from './repositories/routines';
export type {
  CreateRoutineExerciseInput,
  CreateRoutineInput,
  CreateRoutineTargetInput,
  UpdateRoutineInput,
  UpdateRoutineTargetInput,
} from './repositories/routines';
export {
  completeWorkoutSession,
  getWorkoutHistory,
  getWorkoutSessionDetail,
  logWorkoutSet,
  startWorkoutFromRoutine,
} from './repositories/workout-sessions';
export type {
  LogWorkoutSetInput,
  StartWorkoutFromRoutineInput,
} from './repositories/workout-sessions';
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
  WorkoutExerciseRow,
  WorkoutExerciseWithSets,
  WorkoutHistoryItem,
  WorkoutSessionDetail,
  WorkoutSessionRow,
  WorkoutSessionStatus,
  WorkoutSetRow,
} from './types';

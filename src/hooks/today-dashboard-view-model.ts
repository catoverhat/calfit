import { MOCK_WORKOUTS } from '@/constants/mock-data';
import type { BodyMeasurementRow, DashboardSnapshot, RoutineDetail, UserRow, WorkoutSessionDetail } from '@/db';

type MockWorkout = (typeof MOCK_WORKOUTS)[number];

export interface TodayDashboardRoutine {
  id: string;
  title: string;
  focus: string;
  scheduledTime: string;
  exercises: number;
  duration: string;
}

export interface TodayDashboardData {
  avatarUrl: string | null;
  dateLabel: string;
  name: string;
  weekDays: { date: string; day: string }[];
  selectedDate: string;
  syncLabel: string;
  routine: TodayDashboardRoutine | null;
  progress: {
    bodyWeight: string;
    bodyWeightDelta: string;
    streak: string;
    streakProgress: number;
  };
  tip: string;
}

export interface WorkoutViewModel {
  id: string;
  title: string;
  duration: string;
  intensity: string;
  imageUrl: string;
  description: string;
  exercises: { id: string; name: string; sets: number; reps: string }[];
}

const fallbackWorkout = MOCK_WORKOUTS[0];

export function createTodayDashboardData(snapshot: DashboardSnapshot | null, date = new Date()): TodayDashboardData {
  const user = snapshot?.user ?? createFallbackUser();
  const routine = snapshot?.routine ?? null;
  const progress = createProgressData(
    user,
    snapshot?.latestBodyMeasurement ?? null,
    snapshot?.previousBodyMeasurement ?? null,
    snapshot?.workoutStreak ?? 0
  );

  return {
    avatarUrl: null,
    dateLabel: formatDashboardDate(date),
    name: user.username,
    weekDays: createWeekDays(date),
    selectedDate: formatDayNumber(date),
    syncLabel: 'Saved locally',
    routine: routine ? mapRoutineToDashboardRoutine(routine) : null,
    progress,
    tip: createDashboardTip(snapshot),
  };
}

export function mapRoutineToDashboardRoutine(routine: RoutineDetail): TodayDashboardRoutine {
  return {
    id: routine.routine_id,
    title: routine.name,
    focus: routine.description ?? buildFocusLabel(routine),
    scheduledTime: 'Ready now',
    exercises: routine.exercises.length,
    duration: estimateRoutineDuration(routine),
  };
}

export function mapWorkoutSessionToViewModel(session: WorkoutSessionDetail): WorkoutViewModel {
  const exercises = session.exercises.map((exercise) => ({
    id: exercise.workout_exercise_id,
    name: exercise.exercise.name,
    sets: exercise.sets.length,
    reps: formatSetTargets(exercise.sets),
  }));

  return {
    id: session.workout_session_id,
    title: session.routine_name ?? 'Local Workout',
    duration: estimateSessionDuration(session),
    intensity: session.status === 'completed' ? 'Completed' : 'In Progress',
    imageUrl: fallbackWorkout.imageUrl,
    description: `Local workout session saved on this device with ${exercises.length} exercises.`,
    exercises: exercises.length > 0 ? exercises : [...fallbackWorkout.exercises],
  };
}

export function mapMockWorkoutToViewModel(workout: MockWorkout = fallbackWorkout): WorkoutViewModel {
  return {
    id: workout.id,
    title: workout.title,
    duration: workout.duration,
    intensity: workout.intensity,
    imageUrl: workout.imageUrl,
    description: workout.description,
    exercises: [...workout.exercises],
  };
}

function createWeekDays(date: Date): { date: string; day: string }[] {
  const start = new Date(date);
  start.setDate(date.getDate() - 3);

  return Array.from({ length: 7 }, (_, index) => {
    const itemDate = new Date(start);
    itemDate.setDate(start.getDate() + index);

    return {
      date: formatDayNumber(itemDate),
      day: itemDate.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 1),
    };
  });
}

function formatDashboardDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

function createProgressData(
  user: UserRow,
  latestMeasurement: BodyMeasurementRow | null,
  previousMeasurement: BodyMeasurementRow | null,
  workoutStreak: number
): TodayDashboardData['progress'] {
  return {
    bodyWeight:
      typeof latestMeasurement?.weight === 'number'
        ? `${formatMeasurement(latestMeasurement.weight)} ${user.weight_unit}`
        : 'Not logged',
    bodyWeightDelta: createWeightDeltaLabel(user, latestMeasurement, previousMeasurement),
    streak: `${workoutStreak} ${workoutStreak === 1 ? 'day' : 'days'}`,
    streakProgress: Math.min(workoutStreak / 7, 1),
  };
}

function createWeightDeltaLabel(
  user: UserRow,
  latestMeasurement: BodyMeasurementRow | null,
  previousMeasurement: BodyMeasurementRow | null
): string {
  if (typeof latestMeasurement?.weight !== 'number') {
    return 'Add a measurement';
  }

  if (typeof previousMeasurement?.weight !== 'number') {
    return 'Add another measurement';
  }

  const delta = latestMeasurement.weight - previousMeasurement.weight;
  const sign = delta > 0 ? '+' : '';

  return `${sign}${formatMeasurement(delta)} ${user.weight_unit} vs previous`;
}

function createDashboardTip(snapshot: DashboardSnapshot | null): string {
  if (!snapshot?.routine) {
    return 'Create a local routine to make Today actionable.';
  }

  if (!snapshot.latestBodyMeasurement) {
    return 'Log a body measurement to unlock real progress trends.';
  }

  if (snapshot.workoutStreak === 0) {
    return `Start ${snapshot.routine.name} to begin your local streak.`;
  }

  return `Local streak active: ${snapshot.workoutStreak} ${snapshot.workoutStreak === 1 ? 'day' : 'days'}.`;
}

function createFallbackUser(): UserRow {
  const now = new Date(0).toISOString();

  return {
    user_id: 'local-user',
    username: 'Local Athlete',
    email: null,
    dob: null,
    height: null,
    height_unit: 'cm',
    weight_unit: 'kg',
    speed_unit: 'kmh',
    distance_unit: 'm',
    created_at: now,
    updated_at: now,
  };
}

function formatMeasurement(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function formatDayNumber(date: Date): string {
  return date.toLocaleDateString('en-US', { day: '2-digit' });
}

function estimateRoutineDuration(routine: RoutineDetail): string {
  const setCount = routine.exercises.reduce((count, exercise) => count + exercise.targets.length, 0);
  const minutes = Math.max(20, Math.round(setCount * 4.5 + routine.exercises.length * 3));

  return `${minutes} min`;
}

function estimateSessionDuration(session: WorkoutSessionDetail): string {
  if (session.started_at && session.completed_at) {
    const elapsedMinutes = Math.round(
      (new Date(session.completed_at).getTime() - new Date(session.started_at).getTime()) / 60000
    );

    if (elapsedMinutes > 0) {
      return `${elapsedMinutes} min`;
    }
  }

  const setCount = session.exercises.reduce((count, exercise) => count + exercise.sets.length, 0);

  return `${Math.max(20, Math.round(setCount * 4.5))} min`;
}

function buildFocusLabel(routine: RoutineDetail): string {
  const exerciseNames = routine.exercises.map((exercise) => exercise.exercise.name).slice(0, 3);

  return exerciseNames.length > 0 ? exerciseNames.join(', ') : 'Local routine';
}

function formatSetTargets(sets: WorkoutSessionDetail['exercises'][number]['sets']): string {
  const reps = sets.map((set) => set.reps).filter((value): value is number => typeof value === 'number');

  if (reps.length === 0) {
    return 'Target sets';
  }

  const min = Math.min(...reps);
  const max = Math.max(...reps);

  return min === max ? `${min} reps` : `${min}-${max} reps`;
}

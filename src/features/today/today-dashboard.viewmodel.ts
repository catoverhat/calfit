import {
  normalizeWeightUnit,
  weightFromCanonical,
  type BodyMeasurementRow,
  type DashboardSnapshot,
  type RoutineDetail,
  type UserRow,
} from '@/db';

export interface TodayDashboardRoutine {
  id: string;
  planEntryId: string;
  title: string;
  focus: string;
  exercises: number;
  duration: string;
  state: 'assigned' | 'completed' | 'in_progress' | 'unavailable';
}

export interface TodayDashboardData {
  actionLabel: string;
  activeSessionId: string | null;
  activeWorkoutIsSeparate: boolean;
  completedSessionId: string | null;
  avatarUrl: string | null;
  dateLabel: string;
  greeting: string;
  name: string;
  syncLabel: string;
  routine: TodayDashboardRoutine | null;
  progress: {
    completedWorkouts: number;
    bodyWeight: string;
    bodyWeightDelta: string;
    streak: string;
    streakProgress: number;
  };
  tip: string;
}

export function createTodayDashboardData(snapshot: DashboardSnapshot | null, date = new Date()): TodayDashboardData {
  const user = snapshot?.user ?? createFallbackUser();
  const planEntry = snapshot?.planEntry ?? null;
  const progress = createProgressData(
    user,
    snapshot?.latestBodyMeasurement ?? null,
    snapshot?.previousBodyMeasurement ?? null,
    snapshot?.workoutStreak ?? 0
  );

  return {
    actionLabel: snapshot?.activeSession
      ? 'Resume Workout'
      : planEntry?.session?.status === 'completed'
        ? 'Workout Complete'
        : 'Start Workout',
    activeSessionId: snapshot?.activeSession?.workout_session_id ?? null,
    activeWorkoutIsSeparate: Boolean(snapshot?.activeSession &&
      snapshot.activeSession.workout_session_id !== planEntry?.session?.workout_session_id),
    completedSessionId: planEntry?.session?.status === 'completed'
      ? planEntry.session.workout_session_id
      : null,
    avatarUrl: null,
    dateLabel: formatDashboardDate(date),
    greeting: createGreeting(date),
    name: user.username,
    syncLabel: 'Saved locally',
    routine: planEntry ? mapPlanEntryToDashboardRoutine(planEntry) : null,
    progress: { ...progress, completedWorkouts: snapshot?.completedWorkoutCount ?? 0 },
    tip: createDashboardTip(snapshot),
  };
}

function createGreeting(date: Date): string {
  const hour = date.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export function mapRoutineToDashboardRoutine(routine: RoutineDetail): Omit<TodayDashboardRoutine, 'planEntryId' | 'state'> {
  return {
    id: routine.routine_id,
    title: routine.name,
    focus: routine.description ?? buildFocusLabel(routine),
    exercises: routine.exercises.length,
    duration: estimateRoutineDuration(routine),
  };
}

function mapPlanEntryToDashboardRoutine(
  entry: NonNullable<DashboardSnapshot['planEntry']>
): TodayDashboardRoutine {
  const routine = mapRoutineToDashboardRoutine(entry.routine);
  const state = entry.session?.status === 'completed'
    ? 'completed'
    : entry.routine.active !== 1
      ? 'unavailable'
      : entry.session?.status === 'in_progress'
        ? 'in_progress'
        : 'assigned';
  return { ...routine, planEntryId: entry.workout_plan_entry_id, state };
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
): Omit<TodayDashboardData['progress'], 'completedWorkouts'> {
  const weightUnit = normalizeWeightUnit(user.weight_unit);
  return {
    bodyWeight:
      typeof latestMeasurement?.weight === 'number'
        ? `${formatMeasurement(weightFromCanonical(latestMeasurement.weight, weightUnit))} ${weightUnit}`
        : 'Not logged',
    bodyWeightDelta: createWeightDeltaLabel(user, latestMeasurement, previousMeasurement),
    streak: `${workoutStreak} ${workoutStreak === 1 ? 'week' : 'weeks'}`,
    streakProgress: Math.min(workoutStreak / 4, 1),
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
  const weightUnit = normalizeWeightUnit(user.weight_unit);

  return `${sign}${formatMeasurement(weightFromCanonical(delta, weightUnit))} ${weightUnit} vs previous`;
}

function createDashboardTip(snapshot: DashboardSnapshot | null): string {
  if (!snapshot?.planEntry) {
    return 'Recovery is part of the plan. Assign a workout whenever you are ready.';
  }

  if (!snapshot.latestBodyMeasurement) {
    return 'Your sets tell the story. Log what you complete to track your training over time.';
  }

  if (snapshot.workoutStreak === 0) {
    return 'Build at your own pace. Every completed workout becomes part of your training history.';
  }

  return 'Make room for recovery. Your workout history is here whenever you want to look back.';
}

function createFallbackUser(): UserRow {
  const now = new Date(0).toISOString();

  return {
    theme_preference: 'system',
    user_id: 'local-user',
    username: 'Local Athlete',
    email: null,
    dob: null,
    height: null,
    height_unit: 'cm',
    weight_unit: 'kg',
    speed_unit: 'kmh',
    distance_unit: 'km',
    created_at: now,
    updated_at: now,
  };
}

function formatMeasurement(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}


function estimateRoutineDuration(routine: RoutineDetail): string {
  const setCount = routine.exercises.reduce((count, exercise) => count + exercise.targets.length, 0);
  const minutes = Math.max(20, Math.round(setCount * 4.5 + routine.exercises.length * 3));

  return `${minutes} min`;
}

function buildFocusLabel(routine: RoutineDetail): string {
  const exerciseNames = routine.exercises.map((exercise) => exercise.exercise.name).slice(0, 3);

  return exerciseNames.length > 0 ? exerciseNames.join(', ') : 'Local workout';
}


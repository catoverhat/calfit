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
  avatarUrl: string | null;
  dateLabel: string;
  greeting: string;
  name: string;
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
    avatarUrl: null,
    dateLabel: formatDashboardDate(date),
    greeting: createGreeting(date),
    name: user.username,
    syncLabel: 'Saved locally',
    routine: planEntry ? mapPlanEntryToDashboardRoutine(planEntry) : null,
    progress,
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
  const state = entry.routine.active !== 1
    ? 'unavailable'
    : entry.session?.status === 'completed'
      ? 'completed'
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
): TodayDashboardData['progress'] {
  const weightUnit = normalizeWeightUnit(user.weight_unit);
  return {
    bodyWeight:
      typeof latestMeasurement?.weight === 'number'
        ? `${formatMeasurement(weightFromCanonical(latestMeasurement.weight, weightUnit))} ${weightUnit}`
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
  const weightUnit = normalizeWeightUnit(user.weight_unit);

  return `${sign}${formatMeasurement(weightFromCanonical(delta, weightUnit))} ${weightUnit} vs previous`;
}

function createDashboardTip(snapshot: DashboardSnapshot | null): string {
  if (!snapshot?.planEntry) {
    return 'Recovery is part of the plan. Assign a workout whenever you are ready.';
  }

  if (!snapshot.latestBodyMeasurement) {
    return 'Log a body measurement to unlock real progress trends.';
  }

  if (snapshot.workoutStreak === 0) {
    return `Start ${snapshot.planEntry.routine.name} to begin your local streak.`;
  }

  return `Local streak active: ${snapshot.workoutStreak} ${snapshot.workoutStreak === 1 ? 'day' : 'days'}.`;
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


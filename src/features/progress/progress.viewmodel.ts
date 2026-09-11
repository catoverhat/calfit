import type {
  BodyMeasurementRow,
  UserRow,
  WorkoutHistoryItem,
  WorkoutSessionDetail,
  WorkoutSessionStatus,
} from '@/db';
import { normalizeWeightUnit, weightFromCanonical, weightToCanonical } from '@/db';
import type { LineSegment } from './components/line-plot';

export type ProgressMetric = { helper: string; label: string; value: string };
export type ChartBar = { label: string; value: number; height: number };
export type ProgressHistoryFilter = 'all' | WorkoutSessionStatus;

export type ProgressHistoryCard = {
  completion: number;
  date: string;
  duration: string;
  exercises: string;
  id: string;
  status: WorkoutSessionStatus;
  statusLabel: string;
  title: string;
  volume: string;
};

export type ProgressHistoryGroup = { label: string; workouts: ProgressHistoryCard[] };

export type MeasurementViewItem = {
  bmi: string;
  bodyFat: string;
  date: string;
  id: string;
  weight: string;
};

export type ProgressDashboardData = {
  avatarUrl: string | null;
  consistencyRows: number[][];
  latestWeight: string;
  metrics: ProgressMetric[];
  profileName: string;
  volumeSegments: LineSegment[];
  volumeTotal: string;
  weeklySessions: ChartBar[];
  weightSegments: LineSegment[];
  weightUnit: string;
};

export type WorkoutSummaryData = {
  exerciseCount: number;
  id: string;
  status: WorkoutSessionStatus;
  statusLabel: string;
  setCount: number;
  title: string;
  duration: string;
  volume: string;
};

export type MeasurementSaveValues = {
  bmi: number | null;
  bodyFatPercentage: number | null;
  createdAt: string;
  weight: number | null;
};

export function createProgressDashboardData(input: {
  history: WorkoutHistoryItem[];
  measurements: BodyMeasurementRow[];
  now?: Date;
  user: UserRow;
}): ProgressDashboardData {
  const { history, measurements, user } = input;
  const now = input.now ?? new Date();
  const weightUnit = normalizeWeightUnit(user.weight_unit);
  const latest = measurements[0] ?? null;
  const completed = history.filter((session) => session.status === 'completed');
  const weightValues = [...measurements]
    .reverse()
    .map((measurement) => measurement.weight === null ? null : weightFromCanonical(measurement.weight, weightUnit))
    .filter((value): value is number => value !== null)
    .slice(-6);
  const volumes = [...completed]
    .reverse()
    .map(calculateWorkoutVolume)
    .filter((volume) => volume > 0)
    .slice(-6);

  return {
    avatarUrl: null,
    consistencyRows: createConsistencyRows(completed, now),
    latestWeight: latest?.weight === null || latest?.weight === undefined ? '—' : formatNumber(weightFromCanonical(latest.weight, weightUnit)),
    metrics: [
      {
        helper: latest ? formatDate(latest.created_at) : 'No measurements yet',
        label: 'BMI',
        value: latest?.bmi === null || latest?.bmi === undefined ? '—' : formatNumber(latest.bmi),
      },
      {
        helper: latest ? formatDate(latest.created_at) : 'No measurements yet',
        label: 'Body Fat %',
        value:
          latest?.body_fat_percentage === null || latest?.body_fat_percentage === undefined
            ? '—'
            : `${formatNumber(latest.body_fat_percentage)}%`,
      },
    ],
    profileName: user.username,
    volumeSegments: createLineSegments(volumes),
    volumeTotal: formatVolume(volumes.reduce((total, value) => total + value, 0), weightUnit),
    weeklySessions: createWeeklySessionBars(completed, now),
    weightSegments: createLineSegments(weightValues),
    weightUnit,
  };
}

export function createMeasurementViewItems(
  measurements: BodyMeasurementRow[],
  weightUnit: string
): MeasurementViewItem[] {
  const unit = normalizeWeightUnit(weightUnit);
  return measurements.map((measurement) => ({
    bmi: measurement.bmi === null ? '—' : formatNumber(measurement.bmi),
    bodyFat:
      measurement.body_fat_percentage === null
        ? '—'
        : `${formatNumber(measurement.body_fat_percentage)}%`,
    date: formatDate(measurement.created_at),
    id: measurement.body_measurement_id,
    weight: measurement.weight === null ? '—' : `${formatNumber(weightFromCanonical(measurement.weight, unit))} ${unit}`,
  }));
}

export function createMeasurementTrendSegments(measurements: BodyMeasurementRow[], weightUnit = 'kg'): LineSegment[] {
  const unit = normalizeWeightUnit(weightUnit);
  const weights = [...measurements]
    .reverse()
    .map((measurement) => measurement.weight === null ? null : weightFromCanonical(measurement.weight, unit))
    .filter((value): value is number => value !== null)
    .slice(-6);
  return createLineSegments(weights);
}

export function createHistoryGroups(
  history: WorkoutHistoryItem[],
  filter: ProgressHistoryFilter,
  weightUnit: string
): ProgressHistoryGroup[] {
  const filtered = filter === 'all' ? history : history.filter((session) => session.status === filter);
  const groups = new Map<string, ProgressHistoryCard[]>();

  for (const session of filtered) {
    const date = sessionDate(session);
    const label = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const workouts = groups.get(label) ?? [];
    workouts.push(mapHistoryCard(session, weightUnit));
    groups.set(label, workouts);
  }

  return Array.from(groups, ([label, workouts]) => ({ label, workouts }));
}

export function createWorkoutSummaryData(
  session: WorkoutSessionDetail,
  weightUnit: string
): WorkoutSummaryData {
  const setCount = session.exercises.reduce((count, exercise) => count + exercise.sets.length, 0);

  return {
    duration: formatDuration(session),
    exerciseCount: session.exercises.length,
    id: session.workout_session_id,
    setCount,
    status: session.status,
    statusLabel: formatStatus(session.status),
    title: session.routine_name ?? 'Workout',
    volume: formatVolume(calculateWorkoutVolume(session), weightUnit),
  };
}

export function validateMeasurementValues(input: {
  bmi: string;
  bodyFat: string;
  date: string;
  weight: string;
}, weightUnit = 'kg'): { error: string; values: null } | { error: null; values: MeasurementSaveValues } {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date)) {
    return { error: 'Use YYYY-MM-DD for the measurement date.', values: null };
  }

  const date = new Date(`${input.date}T12:00:00`);
  if (Number.isNaN(date.getTime()) || formatDateKey(date) !== input.date) {
    return { error: 'Enter a valid measurement date.', values: null };
  }

  const weight = parseOptionalPositiveNumber(input.weight);
  const bmi = parseOptionalPositiveNumber(input.bmi);
  const bodyFatPercentage = parseOptionalPositiveNumber(input.bodyFat);

  if (weight === undefined || bmi === undefined || bodyFatPercentage === undefined) {
    return { error: 'Measurements must be positive numbers.', values: null };
  }
  if (weight === null && bmi === null && bodyFatPercentage === null) {
    return { error: 'Enter at least one measurement.', values: null };
  }
  if (bodyFatPercentage !== null && bodyFatPercentage > 100) {
    return { error: 'Body fat percentage cannot exceed 100.', values: null };
  }

  return {
    error: null,
    values: { bmi, bodyFatPercentage, createdAt: date.toISOString(), weight: weight === null ? null : weightToCanonical(weight, normalizeWeightUnit(weightUnit)) },
  };
}

export function todayDateInput(now = new Date()): string {
  return formatDateKey(now);
}

function mapHistoryCard(session: WorkoutHistoryItem, weightUnit: string): ProgressHistoryCard {
  const sets = session.exercises.flatMap((exercise) => exercise.sets);
  const completedSets = sets.filter((set) => set.completed === 1).length;
  const completion = sets.length === 0 ? 0 : Math.round((completedSets / sets.length) * 100);
  const date = sessionDate(session);

  return {
    completion,
    date: formatDate(date.toISOString()),
    duration: formatDuration(session),
    exercises: `${session.exercises.length}`,
    id: session.workout_session_id,
    status: session.status,
    statusLabel: formatStatus(session.status),
    title: session.routine_name ?? 'Workout',
    volume: formatVolume(calculateWorkoutVolume(session), weightUnit),
  };
}

function calculateWorkoutVolume(session: WorkoutHistoryItem | WorkoutSessionDetail): number {
  return session.exercises.reduce(
    (total, exercise) =>
      total +
      exercise.sets.reduce(
        (setTotal, set) =>
          setTotal + (set.completed === 1 && set.reps !== null && set.weight !== null ? set.reps * set.weight : 0),
        0
      ),
    0
  );
}

function formatDuration(session: WorkoutHistoryItem | WorkoutSessionDetail): string {
  if (!session.started_at) return '—';
  const end = session.completed_at ? new Date(session.completed_at) : new Date();
  const minutes = Math.max(0, Math.round((end.getTime() - new Date(session.started_at).getTime()) / 60000));
  return `${minutes}m`;
}

function formatStatus(status: WorkoutSessionStatus): string {
  return status.replace('_', ' ').replace(/^./, (letter) => letter.toUpperCase());
}

function sessionDate(session: WorkoutHistoryItem | WorkoutSessionDetail): Date {
  return new Date(session.completed_at ?? session.started_at ?? session.scheduled_for ?? session.created_at);
}

function createWeeklySessionBars(history: WorkoutHistoryItem[], now: Date): ChartBar[] {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (6 - index));
    const key = formatDateKey(date);
    const value = history.filter((session) => formatDateKey(sessionDate(session)) === key).length;
    return { label: date.toLocaleDateString('en-US', { weekday: 'short' }), value, height: Math.min(152, 20 + value * 32) };
  });
}

function createConsistencyRows(history: WorkoutHistoryItem[], now: Date): number[][] {
  const counts = new Map<string, number>();
  history.forEach((session) => {
    const key = formatDateKey(sessionDate(session));
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });

  return Array.from({ length: 6 }, (_, row) =>
    Array.from({ length: 22 }, (_, column) => {
      const daysAgo = (21 - column) * 7 + (5 - row);
      const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysAgo);
      return Math.min(3, counts.get(formatDateKey(date)) ?? 0);
    })
  );
}

function createLineSegments(values: number[]): LineSegment[] {
  if (values.length < 2) return [];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  return values.slice(0, -1).map((value, index) => {
    const next = values[index + 1];
    const top = 82 - ((value - min) / range) * 64;
    const nextTop = 82 - ((next - min) / range) * 64;
    const rotate = Math.max(-35, Math.min(35, (nextTop - top) * 0.65));
    return {
      left: `${7 + index * (86 / (values.length - 1))}%` as `${number}%`,
      rotate: `${rotate}deg` as `${number}deg`,
      top: `${top}%` as `${number}%`,
      width: 48,
    };
  });
}

function parseOptionalPositiveNumber(value: string): number | null | undefined {
  if (!value.trim()) return null;
  const parsed = Number(value.replace(',', '.'));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(value);
}

function formatVolume(value: number, unit: string): string {
  const normalized = normalizeWeightUnit(unit);
  const displayValue = weightFromCanonical(value, normalized);
  return value === 0 ? '—' : `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(displayValue)} ${normalized}`;
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

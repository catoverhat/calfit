import type {
  BodyMeasurementRow,
  UserRow,
  WeightUnit,
  WorkoutHistoryItem,
  WorkoutSessionDetail,
  WorkoutSessionStatus,
} from '@/db';
import { calculateBmi, normalizeWeightUnit, weightFromCanonical, weightToCanonical } from '@/db';
import { createTrendSegments, type LineSegment } from './trend-chart';

export type ProgressMetric = { helper: string; label: string; value: string };
export type ChartBar = { label: string; description: string; value: number; height: number };
export type ProgressPeriod = 7 | 30 | 90;
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

export type LiftProgress = {
  change: string;
  id: string;
  latest: string;
  name: string;
  segments: LineSegment[];
};

export type ProgressDashboardData = {
  avatarUrl: string | null;
  lifts: LiftProgress[];
  consistencyRows: (number | null)[][];
  consistencySummary: string;
  periodLabel: string;
  sessionCount: number;
  sessionSummary: string;
  trainingMetrics: ProgressMetric[];
  volumeSummary: string;
  weightSummary: string;
  weightRangeLabel: string;
  latestWeight: string;
  metrics: ProgressMetric[];
  profileName: string;
  volumeSegments: LineSegment[];
  volumeTotal: string;
  weeklySessions: ChartBar[];
  weightSegments: LineSegment[];
  weightUnit: string;
};

export type WorkoutSummaryExercise = {
  best: string | null;
  id: string;
  isRecord: boolean;
  name: string;
  sets: string;
};

export type WorkoutSummaryData = {
  completedSetCount: number;
  exerciseCount: number;
  exercises: WorkoutSummaryExercise[];
  id: string;
  recordCount: number;
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
  period?: ProgressPeriod;
  user: UserRow;
}): ProgressDashboardData {
  const { history, measurements, user } = input;
  const now = input.now ?? new Date();
  const weightUnit = normalizeWeightUnit(user.weight_unit);
  const latest = measurements[0] ?? null;
  const allCompleted = history.filter((session) => session.status === 'completed');
  const period = input.period ?? 7;
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - period + 1);
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const completed = allCompleted
    .filter((session) => sessionDate(session) >= start && sessionDate(session) < end)
    .sort((left, right) => sessionDate(left).getTime() - sessionDate(right).getTime());
  const trainingDays = new Set(completed.map((session) => formatDateKey(sessionDate(session)))).size;
  const weightMeasurements = [...measurements]
    .filter((measurement) => measurement.weight !== null)
    .sort((left, right) => new Date(left.created_at).getTime() - new Date(right.created_at).getTime())
    .slice(-6);
  const latestWeight = weightMeasurements.at(-1);
  const weightValues = weightMeasurements.map((measurement) => weightFromCanonical(measurement.weight!, weightUnit));
  const volumes = completed.map(calculateWorkoutVolume).filter((volume) => volume > 0);
  const totalVolume = volumes.reduce((total, value) => total + value, 0);
  const periodLabel = `Last ${period} days`;

  return {
    avatarUrl: null,
    lifts: createLiftProgress(allCompleted, weightUnit),
    consistencyRows: createConsistencyRows(allCompleted, now),
    consistencySummary: createConsistencySummary(allCompleted, now),
    periodLabel,
    sessionCount: completed.length,
    sessionSummary: completed.length === 0
      ? `No completed workouts in the last ${period} days.`
      : `${completed.length} completed ${completed.length === 1 ? 'workout' : 'workouts'} across ${trainingDays} training ${trainingDays === 1 ? 'day' : 'days'}.`,
    trainingMetrics: [
      { label: 'Workouts', value: String(completed.length), helper: 'Completed in this period' },
      { label: 'Training days', value: String(trainingDays), helper: `Of ${period} days in this period` },
    ],
    latestWeight: latestWeight ? formatNumber(weightFromCanonical(latestWeight.weight!, weightUnit)) : '—',
    weightSummary: weightValues.length < 2
      ? 'Add at least two weight measurements to see a trend.'
      : `From ${formatNumber(weightValues[0])} to ${formatNumber(weightValues.at(-1)!)} ${weightUnit} across ${weightValues.length} measurements.`,
    weightRangeLabel: weightMeasurements.length > 0
      ? `${formatDate(weightMeasurements[0].created_at)} – ${formatDate(latestWeight!.created_at)}`
      : 'No measurements yet',
    volumeSummary: volumes.length === 0
      ? 'Complete weighted sets to track your lifting volume.'
      : `${formatVolume(totalVolume, weightUnit)} lifted across ${volumes.length} weighted ${volumes.length === 1 ? 'workout' : 'workouts'}.`,

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
    volumeSegments: createTrendSegments(volumes),
    volumeTotal: formatVolume(totalVolume, weightUnit),
    weeklySessions: createPeriodSessionBars(completed, start, period),
    weightSegments: createTrendSegments(weightValues),
    weightUnit,
  };
}

/** Rows saved without a BMI (e.g. weight from Profile) show one calculated from `heightCm`. */
export function createMeasurementViewItems(
  measurements: BodyMeasurementRow[],
  weightUnit: string,
  heightCm: number | null = null
): MeasurementViewItem[] {
  const unit = normalizeWeightUnit(weightUnit);
  return measurements.map((measurement) => {
    const bmi = measurement.bmi ?? calculateBmi(measurement.weight, heightCm);
    return {
      bmi: bmi === null ? '—' : formatNumber(bmi),
      bodyFat:
        measurement.body_fat_percentage === null
          ? '—'
          : `${formatNumber(measurement.body_fat_percentage)}%`,
      date: formatDate(measurement.created_at),
      id: measurement.body_measurement_id,
      weight: measurement.weight === null ? '—' : `${formatNumber(weightFromCanonical(measurement.weight, unit))} ${unit}`,
    };
  });
}

export function createMeasurementTrendSegments(measurements: BodyMeasurementRow[], weightUnit = 'kg'): LineSegment[] {
  const unit = normalizeWeightUnit(weightUnit);
  const weights = [...measurements]
    .reverse()
    .map((measurement) => measurement.weight === null ? null : weightFromCanonical(measurement.weight, unit))
    .filter((value): value is number => value !== null)
    .slice(-6);
  return createTrendSegments(weights);
}

export const HISTORY_FILTERS: { id: ProgressHistoryFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'completed', label: 'Completed' },
  { id: 'in_progress', label: 'In progress' },
];

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

/** `previousBestWeights` holds canonical best weights from earlier sessions, keyed by exercise id. */
export function createWorkoutSummaryData(
  session: WorkoutSessionDetail,
  weightUnit: string,
  previousBestWeights: Map<string, number> = new Map()
): WorkoutSummaryData {
  const unit = normalizeWeightUnit(weightUnit);
  const setCount = session.exercises.reduce((count, exercise) => count + exercise.sets.length, 0);
  const exercises = session.exercises.map((exercise): WorkoutSummaryExercise => {
    const logged = exercise.sets.filter((set) => set.completed === 1);
    const top = [...logged].sort(
      (left, right) => (right.weight ?? 0) - (left.weight ?? 0) || (right.reps ?? 0) - (left.reps ?? 0)
    )[0];
    const previousBest = previousBestWeights.get(exercise.exercise_id_fk);
    let best: string | null = null;
    if (top?.weight != null) {
      const weight = `${formatNumber(weightFromCanonical(top.weight, unit))} ${unit}`;
      best = top.reps === null ? weight : `${weight} × ${top.reps}`;
    } else if (top?.reps != null) {
      best = `${top.reps} reps`;
    }
    return {
      best,
      id: exercise.workout_exercise_id,
      // A first-ever attempt has nothing to beat, so it is not flagged as a record.
      isRecord: top?.weight != null && previousBest !== undefined && top.weight > previousBest,
      name: exercise.exercise.name,
      sets: `${logged.length} of ${exercise.sets.length} sets`,
    };
  });

  return {
    completedSetCount: session.exercises.flatMap((exercise) => exercise.sets).filter((set) => set.completed === 1).length,
    duration: formatDuration(session),
    exerciseCount: session.exercises.length,
    exercises,
    id: session.workout_session_id,
    recordCount: exercises.filter((exercise) => exercise.isRecord).length,
    setCount,
    status: session.status,
    statusLabel: formatStatus(session.status),
    title: session.routine_name ?? 'Workout',
    volume: formatVolume(calculateWorkoutVolume(session), weightUnit),
  };
}

/** `heightCm` (from the profile) fills a blank BMI from the entered weight. */
export function validateMeasurementValues(input: {
  bmi: string;
  bodyFat: string;
  date: string;
  weight: string;
}, weightUnit = 'kg', heightCm: number | null = null): { error: string; values: null } | { error: null; values: MeasurementSaveValues } {
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

  const weightKg = weight === null ? null : weightToCanonical(weight, normalizeWeightUnit(weightUnit));

  return {
    error: null,
    values: { bmi: bmi ?? calculateBmi(weightKg, heightCm), bodyFatPercentage, createdAt: date.toISOString(), weight: weightKg },
  };
}

/** Live BMI for the form while the athlete types a weight; null until it can be calculated. */
export function previewBmi(weight: string, weightUnit: string, heightCm: number | null): string | null {
  const parsed = parseOptionalPositiveNumber(weight);
  if (parsed === null || parsed === undefined) return null;
  const bmi = calculateBmi(weightToCanonical(parsed, normalizeWeightUnit(weightUnit)), heightCm);
  return bmi === null ? null : formatNumber(bmi);
}

export function measurementDateInput(daysAgo: number, now = new Date()): string {
  return formatDateKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysAgo));
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

const LIFT_LIMIT = 4;
const LIFT_TREND_SESSIONS = 8;

/** Top completed set weight per session for the most-trained weighted exercises. */
function createLiftProgress(completed: WorkoutHistoryItem[], weightUnit: WeightUnit): LiftProgress[] {
  const byExercise = new Map<string, { name: string; tops: { date: number; weight: number }[] }>();
  for (const session of completed) {
    for (const exercise of session.exercises) {
      const weights = exercise.sets
        .filter((set) => set.completed === 1 && set.weight !== null && set.weight > 0)
        .map((set) => set.weight as number);
      if (weights.length === 0) continue;
      const entry = byExercise.get(exercise.exercise_id_fk) ?? { name: exercise.exercise.name, tops: [] };
      entry.tops.push({ date: sessionDate(session).getTime(), weight: Math.max(...weights) });
      byExercise.set(exercise.exercise_id_fk, entry);
    }
  }

  return [...byExercise]
    .sort(([, left], [, right]) => right.tops.length - left.tops.length)
    .slice(0, LIFT_LIMIT)
    .map(([id, { name, tops }]) => {
      const values = [...tops]
        .sort((left, right) => left.date - right.date)
        .slice(-LIFT_TREND_SESSIONS)
        .map((top) => weightFromCanonical(top.weight, weightUnit));
      const delta = values.at(-1)! - values[0];
      let change = 'First weighted session logged';
      if (values.length > 1) {
        change = Math.abs(delta) < 0.05
          ? `Holding steady over ${values.length} sessions`
          : `${delta > 0 ? '+' : '−'}${formatNumber(Math.abs(delta))} ${weightUnit} over ${values.length} sessions`;
      }
      return { change, id, latest: `${formatNumber(values.at(-1)!)} ${weightUnit}`, name, segments: createTrendSegments(values) };
    });
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

function createPeriodSessionBars(history: WorkoutHistoryItem[], start: Date, period: ProgressPeriod): ChartBar[] {
  const bucketSize = period === 7 ? 1 : period === 30 ? 5 : 15;
  const bars = Array.from({ length: period / bucketSize }, (_, index) => {
    const bucketStart = new Date(start.getFullYear(), start.getMonth(), start.getDate() + index * bucketSize);
    const bucketEnd = new Date(bucketStart.getFullYear(), bucketStart.getMonth(), bucketStart.getDate() + bucketSize);
    const value = history.filter((session) => sessionDate(session) >= bucketStart && sessionDate(session) < bucketEnd).length;
    const label = bucketStart.toLocaleDateString('en-US', period === 7 ? { weekday: 'short' } : { month: 'short', day: 'numeric' });
    const lastDate = new Date(bucketEnd.getFullYear(), bucketEnd.getMonth(), bucketEnd.getDate() - 1);
    return {
      label,
      description: `${formatDate(bucketStart.toISOString())}${bucketSize === 1 ? '' : ` through ${formatDate(lastDate.toISOString())}`}: ${value} completed ${value === 1 ? 'workout' : 'workouts'}`,
      value,
    };
  });
  const max = Math.max(1, ...bars.map((bar) => bar.value));
  return bars.map((bar) => ({ ...bar, height: bar.value === 0 ? 2 : Math.round((bar.value / max) * 112) }));
}

function consistencyStart(now: Date): Date {
  const weekday = (now.getDay() + 6) % 7;
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() - weekday - 12 * 7);
}

function createConsistencyRows(history: WorkoutHistoryItem[], now: Date): (number | null)[][] {
  const counts = new Map<string, number>();
  history.forEach((session) => {
    const key = formatDateKey(sessionDate(session));
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });
  const start = consistencyStart(now);
  const today = formatDateKey(now);

  return Array.from({ length: 7 }, (_, weekday) =>
    Array.from({ length: 13 }, (_, week) => {
      const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + week * 7 + weekday);
      const key = formatDateKey(date);
      return key > today ? null : Math.min(3, counts.get(key) ?? 0);
    })
  );
}

function createConsistencySummary(history: WorkoutHistoryItem[], now: Date): string {
  const start = consistencyStart(now);
  const today = formatDateKey(now);
  const days = new Set(history
    .filter((session) => sessionDate(session) >= start && formatDateKey(sessionDate(session)) <= today)
    .map((session) => formatDateKey(sessionDate(session)))).size;
  return `${days} training ${days === 1 ? 'day' : 'days'} in the last 13 weeks, including this week.`;
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

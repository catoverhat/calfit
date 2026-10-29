import {
  distanceFromCanonical,
  normalizeDistanceUnit,
  normalizeSpeedUnit,
  normalizeWeightUnit,
  speedFromCanonical,
  weightFromCanonical,
  type DistanceUnit,
  type PreviousSetPerformance,
  type SpeedUnit,
  type UserRow,
  type WeightUnit,
  type WorkoutSessionDetail,
  type WorkoutSessionStatus,
} from '@/db';

export type WorkoutMetricField = 'reps' | 'weight' | 'speed' | 'duration' | 'distance';

export interface WorkoutSessionSetViewModel {
  completed: boolean;
  completedAt: string | null;
  distance: string;
  duration: string;
  fields: WorkoutMetricField[];
  id: string;
  /** What this set number achieved in the exercise's last completed session. */
  previous: string | null;
  reps: string;
  restTimeSeconds: number;
  setNumber: number;
  speed: string;
  weight: string;
}

export interface WorkoutSessionExerciseViewModel {
  description: string | null;
  id: string;
  imageUrl: string | null;
  name: string;
  sets: WorkoutSessionSetViewModel[];
  videoUrl: string | null;
}

export interface WorkoutSessionViewModel {
  completedAt: string | null;
  createdAt: string;
  distanceUnit: DistanceUnit;
  exercises: WorkoutSessionExerciseViewModel[];
  id: string;
  scheduledFor: string | null;
  startedAt: string | null;
  status: WorkoutSessionStatus;
  title: string;
  speedUnit: SpeedUnit;
  weightUnit: WeightUnit;
}

export function mapWorkoutSessionToViewModel(
  session: WorkoutSessionDetail,
  user: UserRow,
  previous: Map<string, PreviousSetPerformance[]> = new Map()
): WorkoutSessionViewModel {
  const weightUnit = normalizeWeightUnit(user.weight_unit);
  const speedUnit = normalizeSpeedUnit(user.speed_unit);
  const distanceUnit = normalizeDistanceUnit(user.distance_unit);
  const units = { distanceUnit, speedUnit, weightUnit };

  return {
    completedAt: session.completed_at,
    createdAt: session.created_at,
    distanceUnit,
    exercises: session.exercises.map((item) => ({
      description: item.exercise.description,
      id: item.workout_exercise_id,
      imageUrl: item.exercise.image_url,
      name: item.exercise.name,
      sets: item.sets.map((set) => ({
        completed: set.completed === 1,
        completedAt: set.completed_at,
        distance: displayValue(set.distance, (value) => distanceFromCanonical(value, distanceUnit)),
        duration: displayValue(set.duration_seconds),
        fields: relevantFields(set),
        id: set.workout_set_id,
        previous: formatPrevious(
          previous.get(item.exercise_id_fk)?.find((row) => row.set_number === set.set_number),
          units
        ),
        reps: displayValue(set.reps),
        restTimeSeconds: set.rest_time_seconds ?? 0,
        setNumber: set.set_number,
        speed: displayValue(set.speed, (value) => speedFromCanonical(value, speedUnit)),
        weight: displayValue(set.weight, (value) => weightFromCanonical(value, weightUnit)),
      })),
      videoUrl: item.exercise.video_url,
    })),
    id: session.workout_session_id,
    scheduledFor: session.scheduled_for,
    startedAt: session.started_at,
    status: session.status,
    title: session.routine_name ?? 'Local Workout',
    speedUnit,
    weightUnit,
  };
}

function relevantFields(
  set: WorkoutSessionDetail['exercises'][number]['sets'][number]
): WorkoutMetricField[] {
  const fields: WorkoutMetricField[] = [];
  if (set.reps !== null) fields.push('reps');
  if (set.weight !== null) fields.push('weight');
  if (set.speed !== null) fields.push('speed');
  if (set.duration_seconds !== null) fields.push('duration');
  if (set.distance !== null) fields.push('distance');
  return fields.length > 0 ? fields : ['reps', 'weight'];
}

function formatPrevious(
  row: PreviousSetPerformance | undefined,
  units: { distanceUnit: DistanceUnit; speedUnit: SpeedUnit; weightUnit: WeightUnit }
): string | null {
  if (!row) return null;
  const weight = displayValue(row.weight, (value) => weightFromCanonical(value, units.weightUnit));
  const parts: string[] = [];
  if (weight && row.reps !== null) parts.push(`${weight} ${units.weightUnit} × ${row.reps}`);
  else if (weight) parts.push(`${weight} ${units.weightUnit}`);
  else if (row.reps !== null) parts.push(`${row.reps} reps`);
  if (row.duration_seconds !== null) parts.push(`${row.duration_seconds} sec`);
  if (row.distance !== null) {
    parts.push(`${displayValue(row.distance, (value) => distanceFromCanonical(value, units.distanceUnit))} ${units.distanceUnit}`);
  }
  if (row.speed !== null) {
    parts.push(`${displayValue(row.speed, (value) => speedFromCanonical(value, units.speedUnit))} ${units.speedUnit === 'kmh' ? 'km/h' : 'mph'}`);
  }
  return parts.length > 0 ? parts.join(' · ') : null;
}

function displayValue(value: number | null, convert: (value: number) => number = (item) => item): string {
  if (value === null) return '';
  const converted = convert(value);
  return String(Math.round(converted * 100) / 100);
}

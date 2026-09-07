import type { RoutineDetail, RoutineSummary } from '@/db';

export const WEEKDAYS = [
  { day: 0, label: 'S', longLabel: 'Sunday' },
  { day: 1, label: 'M', longLabel: 'Monday' },
  { day: 2, label: 'T', longLabel: 'Tuesday' },
  { day: 3, label: 'W', longLabel: 'Wednesday' },
  { day: 4, label: 'T', longLabel: 'Thursday' },
  { day: 5, label: 'F', longLabel: 'Friday' },
  { day: 6, label: 'S', longLabel: 'Saturday' },
] as const;

export interface RoutineSummaryViewModel {
  active: boolean;
  description: string;
  exerciseCount: number;
  focus: 'cardio' | 'strength';
  id: string;
  imageUrl: string | null;
  lastCompleted: string;
  schedule: { day: number; label: string; longLabel: string }[];
  setCount: number;
  title: string;
}

export function mapRoutineSummary(row: RoutineSummary): RoutineSummaryViewModel {
  return {
    active: row.active === 1,
    description: row.description ?? 'No description yet.',
    exerciseCount: row.exercise_count,
    focus: row.focus,
    id: row.routine_id,
    imageUrl: row.image_url,
    lastCompleted: formatCompletion(row.last_completed_at),
    schedule: row.schedule_days.map((day) => WEEKDAYS[day]).filter(Boolean),
    setCount: row.set_count,
    title: row.name,
  };
}

export function getRoutineTotals(routine: RoutineDetail): {
  exerciseCount: number;
  setCount: number;
} {
  return {
    exerciseCount: routine.exercises.length,
    setCount: routine.exercises.reduce((total, exercise) => total + exercise.targets.length, 0),
  };
}

function formatCompletion(value: string | null): string {
  if (!value) return 'Never completed';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Completed previously';
  return `Last completed ${new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() === new Date().getFullYear() ? undefined : 'numeric',
  }).format(date)}`;
}

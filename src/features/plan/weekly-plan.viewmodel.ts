import type { RoutineDetail, RoutineSummary, WorkoutPlanEntryDetail } from '@/db';
import {
  compareDateKeys,
  getIsoWeekDateKeys,
  parseLocalDateKey,
  toLocalDateKey,
} from './plan-calendar';

export type PlanEntryState =
  | 'assigned'
  | 'completed'
  | 'in_progress'
  | 'missed'
  | 'rest'
  | 'unavailable';

export interface WorkoutDefinition {
  active: boolean;
  description: string;
  exerciseCount: number;
  focus: 'cardio' | 'strength';
  id: string;
  title: string;
}

export interface WorkoutPlanDay {
  date: string;
  dateLabel: string;
  editable: boolean;
  entryId: string | null;
  isToday: boolean;
  state: PlanEntryState;
  stateLabel: string;
  weekday: string;
  workout: {
    description: string;
    duration: string;
    exerciseCount: number;
    id: string;
    title: string;
  } | null;
}

export interface WorkoutPlanWeek {
  days: WorkoutPlanDay[];
  isEmpty: boolean;
  week: number;
  year: number;
}

export function createWorkoutPlanWeek(
  entries: WorkoutPlanEntryDetail[],
  year: number,
  week: number,
  today = new Date()
): WorkoutPlanWeek {
  const todayKey = toLocalDateKey(today);
  const entryByDate = new Map(entries.map((entry) => [entry.planned_date, entry]));
  const days = getIsoWeekDateKeys(year, week).map((date): WorkoutPlanDay => {
    const entry = entryByDate.get(date) ?? null;
    const state = getPlanEntryState(entry, date, todayKey);
    const sessionLocked = entry?.session?.status === 'completed' || entry?.session?.status === 'in_progress';
    return {
      date,
      dateLabel: parseLocalDateKey(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      editable: compareDateKeys(date, todayKey) >= 0 && !sessionLocked,
      entryId: entry?.workout_plan_entry_id ?? null,
      isToday: date === todayKey,
      state,
      stateLabel: formatState(state),
      weekday: parseLocalDateKey(date).toLocaleDateString('en-US', { weekday: 'long' }),
      workout: entry ? mapRoutine(entry.routine) : null,
    };
  });
  return { days, isEmpty: days.every((day) => day.entryId === null), week, year };
}

export function mapWorkoutDefinitions(routines: RoutineSummary[]): WorkoutDefinition[] {
  return routines.map((routine) => ({
    active: routine.active === 1,
    description: routine.description ?? 'Reusable workout',
    exerciseCount: routine.exercise_count,
    focus: routine.focus,
    id: routine.routine_id,
    title: routine.name,
  }));
}

export function getPlanEntryState(
  entry: WorkoutPlanEntryDetail | null,
  date: string,
  today: string
): PlanEntryState {
  if (!entry) return 'rest';
  if (entry.session?.status === 'completed') return 'completed';
  if (entry.session?.status === 'in_progress') return 'in_progress';
  if (entry.routine.active !== 1) return 'unavailable';
  if (date < today) return 'missed';
  return 'assigned';
}

function mapRoutine(routine: RoutineDetail): NonNullable<WorkoutPlanDay['workout']> {
  return {
    description: routine.description ?? 'Reusable workout',
    duration: estimateRoutineDuration(routine),
    exerciseCount: routine.exercises.length,
    id: routine.routine_id,
    title: routine.name,
  };
}

function estimateRoutineDuration(routine: RoutineDetail): string {
  const sets = routine.exercises.reduce((total, exercise) => total + exercise.targets.length, 0);
  return `${Math.max(20, Math.round(sets * 4.5 + routine.exercises.length * 3))} min`;
}

function formatState(state: PlanEntryState): string {
  return {
    assigned: 'Assigned',
    completed: 'Completed',
    in_progress: 'In progress',
    missed: 'Missed',
    rest: 'Rest',
    unavailable: 'Unavailable',
  }[state];
}

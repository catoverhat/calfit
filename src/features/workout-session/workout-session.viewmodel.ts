import type { WorkoutSessionDetail } from '@/db';

export interface WorkoutSessionViewModel {
  id: string;
  title: string;
  duration: string;
  intensity: string;
  imageUrl: string | null;
  description: string;
  exercises: { id: string; name: string; sets: number; reps: string }[];
}

export function mapWorkoutSessionToViewModel(session: WorkoutSessionDetail): WorkoutSessionViewModel {
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
    imageUrl: session.exercises.find((exercise) => exercise.exercise.image_url)?.exercise.image_url ?? null,
    description: `Local workout session with ${exercises.length} exercises.`,
    exercises,
  };
}

function estimateSessionDuration(session: WorkoutSessionDetail): string {
  if (session.started_at && session.completed_at) {
    const elapsedMinutes = Math.round((new Date(session.completed_at).getTime() - new Date(session.started_at).getTime()) / 60000);
    if (elapsedMinutes > 0) return `${elapsedMinutes} min`;
  }
  const setCount = session.exercises.reduce((count, exercise) => count + exercise.sets.length, 0);
  return `${Math.max(20, Math.round(setCount * 4.5))} min`;
}

function formatSetTargets(sets: WorkoutSessionDetail['exercises'][number]['sets']): string {
  const reps = sets.map((set) => set.reps).filter((value): value is number => typeof value === 'number');
  if (reps.length === 0) return 'Target sets';
  const min = Math.min(...reps);
  const max = Math.max(...reps);
  return min === max ? `${min} reps` : `${min}-${max} reps`;
}

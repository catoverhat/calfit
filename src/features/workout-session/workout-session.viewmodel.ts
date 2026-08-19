import { MOCK_WORKOUTS } from '@/fixtures/mock-data';
import type { WorkoutSessionDetail } from '@/db';

type MockWorkout = (typeof MOCK_WORKOUTS)[number];

export interface WorkoutSessionViewModel {
  id: string;
  title: string;
  duration: string;
  intensity: string;
  imageUrl: string;
  description: string;
  exercises: { id: string; name: string; sets: number; reps: string }[];
}

const fallbackWorkout = MOCK_WORKOUTS[0];

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
    imageUrl: fallbackWorkout.imageUrl,
    description: `Local workout session saved on this device with ${exercises.length} exercises.`,
    exercises: exercises.length > 0 ? exercises : [...fallbackWorkout.exercises],
  };
}

export function mapMockWorkoutToViewModel(
  workout: MockWorkout = fallbackWorkout
): WorkoutSessionViewModel {
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

function formatSetTargets(sets: WorkoutSessionDetail['exercises'][number]['sets']): string {
  const reps = sets.map((set) => set.reps).filter((value): value is number => typeof value === 'number');

  if (reps.length === 0) {
    return 'Target sets';
  }

  const min = Math.min(...reps);
  const max = Math.max(...reps);

  return min === max ? `${min} reps` : `${min}-${max} reps`;
}

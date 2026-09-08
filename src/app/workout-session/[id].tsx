import { useLocalSearchParams } from 'expo-router';

import { ActiveWorkoutSessionScreen } from '@/features/workout-session/active-workout-session-screen';
import { WorkoutSessionStatusScreen } from '@/features/workout-session/workout-session-status-screen';
import { useWorkoutSessionData } from '@/features/workout-session/use-workout-session-data';

export default function WorkoutSessionRoute() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const sessionId = Array.isArray(id) ? id[0] : id;
  const { error, isLoading, workout } = useWorkoutSessionData(sessionId);

  if (isLoading) {
    return <WorkoutSessionStatusScreen body="Loading your local workout session." title="Preparing Session" />;
  }

  if (!workout || workout.exercises.length === 0) {
    return <WorkoutSessionStatusScreen body={error ?? 'Workout session not found.'} title="Session Unavailable" />;
  }

  return <ActiveWorkoutSessionScreen workout={workout} />;
}

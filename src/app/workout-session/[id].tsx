import { Redirect, router, useLocalSearchParams } from 'expo-router';

import { ActiveWorkoutSessionScreen } from '@/features/workout-session/active-workout-session-screen';
import { WorkoutSessionStatusScreen } from '@/features/workout-session/workout-session-status-screen';
import { useWorkoutSessionData } from '@/features/workout-session/use-workout-session-data';

export default function WorkoutSessionRoute() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const sessionId = Array.isArray(id) ? id[0] : id;
  const { error, isLoading, reload, workout } = useWorkoutSessionData(sessionId);

  if (isLoading) {
    return <WorkoutSessionStatusScreen body="Loading your local workout session." title="Preparing session" />;
  }

  if (!workout || workout.exercises.length === 0) {
    return <WorkoutSessionStatusScreen body={error ?? 'Workout session not found.'} onBack={() => router.canGoBack() ? router.back() : router.replace('/(tabs)')} onRetry={sessionId ? reload : undefined} title="Session unavailable" />;
  }

  if (workout.status === 'completed') {
    return <Redirect href={{ pathname: '/progress/summary', params: { sessionId: workout.id } }} />;
  }

  return <ActiveWorkoutSessionScreen onReload={reload} workout={workout} />;
}

import { useLocalSearchParams } from 'expo-router';

import { ActiveWorkoutSessionScreen } from '@/features/workout-session/active-workout-session-screen';
import { WorkoutSessionStatusScreen } from '@/features/workout-session/workout-session-status-screen';
import { MOCK_WORKOUTS } from '@/fixtures/mock-data';
import { useWorkoutSessionData } from '@/features/workout-session/use-workout-session-data';

export function generateStaticParams() {
  return MOCK_WORKOUTS.map(({ id }) => ({ id }));
}

export default function WorkoutSessionRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { error, isLoading, workout } = useWorkoutSessionData(id);

  if (isLoading) {
    return <WorkoutSessionStatusScreen body="Loading your local workout session." title="Preparing Session" />;
  }

  if (!workout) {
    return <WorkoutSessionStatusScreen body={error ?? 'Workout session not found.'} title="Session Unavailable" />;
  }

  return <ActiveWorkoutSessionScreen workout={workout} />;
}

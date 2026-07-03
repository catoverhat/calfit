import { useLocalSearchParams } from 'expo-router';

import { ActiveWorkoutSessionScreen } from '@/components/workouts/active-workout-session-screen';
import { MOCK_WORKOUTS } from '@/constants/mock-data';

export function generateStaticParams() {
  return MOCK_WORKOUTS.map(({ id }) => ({ id }));
}

export default function WorkoutSessionRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const workout = MOCK_WORKOUTS.find((item) => item.id === id) ?? MOCK_WORKOUTS[0];

  return <ActiveWorkoutSessionScreen workout={workout} />;
}

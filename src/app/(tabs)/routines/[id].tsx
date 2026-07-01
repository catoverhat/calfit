import { useLocalSearchParams } from 'expo-router';

import { WorkoutDetailScreen } from '@/components/workouts/workout-detail-screen';
import { MOCK_WORKOUTS } from '@/constants/mock-data';

export function generateStaticParams() {
  return MOCK_WORKOUTS.map(({ id }) => ({ id }));
}

export default function RoutineDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const workout = MOCK_WORKOUTS.find((item) => item.id === id);

  return <WorkoutDetailScreen workout={workout} />;
}

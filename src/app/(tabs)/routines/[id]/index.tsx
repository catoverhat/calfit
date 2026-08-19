import { useLocalSearchParams } from 'expo-router';

import { RoutineDetailScreen } from '@/features/routines/routine-detail-screen';
import { MOCK_WORKOUTS } from '@/fixtures/mock-data';

export function generateStaticParams() {
  return MOCK_WORKOUTS.map(({ id }) => ({ id }));
}

export default function RoutineDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const workout = MOCK_WORKOUTS.find((item) => item.id === id);

  return <RoutineDetailScreen workout={workout} />;
}

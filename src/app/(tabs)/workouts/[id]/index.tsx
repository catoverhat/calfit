import { useLocalSearchParams } from 'expo-router';

import { RoutineDetailScreen } from '@/features/routines/routine-detail-screen';

export default function WorkoutDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <RoutineDetailScreen routineId={id} />;
}

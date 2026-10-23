import { Redirect, type Href, useLocalSearchParams } from 'expo-router';

export default function RoutineDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <Redirect href={{ pathname: '/workouts/[id]', params: { id } } as unknown as Href} />;
}

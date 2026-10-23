import { Redirect, type Href, useLocalSearchParams } from 'expo-router';

export default function EditRoutineRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <Redirect href={{ pathname: '/workouts/[id]/edit', params: { id } } as unknown as Href} />;
}

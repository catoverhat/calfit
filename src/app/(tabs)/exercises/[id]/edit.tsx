import { Redirect, type Href, useLocalSearchParams } from 'expo-router';

export default function EditExerciseRoute() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const exerciseId = Array.isArray(id) ? id[0] : id;
  return <Redirect href={{ pathname: '/workouts/exercises/[id]/edit', params: { id: exerciseId } } as unknown as Href} />;
}

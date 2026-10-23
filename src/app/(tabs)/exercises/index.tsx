import { Redirect, type Href } from 'expo-router';

export default function ExercisesScreen() {
  return <Redirect href={'/workouts/exercises' as Href} />;
}

import { Redirect, type Href } from 'expo-router';

export default function RoutinesRoute() {
  return <Redirect href={'/workouts' as Href} />;
}

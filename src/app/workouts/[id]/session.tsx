import { router, useLocalSearchParams } from 'expo-router';
import { Alert } from 'react-native';

import { WorkoutSessionScreen } from '@/components/workouts/workout-session-screen';
import { MOCK_WORKOUTS } from '@/constants/mock-data';

export function generateStaticParams() {
  return MOCK_WORKOUTS.map(({ id }) => ({ id }));
}

export default function WorkoutSessionRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const workout = MOCK_WORKOUTS.find((item) => item.id === id);

  const finishWorkout = () => {
    const returnToWorkouts = () => router.replace('/workouts');

    if (process.env.EXPO_OS === 'web') {
      if (globalThis.confirm('Finish this workout? Your completed sets will not be saved yet.')) {
        returnToWorkouts();
      }
      return;
    }

    Alert.alert(
      'Finish workout?',
      'Your completed sets will not be saved yet.',
      [
        { text: 'Keep Training', style: 'cancel' },
        { text: 'Finish Workout', style: 'destructive', onPress: returnToWorkouts },
      ],
    );
  };

  return (
    <WorkoutSessionScreen
      onFinishWorkout={finishWorkout}
      onReturnToWorkouts={() => router.replace('/workouts')}
      workout={workout}
    />
  );
}

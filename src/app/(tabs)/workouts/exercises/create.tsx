import { useLocalSearchParams } from 'expo-router';

import { ExerciseEditorScreen } from '@/features/exercises/exercise-editor-screen';

export default function CreateExerciseRoute() {
  const { returnTo } = useLocalSearchParams<{ returnTo?: string | string[] }>();
  return (
    <ExerciseEditorScreen
      mode="create"
      returnTo={Array.isArray(returnTo) ? returnTo[0] : returnTo}
    />
  );
}

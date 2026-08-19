import { useLocalSearchParams } from 'expo-router';

import { ExerciseEditorScreen } from '@/features/exercises/exercise-editor-screen';

export default function EditExerciseRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <ExerciseEditorScreen exerciseId={id} mode="edit" />;
}

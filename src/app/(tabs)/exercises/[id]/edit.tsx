import { useLocalSearchParams } from 'expo-router';

import { ExerciseEditorScreen } from '@/features/exercises/exercise-editor-screen';

export default function EditExerciseRoute() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const exerciseId = Array.isArray(id) ? id[0] : id;

  return <ExerciseEditorScreen exerciseId={exerciseId} mode="edit" />;
}

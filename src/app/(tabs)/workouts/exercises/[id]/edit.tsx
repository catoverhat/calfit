import { useLocalSearchParams } from 'expo-router';

import { ExerciseEditorScreen } from '@/features/exercises/exercise-editor-screen';

export default function EditExerciseRoute() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  return <ExerciseEditorScreen exerciseId={Array.isArray(id) ? id[0] : id} mode="edit" />;
}

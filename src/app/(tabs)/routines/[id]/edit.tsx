import { useLocalSearchParams } from 'expo-router';

import { RoutineEditorScreen } from '@/components/routines/routine-editor-screen';

export default function EditRoutineRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <RoutineEditorScreen mode="edit" routineId={id} />;
}

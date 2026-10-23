import { useLocalSearchParams } from 'expo-router';

import { RoutineEditorScreen } from '@/features/routines/routine-editor-screen';

export default function CreateWorkoutRoute() {
  const { plannedDate } = useLocalSearchParams<{ plannedDate?: string | string[] }>();
  return (
    <RoutineEditorScreen
      mode="create"
      plannedDate={Array.isArray(plannedDate) ? plannedDate[0] : plannedDate}
    />
  );
}

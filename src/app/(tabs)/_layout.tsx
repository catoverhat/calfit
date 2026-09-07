import AppTabs from '@/navigation/app-tabs';
import { RoutineDraftProvider } from '@/features/routines/routine-draft-context';

export default function TabsLayout() {
  return (
    <RoutineDraftProvider>
      <AppTabs />
    </RoutineDraftProvider>
  );
}

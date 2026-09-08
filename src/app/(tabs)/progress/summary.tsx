import { useLocalSearchParams } from 'expo-router';

import { WorkoutSummaryScreen } from '@/features/progress/workout-summary-screen';

export default function WorkoutSummaryRoute() {
  const { sessionId } = useLocalSearchParams<{ sessionId?: string | string[] }>();
  const normalizedSessionId = Array.isArray(sessionId) ? sessionId[0] : sessionId;

  return <WorkoutSummaryScreen sessionId={normalizedSessionId} />;
}

import { useLocalSearchParams } from 'expo-router';

import { WeeklyPlanScreen } from '@/features/plan/weekly-plan-screen';

export default function PlanRoute() {
  const { date } = useLocalSearchParams<{ date?: string | string[] }>();
  return <WeeklyPlanScreen initialDate={Array.isArray(date) ? date[0] : date} />;
}

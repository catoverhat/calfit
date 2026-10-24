import { Text, View } from 'react-native';

import { TabScreen } from '@/components/layout/tab-screen';
import { WorkoutSummaryActions, WorkoutSummaryHero, WorkoutSummaryStats } from './components/workout-summary-sections';
import { useStyles } from './workout-summary-screen.styles';
import { useWorkoutSummary } from './use-workout-summary';

export function WorkoutSummaryScreen({ sessionId }: { sessionId?: string }) {
  const styles = useStyles();
  const { data, error, isLoading } = useWorkoutSummary(sessionId);

  return (
    <TabScreen contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {error ? <StatusCard body={error} title="Summary unavailable" /> : null}
        {isLoading ? <StatusCard body="Loading the saved workout session." title="Loading summary" /> : null}
        {data ? <><WorkoutSummaryHero summary={data} /><WorkoutSummaryStats summary={data} /><WorkoutSummaryActions /></> : null}
      </View>
    </TabScreen>
  );
}

function StatusCard({ body, title }: { body: string; title: string }) {
  const styles = useStyles();
  return <View style={styles.statusCard}><Text style={styles.statusTitle}>{title}</Text><Text style={styles.statusBody}>{body}</Text></View>;
}

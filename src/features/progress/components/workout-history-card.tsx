import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { DesignColors, SemanticColors } from '@/theme/tokens';
import type { ProgressHistoryCard } from '../progress.viewmodel';
import { styles } from '../workout-history-screen.styles';

export function WorkoutHistoryCard({ workout }: { workout: ProgressHistoryCard }) {
  const completed = workout.status === 'completed';
  const ringColor = completed ? SemanticColors.action : DesignColors.secondary;

  return (
    <Link href={{ pathname: '/progress/summary', params: { sessionId: workout.id } }} push asChild>
      <Pressable accessibilityLabel={`Open ${workout.title}, ${workout.statusLabel}`} accessibilityRole="button">
        {({ pressed }) => (
          <View style={[styles.card, pressed && styles.cardPressed]}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleBlock}>
                <Text style={[styles.cardTitle, !completed && styles.cardTitleMuted]}>{workout.title}</Text>
                <View style={styles.statusRow}>
                  <View style={[styles.statusDot, !completed && styles.statusDotMuted]} />
                  <Text style={[styles.statusText, !completed && styles.statusTextMuted]}>{workout.statusLabel} · {workout.date}</Text>
                </View>
              </View>
              <View style={[styles.ring, { borderColor: ringColor }]}><Text style={[styles.ringText, { color: ringColor }]}>{workout.completion}%</Text></View>
            </View>
            <View style={styles.metricsRow}>
              <Metric label="Duration" value={workout.duration} />
              <Metric label="Exercises" value={workout.exercises} />
              <Metric label="Volume" value={workout.volume} />
            </View>
          </View>
        )}
      </Pressable>
    </Link>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <View style={styles.metric}><Text style={styles.metricLabel}>{label}</Text><Text style={styles.metricValue}>{value}</Text></View>;
}

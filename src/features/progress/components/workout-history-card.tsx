import { Pressable, Text, View } from 'react-native';

import { DesignColors, SemanticColors } from '@/theme/tokens';

import { styles } from '../workout-history-screen.styles';

export type HistoryWorkout = {
  category: 'strength' | 'cardio';
  completion: number;
  dateGroup: 'recent' | 'september';
  duration: string;
  exercises: string;
  hasPr?: boolean;
  id: string;
  status: 'completed' | 'partial';
  title: string;
  volume: string;
};
export function WorkoutHistoryCard({ workout }: { workout: HistoryWorkout }) {
  const completed = workout.status === 'completed';
  const ringColor = completed ? SemanticColors.action : DesignColors.secondary;
  const statusText = completed ? 'Completed' : 'Partial';

  return (
    <Pressable
      accessibilityLabel={`${workout.title}, ${statusText}`}
      accessibilityRole="button"
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleBlock}>
          <Text style={[styles.cardTitle, !completed && styles.cardTitleMuted]}>{workout.title}</Text>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, !completed && styles.statusDotMuted]} />
            <Text style={[styles.statusText, !completed && styles.statusTextMuted]}>{statusText}</Text>
          </View>
        </View>
        <CompletionRing color={ringColor} percent={workout.completion} />
      </View>

      <View style={styles.metricsRow}>
        <Metric label="Duration" value={workout.duration} />
        <Metric label="Exercises" value={workout.exercises} />
        <Metric label="Volume" value={workout.volume} />
      </View>
    </Pressable>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

function CompletionRing({ color, percent }: { color: string; percent: number }) {
  return (
    <View style={[styles.ring, { borderColor: color }]}>
      <Text style={[styles.ringText, { color }]}>{percent}%</Text>
    </View>
  );
}

import { Text, View } from 'react-native';

import type { ProgressMetric } from '../progress.viewmodel';
import { styles } from '../progress-dashboard-screen.styles';

export function MetricCard({ metric }: { metric: ProgressMetric }) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricLabel}>{metric.label}</Text>
      <Text style={styles.metricValue}>{metric.value}</Text>
      <Text style={styles.metricHelper}>{metric.helper}</Text>
    </View>
  );
}

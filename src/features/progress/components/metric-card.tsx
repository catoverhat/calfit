import { Text, View } from 'react-native';

import { styles } from '../progress-dashboard-screen.styles';

export type ProgressMetric = {
  helper: string;
  label: string;
  value: string;
};

export function MetricCard({ metric }: { metric: ProgressMetric }) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricLabel}>{metric.label}</Text>
      <Text style={styles.metricValue}>{metric.value}</Text>
      <Text style={styles.metricHelper}>{metric.helper}</Text>
    </View>
  );
}

import { Text, View } from 'react-native';

import type { ProgressMetric } from '../progress.viewmodel';
import { useStyles } from '../progress-dashboard-screen.styles';

export function MetricCard({ metric, prominent = false }: { metric: ProgressMetric; prominent?: boolean }) {
  const styles = useStyles();
  return (
    <View accessible accessibilityLabel={`${metric.label}: ${metric.value}. ${metric.helper}`} style={[styles.metricCard, prominent && styles.metricCardProminent]}>
      <Text style={styles.metricLabel}>{metric.label}</Text>
      <Text style={[styles.metricValue, prominent && styles.metricValueProminent]}>{metric.value}</Text>
      <Text style={styles.metricHelper}>{metric.helper}</Text>
    </View>
  );
}

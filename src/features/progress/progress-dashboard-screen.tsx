import { Text, View } from 'react-native';

import { Header } from '@/components/layout/header';
import { TabScreen } from '@/components/layout/tab-screen';
import { MetricCard } from './components/metric-card';
import {
  ConsistencyCard,
  PeriodSelector,
  ProgressLink,
  ProgressStatus,
  TrainingChart,
  WeightTrendCard,
} from './components/progress-dashboard-sections';
import { styles } from './progress-dashboard-screen.styles';
import { useProgressDashboard } from './use-progress-dashboard';

export function ProgressDashboardScreen() {
  const { data, error, isLoading, period, setPeriod, reload } = useProgressDashboard();

  return (
    <TabScreen contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Header avatarUrl={data?.avatarUrl} profileName={data?.profileName ?? 'Local Athlete'} showAction={false} />
        <View style={styles.headingBlock}>
          <Text accessibilityRole="header" style={styles.title}>Your progress</Text>
          <Text style={styles.subtitle}>See how your training adds up.</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Training overview</Text>
          <PeriodSelector onChange={setPeriod} period={period} />
          <ProgressStatus error={error} isLoading={isLoading} onRetry={reload} />
          {data && !isLoading ? (
            <>
              <View style={styles.metricGrid}>
                {data.trainingMetrics.map((metric) => <MetricCard key={metric.label} metric={metric} />)}
              </View>
              <TrainingChart data={data} />
            </>
          ) : null}
        </View>
        {data && !isLoading ? (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Body measurements</Text>
              <WeightTrendCard data={data} />
              <View style={styles.metricGrid}>
                {data.metrics.map((metric) => <MetricCard key={metric.label} metric={metric} />)}
              </View>
            </View>
            <ConsistencyCard data={data} />
          </>
        ) : null}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Explore your progress</Text>
          <View style={styles.quickLinks}>
            <ProgressLink href="/progress/history" icon="history" label="Workout history" />
            <ProgressLink href="/progress/measurements" icon="body" label="Measurements" />
            <ProgressLink href="/progress/storage" icon="database" label="Local data" />
          </View>
        </View>
      </View>
    </TabScreen>
  );
}

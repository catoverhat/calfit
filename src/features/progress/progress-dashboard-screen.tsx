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
import { useStyles } from './progress-dashboard-screen.styles';
import { useProgressDashboard } from './use-progress-dashboard';

export function ProgressDashboardScreen() {
  const styles = useStyles();
  const { data, error, isLoading, period, setPeriod, reload } = useProgressDashboard();

  return (
    <TabScreen contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Header avatarUrl={data?.avatarUrl} profileName={data?.profileName ?? 'Local Athlete'} showAction={false} />
        <View style={styles.headingRow}>
          <View style={styles.headingBlock}>
            <Text style={styles.eyebrow}>Every session counts</Text>
            <Text accessibilityRole="header" style={styles.title}>Your progress</Text>
            <Text style={styles.subtitle}>See how your training adds up.</Text>
          </View>
          <ProgressLink compact href="/progress/history" icon="history" label="History" />
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Training overview</Text>
          <PeriodSelector onChange={setPeriod} period={period} />
          <ProgressStatus error={error} isLoading={isLoading} onRetry={reload} />
          {data && !isLoading ? (
            <>
              <View style={styles.metricGrid}>
                {data.trainingMetrics.map((metric) => <MetricCard key={metric.label} metric={metric} prominent />)}
              </View>
              <TrainingChart data={data} />
            </>
          ) : null}
        </View>
        {data && !isLoading ? (
          <>
            <ConsistencyCard data={data} />
            <View style={styles.section}>
              <View style={styles.sectionHeading}>
                <Text style={styles.sectionTitle}>Body measurements</Text>
                <Text style={styles.sectionHint}>An optional way to track changes over time.</Text>
              </View>
              <WeightTrendCard data={data} />
              <View style={styles.metricGrid}>
                {data.metrics.map((metric) => <MetricCard key={metric.label} metric={metric} />)}
              </View>
            </View>
          </>
        ) : null}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Explore your progress</Text>
          <View style={styles.quickLinks}>
            <ProgressLink href="/progress/history" icon="history" label="Workout history" detail="Review sessions, sets, and lifting volume" />
            <ProgressLink href="/progress/measurements" icon="body" label="Measurements" detail="Add or review your body measurements" />
            <ProgressLink href="/progress/storage" icon="database" label="Local data" detail="See what is saved on this device" />
          </View>
        </View>
      </View>
    </TabScreen>
  );
}

import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { Header } from '@/components/layout/header';
import { TabScreen } from '@/components/layout/tab-screen';
import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import { DesignColors, SemanticColors } from '@/theme/tokens';
import { LinePlot } from './components/line-plot';
import { MetricCard } from './components/metric-card';
import { styles } from './progress-dashboard-screen.styles';
import { useProgressDashboard } from './use-progress-dashboard';

const heatmapCellStyles = [
  { backgroundColor: DesignColors.surfaceContainerHigh },
  { backgroundColor: '#5A2B1C' },
  { backgroundColor: '#B8461C' },
  { backgroundColor: SemanticColors.action },
] as const;

export function ProgressDashboardScreen() {
  const { data, error, isLoading } = useProgressDashboard();

  return (
    <TabScreen contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Header avatarUrl={data?.avatarUrl} profileName={data?.profileName ?? 'Local Athlete'} showAction={false} />
        <View style={styles.headingBlock}>
          <Text style={styles.eyebrow}>Your Progress</Text>
          <Text style={styles.subtitle}>Performance saved on this device</Text>
        </View>
        <View style={styles.quickLinks}>
          <ProgressLink href="/progress/history" icon="history" label="History" />
          <ProgressLink href="/progress/measurements" icon="body" label="Measurements" />
          <ProgressLink href="/progress/storage" icon="database" label="Local Data" />
        </View>
        {error ? <StatusCard body={error} title="Progress unavailable" /> : null}
        {isLoading ? <StatusCard body="Loading your locally saved progress." title="Loading progress" /> : null}
        {data ? (
          <>
            <View style={styles.metricGrid}>
              {data.metrics.map((metric) => <MetricCard key={metric.label} metric={metric} />)}
            </View>
            <Link href="/progress/measurements" push asChild>
              <Pressable accessibilityLabel="Open body measurements" accessibilityRole="button">
                {({ pressed }) => (
                  <View style={[styles.card, pressed && styles.cardPressed]}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.cardTitle}>Body Weight Trend</Text>
                      <Text style={styles.cardAction}>{data.latestWeight === '—' ? '—' : `${data.latestWeight} ${data.weightUnit}`}</Text>
                    </View>
                    {data.weightSegments.length > 0 ? <LinePlot segments={data.weightSegments} style={styles.bodyPlot} /> : <Text style={styles.emptyText}>Add at least two weight measurements to see a trend.</Text>}
                  </View>
                )}
              </Pressable>
            </Link>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Completed sessions — last 7 days</Text>
              <View style={styles.barChart}>
                {data.weeklySessions.map((item) => (
                  <View key={item.label} style={styles.barColumn}>
                    <Text style={styles.barValue}>{item.value}</Text>
                    <View style={[styles.sessionBar, { height: item.height }]} />
                    <Text style={styles.axisLabel}>{item.label}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Completed volume over time</Text>
                <Text style={styles.cardAction}>{data.volumeTotal}</Text>
              </View>
              {data.volumeSegments.length > 0 ? <LinePlot segments={data.volumeSegments} style={styles.bodyPlot} /> : <Text style={styles.emptyText}>Complete weighted sets in two workouts to see volume progression.</Text>}
            </View>
            <View accessibilityLabel="Workout consistency over recent weeks. Darker cells represent more completed training." style={styles.card}>
              <Text style={styles.cardTitle}>Workout Consistency</Text>
              <View style={styles.heatmapBlock}>
                <View style={styles.heatmapLabels}>
                  <Text style={styles.heatmapLabel}>M</Text>
                  <Text style={styles.heatmapLabel}>W</Text>
                  <Text style={styles.heatmapLabel}>F</Text>
                </View>
                <View style={styles.heatmapGrid}>
                  {data.consistencyRows.map((row, rowIndex) => (
                    <View key={`row-${rowIndex}`} style={styles.heatmapRow}>
                      {row.map((level, index) => <View key={`${rowIndex}-${index}`} style={[styles.heatmapCell, heatmapCellStyles[level]]} />)}
                    </View>
                  ))}
                </View>
              </View>
              <View style={styles.heatmapLegend}>
                <Text style={styles.legendText}>Less</Text>
                {heatmapCellStyles.map((cellStyle, index) => (
                  <View key={index} style={[styles.legendCell, cellStyle]} />
                ))}
                <Text style={styles.legendText}>More</Text>
              </View>
            </View>
          </>
        ) : null}
      </View>
    </TabScreen>
  );
}

function ProgressLink({ href, icon, label }: { href: '/progress/history' | '/progress/measurements' | '/progress/storage'; icon: AppIconName; label: string }) {
  return (
    <Link href={href} push asChild>
      <Pressable accessibilityLabel={`Open ${label}`} accessibilityRole="button">
        {({ pressed }) => (
          <View style={[styles.quickLink, pressed && styles.pressed]}>
            <AppIcon color={SemanticColors.actionSoft} name={icon} size={18} />
            <Text style={styles.quickLinkText}>{label}</Text>
          </View>
        )}
      </Pressable>
    </Link>
  );
}

function StatusCard({ body, title }: { body: string; title: string }) {
  return <View style={styles.statusCard}><Text style={styles.statusTitle}>{title}</Text><Text style={styles.emptyText}>{body}</Text></View>;
}

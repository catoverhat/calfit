import { styles } from './progress-dashboard-screen.styles';
import { router, type Href } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { Header } from '@/components/layout/header';
import { TabScreen } from '@/components/layout/tab-screen';
import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import { MOCK_USER } from '@/fixtures/mock-data';
import { DesignColors, SemanticColors } from '@/theme/tokens';
import { LinePlot, type LineSegment } from './components/line-plot';
import { MetricCard, type ProgressMetric } from './components/metric-card';

type PersonalRecord = {
  change: string;
  detail: string;
  icon: AppIconName;
  title: string;
};

const metrics = [
  { label: 'BMI', value: '24.2', helper: 'Optimal Range' },
  { label: 'Body Fat %', value: '14.8%', helper: '-0.5% this month' },
] satisfies ProgressMetric[];

const weeklySessions = [
  { day: 'Mon', height: 82 },
  { day: 'Tue', height: 132 },
  { day: 'Wed', height: 48 },
  { day: 'Thu', height: 152 },
  { day: 'Fri', height: 102 },
  { day: 'Sat', height: 76 },
] as const;

const bodyTrendSegments = [
  { left: '15%', top: '68%', width: 42, rotate: '-8deg' },
  { left: '30%', top: '62%', width: 58, rotate: '-12deg' },
  { left: '50%', top: '54%', width: 58, rotate: '-2deg' },
  { left: '69%', top: '58%', width: 42, rotate: '10deg' },
  { left: '82%', top: '53%', width: 42, rotate: '-24deg' },
] satisfies LineSegment[];

const volumeTrendSegments = [
  { left: '7%', top: '74%', width: 32, rotate: '-10deg' },
  { left: '18%', top: '66%', width: 40, rotate: '-28deg' },
  { left: '31%', top: '62%', width: 36, rotate: '18deg' },
  { left: '42%', top: '54%', width: 42, rotate: '-26deg' },
  { left: '55%', top: '44%', width: 46, rotate: '-22deg' },
  { left: '69%', top: '42%', width: 38, rotate: '13deg' },
  { left: '80%', top: '33%', width: 46, rotate: '-30deg' },
] as const;

const consistencyRows = [
  [0, 2, 0, 1, 3, 2, 0, 3, 1, 2, 3, 2, 1, 3, 3, 2, 1, 3, 2, 3, 3, 2],
  [1, 0, 2, 3, 2, 1, 0, 2, 3, 3, 2, 3, 2, 1, 0, 2, 3, 3, 2, 2, 1, 3],
  [2, 1, 0, 2, 3, 1, 2, 0, 2, 3, 3, 2, 3, 2, 1, 0, 2, 3, 3, 3, 2, 1],
  [3, 2, 1, 0, 2, 3, 1, 2, 0, 2, 3, 3, 2, 3, 2, 1, 0, 2, 3, 2, 3, 3],
  [0, 3, 2, 1, 0, 2, 3, 1, 2, 0, 2, 3, 3, 2, 3, 2, 1, 0, 2, 3, 3, 2],
  [1, 2, 3, 2, 1, 0, 2, 3, 1, 2, 0, 2, 3, 3, 2, 3, 2, 1, 0, 2, 3, 3],
] as const;

const personalRecords = [
  {
    change: '180 kg',
    detail: '2 days ago - Strength',
    icon: 'strength',
    title: 'Barbell Deadlift',
  },
  {
    change: '115 kg',
    detail: '4 days ago - Strength',
    icon: 'strength',
    title: 'Bench Press',
  },
  {
    change: '+35 kg',
    detail: '1 week ago - Calisthenics',
    icon: 'strength',
    title: 'Weighted Pullups',
  },
] satisfies PersonalRecord[];

export function ProgressDashboardScreen() {
  return (
    <TabScreen contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Header
          actionAccessibilityLabel="Sync progress dashboard"
          actionIcon="cloud"
          actionIconColor={SemanticColors.actionSoft}
          avatarUrl={MOCK_USER.avatarUrl}
          onNotificationsPress={() => router.push('/progress/sync' as Href)}
          profileName={MOCK_USER.name}
        />

        <View style={styles.headingBlock}>
          <Text style={styles.eyebrow}>Your Progress</Text>
          <Text style={styles.subtitle}>Data-driven performance tracking</Text>
        </View>

        <View style={styles.metricGrid}>
          {metrics.map((metric) => <MetricCard key={metric.label} metric={metric} />)}
        </View>

        <Pressable
          accessibilityLabel="Open body measurements"
          accessibilityRole="button"
          onPress={() => router.push('/progress/measurements' as Href)}
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Body Weight Trend</Text>
            <Text style={styles.cardAction}>82.4 kg</Text>
          </View>
          <LinePlot segments={bodyTrendSegments} style={styles.bodyPlot} />
        </Pressable>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sessions per week</Text>
          <View style={styles.barChart}>
            {weeklySessions.map((item) => (
              <View key={item.day} style={styles.barColumn}>
                <View style={[styles.sessionBar, { height: item.height }]} />
                <Text style={styles.axisLabel}>{item.day}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Volume over time</Text>
          <View style={styles.volumePlot}>
            <View style={styles.plotAxisY} />
            <View style={styles.plotAxisX} />
            <LinePlot segments={volumeTrendSegments} style={styles.volumeLineLayer} />
            <Text style={styles.volumeTotal}>76,420 kg Total</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Workout Consistency</Text>
          <View style={styles.heatmapBlock}>
            <View style={styles.heatmapLabels}>
              <Text style={styles.heatmapLabel}>M</Text>
              <Text style={styles.heatmapLabel}>W</Text>
              <Text style={styles.heatmapLabel}>F</Text>
            </View>
            <View style={styles.heatmapGrid}>
              {consistencyRows.map((row, rowIndex) => (
                <View key={`row-${rowIndex}`} style={styles.heatmapRow}>
                  {row.map((level, index) => (
                    <View
                      key={`${rowIndex}-${index}`}
                      style={[styles.heatmapCell, heatmapCellStyles[level]]}
                    />
                  ))}
                </View>
              ))}
            </View>
          </View>
          <View style={styles.heatmapLegend}>
            <Text style={styles.legendText}>Less</Text>
            <View style={[styles.legendCell, heatmapCellStyles[1]]} />
            <View style={[styles.legendCell, heatmapCellStyles[2]]} />
            <View style={[styles.legendCell, heatmapCellStyles[3]]} />
            <Text style={styles.legendText}>More</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Recent Personal Records</Text>
            <View style={styles.prBadge}>
              <AppIcon color={SemanticColors.action} name="star" size={13} />
            </View>
          </View>
          <View style={styles.prList}>
            {personalRecords.map((record) => (
              <Pressable
                accessibilityLabel={`${record.title}, ${record.change}`}
                accessibilityRole="button"
                key={record.title}
                style={({ pressed }) => [styles.prRow, pressed && styles.pressed]}>
                <View style={styles.prIconTile}>
                  <AppIcon color={SemanticColors.actionSoft} name={record.icon} size={17} />
                </View>
                <View style={styles.prCopy}>
                  <Text style={styles.prTitle}>{record.title}</Text>
                  <Text style={styles.prDetail}>{record.detail}</Text>
                </View>
                <View style={styles.prValueBlock}>
                  <Text style={styles.prChange}>{record.change}</Text>
                  <Text style={styles.prTag}>+5kg PR</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </TabScreen>
  );
}

const heatmapCellStyles = [
  { backgroundColor: DesignColors.surfaceContainerHigh },
  { backgroundColor: '#5A2B1C' },
  { backgroundColor: '#B8461C' },
  { backgroundColor: SemanticColors.action },
] as const;

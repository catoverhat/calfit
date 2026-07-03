import { router, type Href } from 'expo-router';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { Header } from '@/components/header';
import { TabScreen } from '@/components/tab-screen';
import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import { MOCK_USER } from '@/constants/mock-data';
import {
  ComponentTokens,
  DesignColors,
  Fonts,
  MaxContentWidth,
  Radius,
  SemanticColors,
  Spacing,
  Typography,
} from '@/constants/theme';

type MetricCard = {
  label: string;
  value: string;
  helper: string;
};

type PersonalRecord = {
  change: string;
  detail: string;
  icon: AppIconName;
  title: string;
};

type LineSegment = {
  left: `${number}%`;
  rotate: `${number}deg`;
  top: `${number}%`;
  width: number;
};

const metrics = [
  { label: 'BMI', value: '24.2', helper: 'Optimal Range' },
  { label: 'Body Fat %', value: '14.8%', helper: '-0.5% this month' },
] satisfies MetricCard[];

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
          profileName={MOCK_USER.name}
        />

        <View style={styles.headingBlock}>
          <Text style={styles.eyebrow}>Your Progress</Text>
          <Text style={styles.subtitle}>Data-driven performance tracking</Text>
        </View>

        <View style={styles.metricGrid}>
          {metrics.map((metric) => (
            <View key={metric.label} style={styles.metricCard}>
              <Text style={styles.metricLabel}>{metric.label}</Text>
              <Text style={styles.metricValue}>{metric.value}</Text>
              <Text style={styles.metricHelper}>{metric.helper}</Text>
            </View>
          ))}
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

function LinePlot({
  segments,
  style,
}: {
  segments: readonly LineSegment[];
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.linePlot, style]}>
      {segments.map((segment, index) => (
        <View
          key={`${segment.left}-${index}`}
          style={[
            styles.lineSegment,
            {
              left: segment.left,
              top: segment.top,
              transform: [{ rotate: segment.rotate }],
              width: segment.width,
            },
          ]}
        />
      ))}
    </View>
  );
}

const heatmapCellStyles = [
  { backgroundColor: DesignColors.surfaceContainerHigh },
  { backgroundColor: '#5A2B1C' },
  { backgroundColor: '#B8461C' },
  { backgroundColor: SemanticColors.action },
] as const;

const styles = StyleSheet.create({
  scrollContent: {
    alignItems: 'center',
    flexGrow: 1,
    paddingBottom: 112,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
  },
  content: {
    gap: Spacing.three,
    maxWidth: Math.min(MaxContentWidth, 430),
    width: '100%',
  },
  headingBlock: {
    gap: Spacing.half,
    paddingTop: Spacing.one,
  },
  eyebrow: {
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.bodyBold,
    fontSize: 13,
    lineHeight: 17,
  },
  subtitle: {
    color: SemanticColors.textSecondary,
    fontFamily: Fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 17,
  },
  metricGrid: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  metricCard: {
    backgroundColor: DesignColors.surfaceContainerLow,
    borderColor: SemanticColors.border,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: ComponentTokens.card.borderWidth,
    flex: 1,
    gap: Spacing.one,
    minHeight: 108,
    padding: Spacing.three,
  },
  metricLabel: {
    color: SemanticColors.actionSoft,
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
    lineHeight: 16,
  },
  metricValue: {
    ...Typography.lg,
    color: SemanticColors.action,
    fontFamily: Fonts.heading,
    fontVariant: ['tabular-nums'],
    lineHeight: 25,
    paddingTop: Spacing.two,
  },
  metricHelper: {
    color: DesignColors.primaryFixedDim,
    fontFamily: Fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
  },
  card: {
    backgroundColor: DesignColors.surfaceContainerLow,
    borderColor: SemanticColors.border,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: ComponentTokens.card.borderWidth,
    gap: Spacing.three,
    padding: Spacing.three,
  },
  cardPressed: {
    opacity: 0.72,
    transform: [{ scale: 0.99 }],
  },
  cardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.two,
    justifyContent: 'space-between',
  },
  cardTitle: {
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.bodyBold,
    fontSize: 13,
    lineHeight: 18,
  },
  cardAction: {
    color: SemanticColors.action,
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
    lineHeight: 16,
  },
  linePlot: {
    minHeight: 72,
    overflow: 'hidden',
    position: 'relative',
  },
  bodyPlot: {
    minHeight: 64,
  },
  lineSegment: {
    backgroundColor: SemanticColors.action,
    borderRadius: Radius.full,
    height: 2,
    position: 'absolute',
  },
  barChart: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: Spacing.three,
    justifyContent: 'space-between',
    minHeight: 168,
    paddingTop: Spacing.three,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
    gap: Spacing.two,
    justifyContent: 'flex-end',
  },
  sessionBar: {
    backgroundColor: SemanticColors.action,
    borderRadius: Radius.sm,
    maxWidth: 42,
    minWidth: 26,
    width: '100%',
  },
  axisLabel: {
    color: SemanticColors.actionSoft,
    fontFamily: Fonts.bodyBold,
    fontSize: 9,
    lineHeight: 12,
    textTransform: 'uppercase',
  },
  volumePlot: {
    minHeight: 184,
    position: 'relative',
  },
  volumeLineLayer: {
    bottom: Spacing.three,
    left: Spacing.two,
    minHeight: 142,
    position: 'absolute',
    right: Spacing.two,
    top: Spacing.two,
  },
  plotAxisY: {
    backgroundColor: SemanticColors.border,
    bottom: Spacing.three,
    left: Spacing.two,
    position: 'absolute',
    top: Spacing.two,
    width: 1,
  },
  plotAxisX: {
    backgroundColor: SemanticColors.border,
    bottom: Spacing.three,
    height: 1,
    left: Spacing.two,
    position: 'absolute',
    right: Spacing.two,
  },
  volumeTotal: {
    color: SemanticColors.actionSoft,
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
    left: '32%',
    letterSpacing: 0.6,
    lineHeight: 16,
    position: 'absolute',
    textTransform: 'uppercase',
    top: '44%',
  },
  heatmapBlock: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  heatmapLabels: {
    justifyContent: 'space-around',
    paddingVertical: Spacing.half,
  },
  heatmapLabel: {
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.bodyBold,
    fontSize: 10,
    lineHeight: 12,
  },
  heatmapGrid: {
    flex: 1,
    gap: Spacing.one,
    minWidth: 0,
  },
  heatmapRow: {
    flexDirection: 'row',
    gap: Spacing.one,
  },
  heatmapCell: {
    aspectRatio: 1,
    borderRadius: 1,
    flex: 1,
  },
  heatmapLegend: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.one,
    justifyContent: 'flex-end',
  },
  legendText: {
    color: SemanticColors.textSecondary,
    fontFamily: Fonts.bodyBold,
    fontSize: 9,
    lineHeight: 12,
  },
  legendCell: {
    borderRadius: 1,
    height: 10,
    width: 10,
  },
  prBadge: {
    alignItems: 'center',
    backgroundColor: DesignColors.primaryFixed,
    borderRadius: Radius.full,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  prList: {
    gap: Spacing.two,
  },
  prRow: {
    alignItems: 'center',
    backgroundColor: DesignColors.surfaceContainerLowest,
    borderColor: SemanticColors.border,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: Spacing.two,
    minHeight: 72,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
  },
  prIconTile: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 95, 31, 0.12)',
    borderRadius: Radius.sm,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  prCopy: {
    flex: 1,
    gap: Spacing.half,
    minWidth: 0,
  },
  prTitle: {
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.bodyBold,
    fontSize: 13,
    lineHeight: 18,
  },
  prDetail: {
    color: DesignColors.primaryFixedDim,
    fontFamily: Fonts.bodyMedium,
    fontSize: 11,
    lineHeight: 15,
  },
  prValueBlock: {
    alignItems: 'flex-end',
    gap: Spacing.half,
  },
  prChange: {
    color: SemanticColors.action,
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
    lineHeight: 16,
  },
  prTag: {
    color: DesignColors.primaryFixedDim,
    fontFamily: Fonts.bodyBold,
    fontSize: 9,
    lineHeight: 12,
    textTransform: 'uppercase',
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.99 }],
  },
});

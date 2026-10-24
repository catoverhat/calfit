import { useAppTheme } from '@/theme/app-theme-provider';
import { Link } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { AppIcon, type AppIconName } from '@/components/ui/app-icon';

import { useStyles } from '../progress-dashboard-screen.styles';
import type { ProgressDashboardData, ProgressPeriod } from '../progress.viewmodel';
import { LinePlot } from './line-plot';

export function PeriodSelector({ period, onChange }: { period: ProgressPeriod; onChange: (period: ProgressPeriod) => void }) {
  const styles = useStyles();
  return (
    <View accessibilityLabel="Training period" accessibilityRole="tablist" style={styles.periodSelector}>
      {([7, 30, 90] as const).map((days) => (
        <Pressable
          key={days}
          accessibilityLabel={`Last ${days} days`}
          accessibilityRole="tab"
          accessibilityState={{ selected: days === period }}
          onPress={() => onChange(days)}
          style={({ pressed }) => [styles.periodOption, days === period && styles.optionSelected, pressed && styles.pressed]}>
          <Text style={[styles.optionText, days === period && styles.optionTextSelected]}>{days} days</Text>
        </Pressable>
      ))}
    </View>
  );
}

export function TrainingChart({ data }: { data: ProgressDashboardData }) {
  const styles = useStyles();
  const { SemanticColors } = useAppTheme();
  const [mode, setMode] = useState<'sessions' | 'volume'>('sessions');
  const isSessions = mode === 'sessions';

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeading}>
          <Text style={styles.cardTitle}>{isSessions ? 'Completed workouts' : 'Lifting volume'}</Text>
          <Text style={styles.metaText}>{data.periodLabel}</Text>
        </View>
        <AppIcon color={SemanticColors.textMuted} name={isSessions ? 'progress' : 'strength'} size={20} />
      </View>
      <View accessibilityLabel="Training chart" accessibilityRole="tablist" style={styles.chartTabs}>
        {(['sessions', 'volume'] as const).map((option) => (
          <Pressable
            key={option}
            accessibilityRole="tab"
            accessibilityState={{ selected: mode === option }}
            onPress={() => setMode(option)}
            style={({ pressed }) => [styles.chartTab, mode === option && styles.optionSelected, pressed && styles.pressed]}>
            <Text style={[styles.optionText, mode === option && styles.optionTextSelected]}>{option === 'sessions' ? 'Workouts' : 'Volume'}</Text>
          </Pressable>
        ))}
      </View>
      {isSessions ? (
        data.sessionCount > 0 ? (
          <View style={styles.barChart}>
            {data.weeklySessions.map((item) => (
              <View accessible accessibilityLabel={item.description} key={item.label} style={styles.barColumn}>
                <Text style={styles.barValue}>{item.value}</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.sessionBar, { height: item.height }, item.value === 0 && styles.barEmpty]} />
                </View>
                <Text style={styles.axisLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.chartEmpty}>
            <AppIcon color={SemanticColors.textMuted} name="strength" size={28} />
            <Text style={styles.emptyTitle}>Your next workout starts the trend</Text>
            <Text style={styles.emptyText}>Choose another period or complete a workout to see it here.</Text>
            <ProgressLink href="/workouts" icon="next" label="Open workouts" />
          </View>
        )
      ) : (
        <>
          <Text style={styles.volumeValue}>{data.volumeTotal}</Text>
          {data.volumeSegments.length > 0 ? (
            <LinePlot accessibilityLabel={data.volumeSummary} segments={data.volumeSegments} style={styles.bodyPlot} />
          ) : <Text style={styles.emptyText}>Complete weighted sets in two workouts within this period to see a trend.</Text>}
          <Text style={styles.metaText}>Completed reps × weight per workout</Text>
        </>
      )}
      <Text accessibilityLiveRegion="polite" style={styles.chartSummary}>{isSessions ? data.sessionSummary : data.volumeSummary}</Text>
    </View>
  );
}

export function WeightTrendCard({ data }: { data: ProgressDashboardData }) {
  const styles = useStyles();
  const { SemanticColors } = useAppTheme();
  return (
    <Link href="/progress/measurements" push asChild>
      <Pressable accessibilityLabel={`Body weight. ${data.weightSummary} Open measurements.`} accessibilityRole="button">
        {({ pressed }) => (
          <View style={[styles.card, pressed && styles.pressed]}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeading}>
                <Text style={styles.cardTitle}>Body weight</Text>
                <Text style={styles.metaText}>Latest measurements</Text>
              </View>
              <AppIcon color={SemanticColors.actionSoft} name="chevronRight" size={20} />
            </View>
            <Text style={styles.volumeValue}>{data.latestWeight}{data.latestWeight === '—' ? '' : ` ${data.weightUnit}`}</Text>
            {data.weightSegments.length > 0 ? <LinePlot segments={data.weightSegments} style={styles.bodyPlot} /> : null}
            <Text style={styles.chartSummary}>{data.weightSummary}</Text>
            {data.latestWeight !== '—' ? <Text style={styles.metaText}>{data.weightRangeLabel}</Text> : null}
            <Text style={styles.linkText}>{data.latestWeight === '—' ? 'Add a measurement' : 'View measurements'}</Text>
          </View>
        )}
      </Pressable>
    </Link>
  );
}

export function ConsistencyCard({ data }: { data: ProgressDashboardData }) {
  const styles = useStyles();
  const { ComponentTokens } = useAppTheme();
  return (
    <View style={styles.card}>
      <View style={styles.cardHeading}>
        <Text style={styles.cardTitle}>Training consistency</Text>
        <Text style={styles.metaText}>Last 13 weeks · Monday to Sunday</Text>
      </View>
      <View accessible accessibilityLabel={data.consistencySummary} style={styles.heatmapBlock}>
        <View style={styles.heatmapLabels}>
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => <Text key={index} style={styles.heatmapLabel}>{day}</Text>)}
        </View>
        <View style={styles.heatmapGrid}>
          {data.consistencyRows.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.heatmapRow}>
              {row.map((level, column) => (
                <View key={column} style={[styles.heatmapCell, level === null ? styles.futureCell : { backgroundColor: ComponentTokens.progress.consistency[level] }]} />
              ))}
            </View>
          ))}
        </View>
      </View>
      <View style={styles.heatmapLegend}>
        <Text style={styles.metaText}>Workouts per day</Text>
        {ComponentTokens.progress.consistency.map((color, level) => (
          <View key={color} style={styles.legendItem}>
            <View style={[styles.legendCell, { backgroundColor: color }]} />
            <Text style={styles.metaText}>{level === 3 ? '3+' : level}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.chartSummary}>{data.consistencySummary}</Text>
    </View>
  );
}

type ProgressHref = '/progress/history' | '/progress/measurements' | '/progress/storage' | '/workouts';

export function ProgressLink({ href, icon, label }: { href: ProgressHref; icon: AppIconName; label: string }) {
  const styles = useStyles();
  const { SemanticColors } = useAppTheme();
  return (
    <Link href={href} push asChild>
      <Pressable accessibilityLabel={label} accessibilityRole="button">
        {({ pressed }) => (
          <View style={[styles.quickLink, pressed && styles.pressed]}>
            <AppIcon color={SemanticColors.actionSoft} name={icon} size={20} />
            <Text style={styles.quickLinkText}>{label}</Text>
            <AppIcon color={SemanticColors.textMuted} name="chevronRight" size={18} />
          </View>
        )}
      </Pressable>
    </Link>
  );
}

export function ProgressStatus({ error, isLoading, onRetry }: { error: string | null; isLoading: boolean; onRetry: () => void }) {
  const styles = useStyles();
  const { SemanticColors } = useAppTheme();
  if (!error && !isLoading) return null;
  return (
    <View accessibilityLiveRegion="polite" style={styles.card}>
      {isLoading ? <ActivityIndicator color={SemanticColors.action} /> : <AppIcon color={SemanticColors.danger} name="warning" size={24} />}
      <Text style={styles.cardTitle}>{isLoading ? 'Loading progress' : 'Progress unavailable'}</Text>
      <Text selectable style={styles.emptyText}>{isLoading ? 'Reading your saved workouts and measurements.' : error}</Text>
      {error && !isLoading ? (
        <Pressable accessibilityRole="button" onPress={onRetry} style={({ pressed }) => [styles.retryButton, pressed && styles.pressed]}>
          <Text style={styles.linkText}>Try again</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

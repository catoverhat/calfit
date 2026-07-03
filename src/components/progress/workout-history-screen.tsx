import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Header } from '@/components/header';
import { TabScreen } from '@/components/tab-screen';
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

type HistoryFilter = 'all' | 'strength' | 'cardio' | 'prs';

type HistoryWorkout = {
  category: Exclude<HistoryFilter, 'all' | 'prs'>;
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

const filters = [
  { id: 'all', label: 'All Workouts' },
  { id: 'strength', label: 'Strength' },
  { id: 'cardio', label: 'Cardio' },
  { id: 'prs', label: 'PRs' },
] satisfies { id: HistoryFilter; label: string }[];

const historyWorkouts = [
  {
    category: 'strength',
    completion: 100,
    dateGroup: 'recent',
    duration: '72m',
    exercises: '6',
    hasPr: true,
    id: 'push-day-oct-12',
    status: 'completed',
    title: 'Push Day - Oct 12',
    volume: '12.4k',
  },
  {
    category: 'strength',
    completion: 100,
    dateGroup: 'recent',
    duration: '85m',
    exercises: '8',
    id: 'leg-day-oct-10',
    status: 'completed',
    title: 'Leg Day - Oct 10',
    volume: '18.2k',
  },
  {
    category: 'strength',
    completion: 100,
    dateGroup: 'recent',
    duration: '58m',
    exercises: '5',
    id: 'full-body-oct-08',
    status: 'completed',
    title: 'Full Body - Oct 08',
    volume: '9.5k',
  },
  {
    category: 'cardio',
    completion: 58,
    dateGroup: 'september',
    duration: '15m',
    exercises: '3',
    id: 'quick-core-sep-29',
    status: 'partial',
    title: 'Quick Core - Sep 29',
    volume: '--',
  },
] satisfies HistoryWorkout[];

export function WorkoutHistoryScreen() {
  const [selectedFilter, setSelectedFilter] = useState<HistoryFilter>('all');

  const filteredWorkouts = useMemo(() => {
    if (selectedFilter === 'all') {
      return historyWorkouts;
    }

    if (selectedFilter === 'prs') {
      return historyWorkouts.filter((workout) => workout.hasPr);
    }

    return historyWorkouts.filter((workout) => workout.category === selectedFilter);
  }, [selectedFilter]);

  const recentWorkouts = filteredWorkouts.filter((workout) => workout.dateGroup === 'recent');
  const septemberWorkouts = filteredWorkouts.filter((workout) => workout.dateGroup === 'september');

  return (
    <TabScreen contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Header
          actionAccessibilityLabel="Sync workout history"
          actionIcon="cloud"
          actionIconColor={SemanticColors.actionSoft}
          avatarUrl={MOCK_USER.avatarUrl}
          profileName={MOCK_USER.name}
        />

        <View style={styles.headingBlock}>
          <Text style={styles.title}>Workout History</Text>
          <Text style={styles.subtitle}>Review your recent performance and progress.</Text>
        </View>

        <ScrollView
          horizontal
          contentContainerStyle={styles.filterContent}
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}>
          {filters.map((filter) => {
            const selected = filter.id === selectedFilter;

            return (
              <Pressable
                accessibilityLabel={`Filter by ${filter.label}`}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                key={filter.id}
                onPress={() => setSelectedFilter(filter.id)}
                style={({ pressed }) => [
                  styles.filterChip,
                  selected && styles.filterChipSelected,
                  pressed && styles.pressed,
                ]}>
                <Text style={[styles.filterText, selected && styles.filterTextSelected]}>
                  {filter.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.list}>
          {recentWorkouts.map((workout) => (
            <WorkoutHistoryCard key={workout.id} workout={workout} />
          ))}

          {septemberWorkouts.length > 0 ? (
            <>
              <View style={styles.monthSeparator}>
                <Text style={styles.monthLabel}>September 2023</Text>
                <View style={styles.monthLine} />
              </View>
              {septemberWorkouts.map((workout) => (
                <WorkoutHistoryCard key={workout.id} workout={workout} />
              ))}
            </>
          ) : null}
        </View>
      </View>
    </TabScreen>
  );
}

function WorkoutHistoryCard({ workout }: { workout: HistoryWorkout }) {
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
    gap: Spacing.one,
  },
  title: {
    ...Typography['2xl'],
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.heading,
    lineHeight: 31,
  },
  subtitle: {
    color: DesignColors.primaryFixedDim,
    fontFamily: Fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    maxWidth: 280,
  },
  filterScroll: {
    marginHorizontal: -Spacing.three,
  },
  filterContent: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  filterChip: {
    alignItems: 'center',
    backgroundColor: DesignColors.surfaceContainerLow,
    borderColor: SemanticColors.border,
    borderCurve: 'continuous',
    borderRadius: Radius.full,
    borderWidth: 1,
    minHeight: 34,
    paddingHorizontal: Spacing.three,
  },
  filterChipSelected: {
    backgroundColor: SemanticColors.action,
    borderColor: SemanticColors.action,
  },
  filterText: {
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    lineHeight: 32,
  },
  filterTextSelected: {
    color: DesignColors.onPrimaryContainer,
  },
  list: {
    gap: Spacing.two,
  },
  card: {
    backgroundColor: DesignColors.surfaceContainerLow,
    borderColor: SemanticColors.border,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: ComponentTokens.card.borderWidth,
    gap: Spacing.three,
    minHeight: 138,
    padding: Spacing.three,
  },
  cardPressed: {
    opacity: 0.72,
    transform: [{ scale: 0.99 }],
  },
  cardHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: Spacing.two,
    justifyContent: 'space-between',
  },
  cardTitleBlock: {
    flex: 1,
    minWidth: 0,
  },
  cardTitle: {
    ...Typography.lg,
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.heading,
    lineHeight: 24,
  },
  cardTitleMuted: {
    color: SemanticColors.textMuted,
  },
  statusRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.one,
  },
  statusDot: {
    backgroundColor: SemanticColors.action,
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  statusDotMuted: {
    backgroundColor: SemanticColors.textMuted,
  },
  statusText: {
    color: SemanticColors.action,
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 0.8,
    lineHeight: 15,
    textTransform: 'uppercase',
  },
  statusTextMuted: {
    color: SemanticColors.textMuted,
  },
  ring: {
    alignItems: 'center',
    borderRadius: Radius.full,
    borderWidth: 5,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  ringText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 9,
    lineHeight: 12,
  },
  metricsRow: {
    borderTopColor: SemanticColors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: Spacing.two,
    paddingTop: Spacing.two,
  },
  metric: {
    flex: 1,
    gap: Spacing.half,
  },
  metricLabel: {
    color: SemanticColors.textSecondary,
    fontFamily: Fonts.bodyBold,
    fontSize: 10,
    lineHeight: 13,
  },
  metricValue: {
    ...Typography.lg,
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.heading,
    fontVariant: ['tabular-nums'],
    lineHeight: 24,
  },
  monthSeparator: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.two,
    paddingTop: Spacing.two,
  },
  monthLabel: {
    color: DesignColors.primaryFixedDim,
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 1,
    lineHeight: 15,
    textTransform: 'uppercase',
  },
  monthLine: {
    backgroundColor: SemanticColors.border,
    flex: 1,
    height: 1,
  },
  pressed: {
    opacity: 0.68,
  },
});

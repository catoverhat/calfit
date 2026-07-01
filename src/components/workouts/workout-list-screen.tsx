import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Header } from '@/components/header';
import { TabScreen } from '@/components/tab-screen';
import { ThemedText } from '@/components/themed-text';
import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import { MOCK_USER, MOCK_WORKOUTS } from '@/constants/mock-data';
import {
  ComponentTokens,
  DesignColors,
  Fonts,
  MaxContentWidth,
  Radius,
  SemanticColors,
  Space,
  Spacing,
  TypeScale,
  Typography,
} from '@/constants/theme';

type RoutineSummary = {
  description: string;
  icon: AppIconName;
  id: (typeof MOCK_WORKOUTS)[number]['id'];
  lastCompleted: string;
  schedule: readonly string[];
  statLabel: 'Exercises' | 'Intervals';
  statValue: number;
  title: string;
};

const ROUTINES: readonly RoutineSummary[] = [
  {
    id: 'push-day',
    title: 'Push Day',
    description: 'Focus on chest, shoulders, and triceps with heavy compound movements.',
    icon: 'strength',
    statLabel: 'Exercises',
    statValue: 8,
    schedule: ['M', 'W', 'F'],
    lastCompleted: 'Last: Oct 24, 2023',
  },
  {
    id: 'leg-day',
    title: 'Leg Day',
    description: 'High volume hypertrophy for quads, hamstrings, and calves.',
    icon: 'briefcase',
    statLabel: 'Exercises',
    statValue: 6,
    schedule: ['T'],
    lastCompleted: 'Last: Oct 21, 2023',
  },
  {
    id: 'full-body-power',
    title: 'Full Body',
    description: 'Efficient full body conditioning for busy days.',
    icon: 'body',
    statLabel: 'Exercises',
    statValue: 12,
    schedule: ['F'],
    lastCompleted: 'Last: Never',
  },
  {
    id: 'running-day',
    title: 'Running Day',
    description: '5km tempo run or interval training for cardiovascular endurance.',
    icon: 'running',
    statLabel: 'Intervals',
    statValue: 1,
    schedule: ['W', 'S'],
    lastCompleted: 'Last: Oct 25, 2023',
  },
] as const;

export function WorkoutListScreen() {
  return (
    <TabScreen contentContainerStyle={styles.scrollContent} style={styles.screen}>
      <View style={styles.content}>
        <Header
          actionAccessibilityLabel="Sync routines"
          actionIcon="cloud"
          actionIconColor={SemanticColors.actionSoft}
          avatarUrl={MOCK_USER.avatarUrl}
          profileName={MOCK_USER.name}
        />

        <View style={styles.heading}>
          <ThemedText style={styles.eyebrow}>Your Program</ThemedText>
          <ThemedText style={styles.title}>Workout Routines</ThemedText>
        </View>

        <View style={styles.list}>
          {ROUTINES.map((routine) => (
            <RoutineCard key={routine.id} routine={routine} />
          ))}
        </View>

        <View style={styles.fabRow}>
          <Link href="/routines/create" asChild>
            <Pressable
              accessibilityLabel="Create Routine"
              accessibilityRole="button"
              style={({ pressed }) => [styles.fab, pressed && styles.pressed]}>
              <AppIcon color={DesignColors.onPrimaryContainer} name="add" size={22} />
            </Pressable>
          </Link>
        </View>
      </View>
    </TabScreen>
  );
}

function RoutineCard({ routine }: { routine: RoutineSummary }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardTopRow}>
        <View style={styles.iconTile}>
          <AppIcon color={SemanticColors.action} name={routine.icon} size={19} />
        </View>

        <View style={styles.actionRow}>
          <Link href={{ pathname: '/routines/[id]/edit', params: { id: routine.id } }} asChild>
            <Pressable
              accessibilityLabel={`Edit ${routine.title}`}
              accessibilityRole="button"
              hitSlop={8}
              style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
              <AppIcon color={SemanticColors.actionSoft} name="edit" size={17} />
            </Pressable>
          </Link>

          <Link href={{ pathname: '/routines/[id]', params: { id: routine.id } }} asChild>
            <Pressable
              accessibilityLabel={`Open ${routine.title}`}
              accessibilityRole="button"
              hitSlop={8}
              style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
              <AppIcon color={SemanticColors.actionSoft} name="open" size={17} />
            </Pressable>
          </Link>
        </View>
      </View>

      <View style={styles.cardCopy}>
        <ThemedText style={styles.cardTitle}>{routine.title}</ThemedText>
        <ThemedText style={styles.cardDescription}>{routine.description}</ThemedText>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metricBlock}>
          <ThemedText style={styles.metaLabel}>{routine.statLabel}</ThemedText>
          <ThemedText style={styles.metricValue}>{routine.statValue}</ThemedText>
        </View>

        <View style={styles.metricBlock}>
          <ThemedText style={styles.metaLabel}>Schedule</ThemedText>
          <View style={styles.scheduleRow}>
            {routine.schedule.map((day) => (
              <View key={day} style={styles.scheduleChip}>
                <ThemedText style={styles.scheduleText}>{day}</ThemedText>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.divider} />
      <ThemedText style={styles.lastCompleted}>{routine.lastCompleted}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: SemanticColors.canvas,
  },
  scrollContent: {
    alignItems: 'center',
    backgroundColor: SemanticColors.canvas,
    paddingBottom: 116,
    paddingHorizontal: Spacing.three,
  },
  content: {
    gap: Spacing.three,
    maxWidth: MaxContentWidth,
    paddingTop: Spacing.two,
    width: '100%',
  },
  heading: {
    gap: Space.xs,
    paddingTop: Space.xs,
  },
  eyebrow: {
    ...TypeScale.labelMd,
    color: DesignColors.onSurfaceVariant,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  title: {
    ...TypeScale.headlineMd,
    color: SemanticColors.textPrimary,
  },
  list: {
    gap: Spacing.three,
  },
  card: {
    backgroundColor: ComponentTokens.card.background,
    borderColor: ComponentTokens.card.borderColor,
    borderCurve: 'continuous',
    borderRadius: ComponentTokens.card.radius,
    borderWidth: ComponentTokens.card.borderWidth,
    gap: Spacing.two,
    padding: Spacing.three,
  },
  cardTopRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconTile: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 95, 31, 0.14)',
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Space.xs,
  },
  iconButton: {
    alignItems: 'center',
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  cardCopy: {
    gap: Space.xs,
  },
  cardTitle: {
    ...Typography.lg,
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.heading,
  },
  cardDescription: {
    ...Typography.sm,
    color: SemanticColors.actionSoft,
    fontFamily: Fonts.bodyMedium,
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    gap: Spacing.four,
  },
  metricBlock: {
    gap: Space.xs,
    minWidth: 82,
  },
  metaLabel: {
    ...Typography.xs,
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.bodyBold,
  },
  metricValue: {
    ...Typography.lg,
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.heading,
    fontVariant: ['tabular-nums'],
  },
  scheduleRow: {
    flexDirection: 'row',
    gap: Space.xs,
  },
  scheduleChip: {
    alignItems: 'center',
    backgroundColor: SemanticColors.action,
    borderRadius: Radius.full,
    height: 22,
    justifyContent: 'center',
    minWidth: 22,
    paddingHorizontal: Space.xs,
  },
  scheduleText: {
    ...Typography.xs,
    color: DesignColors.onPrimaryContainer,
    fontFamily: Fonts.bodyBold,
    fontSize: 10,
    lineHeight: 12,
  },
  divider: {
    backgroundColor: SemanticColors.border,
    height: 1,
  },
  lastCompleted: {
    ...Typography.xs,
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    fontStyle: 'italic',
  },
  fabRow: {
    alignItems: 'flex-end',
    paddingBottom: Space.xs,
    paddingTop: Space.xs,
  },
  fab: {
    alignItems: 'center',
    backgroundColor: SemanticColors.action,
    borderRadius: Radius.full,
    boxShadow: '0 12px 22px rgba(255, 95, 31, 0.24)',
    height: 58,
    justifyContent: 'center',
    width: 58,
  },
  pressed: {
    opacity: 0.72,
    transform: [{ scale: 0.99 }],
  },
});

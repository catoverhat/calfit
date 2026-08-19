import { router, type Href } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

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
  TouchTarget,
  TypeScale,
  Typography,
} from '@/constants/theme';

const summaryStats = [
  { icon: 'timer', label: 'Duration', value: '52m' },
  { icon: 'strength', label: 'Exercises', value: '6' },
  { icon: 'sets', label: 'Total Sets', value: '18' },
  { icon: 'volume', label: 'Total Volume', value: '12,450 lb' },
] satisfies { icon: AppIconName; label: string; value: string }[];

const intensityBars = [
  { height: 54, tone: 'muted' },
  { height: 116, tone: 'active' },
  { height: 82, tone: 'muted' },
  { height: 128, tone: 'active' },
  { height: 68, tone: 'muted' },
  { height: 100, tone: 'active' },
] as const;

export function WorkoutSummaryScreen() {
  const [notes, setNotes] = useState('');

  const saveWorkout = () => {
    router.replace('/(tabs)/index' as Href);
  };

  return (
    <TabScreen
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Header
          actionAccessibilityLabel="Sync workout summary"
          actionIcon="cloud"
          actionIconColor={SemanticColors.actionSoft}
          avatarUrl={MOCK_USER.avatarUrl}
          onNotificationsPress={() => router.push('/progress/sync' as Href)}
          profileName={MOCK_USER.name}
        />

        <View style={styles.heroBlock}>
          <View style={styles.endedPill}>
            <AppIcon color={SemanticColors.action} name="trophy" size={14} />
            <Text style={styles.endedText}>Workout Session Ended</Text>
          </View>

          <Text style={styles.title}>Workout Completed!</Text>
          <View style={styles.checkRing}>
            <AppIcon color={SemanticColors.action} name="check" size={26} />
          </View>
          <Text style={styles.subtitle}>
            You&apos;ve reached your goals for today.{'\n'}Discipline pays off.
          </Text>
        </View>

        <View style={styles.statsGrid}>
          {summaryStats.map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <AppIcon color={SemanticColors.action} name={stat.icon} size={18} />
              <View style={styles.statCopy}>
                <Text style={styles.statLabel}>{stat.label}</Text>
                <Text style={styles.statValue}>{stat.value}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.recordCard}>
          <View style={styles.sectionTitleRow}>
            <AppIcon color={SemanticColors.action} name="star" size={20} />
            <Text style={styles.recordTitle}>New Personal Record</Text>
          </View>
          <Text style={styles.recordDescription}>
            You hit a new PR on Barbell Deadlift. Your volume increased by 12%
            compared to last week&apos;s session.
          </Text>
          <View style={styles.prRow}>
            <View style={styles.prBox}>
              <Text style={styles.prLabel}>Previous Best</Text>
              <Text style={styles.prValue}>315 lb</Text>
            </View>
            <View style={[styles.prBox, styles.prBoxActive]}>
              <Text style={styles.prLabelActive}>Today&apos;s PR</Text>
              <Text style={styles.prValueActive}>335 lb</Text>
            </View>
          </View>
        </View>

        <View style={styles.notesBlock}>
          <View style={styles.sectionTitleRow}>
            <AppIcon color={SemanticColors.textPrimary} name="notes" size={17} />
            <Text style={styles.notesTitle}>Workout Notes</Text>
          </View>
          <TextInput
            accessibilityLabel="Workout notes"
            multiline
            numberOfLines={4}
            onChangeText={setNotes}
            placeholder="How did you feel? Note any adjustments for next time..."
            placeholderTextColor={DesignColors.onSecondaryContainer}
            selectionColor={ComponentTokens.input.selectionColor}
            style={styles.notesInput}
            textAlignVertical="top"
            value={notes}
          />
        </View>

        <View style={styles.actions}>
          <Pressable
            accessibilityLabel="Save workout"
            accessibilityRole="button"
            onPress={saveWorkout}
            style={({ pressed }) => [styles.saveButton, pressed && styles.saveButtonPressed]}>
            <AppIcon color={DesignColors.onPrimaryContainer} name="save" size={16} />
            <Text style={styles.saveText}>Save Workout</Text>
          </Pressable>
          <Pressable
            accessibilityLabel="View workout history"
            accessibilityRole="button"
            onPress={() => router.push('/progress/history' as Href)}
            style={({ pressed }) => [styles.historyButton, pressed && styles.pressed]}>
            <AppIcon color={SemanticColors.action} name="history" size={17} />
            <Text style={styles.historyText}>View History</Text>
          </Pressable>
        </View>

        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Intensity Distribution</Text>
            <View style={styles.dots}>
              <View style={styles.dotActive} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </View>
          <View style={styles.chartPlot}>
            <View style={styles.barRow}>
              {intensityBars.map((bar, index) => (
                <View
                  key={`${bar.tone}-${index}`}
                  style={[
                    styles.bar,
                    {
                      backgroundColor:
                        bar.tone === 'active' ? SemanticColors.action : DesignColors.surfaceContainerHighest,
                      height: bar.height,
                    },
                  ]}
                />
              ))}
            </View>
            <View style={styles.chartLabels}>
              <Text style={styles.chartLabel}>Start</Text>
              <Text style={styles.chartLabel}>Peak</Text>
              <Text style={styles.chartLabel}>End</Text>
            </View>
          </View>
        </View>
      </View>
    </TabScreen>
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
  heroBlock: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingTop: Spacing.one,
  },
  endedPill: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 95, 31, 0.14)',
    borderColor: 'rgba(255, 95, 31, 0.34)',
    borderRadius: Radius.full,
    borderWidth: 1,
    flexDirection: 'row',
    gap: Spacing.one,
    minHeight: 34,
    paddingHorizontal: Spacing.three,
  },
  endedText: {
    color: SemanticColors.action,
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 0.8,
    lineHeight: 15,
    textTransform: 'uppercase',
  },
  title: {
    ...TypeScale.headlineMd,
    color: SemanticColors.textPrimary,
    textAlign: 'center',
  },
  checkRing: {
    alignItems: 'center',
    borderColor: SemanticColors.action,
    borderRadius: Radius.full,
    borderWidth: 2,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  subtitle: {
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  statCard: {
    backgroundColor: DesignColors.surfaceContainerLow,
    borderColor: SemanticColors.border,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    flexBasis: '48%',
    flexGrow: 1,
    gap: Spacing.four,
    minHeight: 136,
    padding: Spacing.three,
  },
  statCopy: {
    gap: Spacing.half,
  },
  statLabel: {
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    lineHeight: 14,
  },
  statValue: {
    ...Typography.xl,
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.heading,
    fontVariant: ['tabular-nums'],
    lineHeight: 26,
  },
  recordCard: {
    backgroundColor: DesignColors.surfaceContainerLow,
    borderColor: SemanticColors.border,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    gap: Spacing.two,
    padding: Spacing.three,
  },
  sectionTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.two,
  },
  recordTitle: {
    ...Typography.lg,
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.heading,
  },
  recordDescription: {
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 19,
  },
  prRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    paddingTop: Spacing.one,
  },
  prBox: {
    backgroundColor: DesignColors.surfaceContainerLowest,
    borderColor: SemanticColors.border,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    gap: Spacing.half,
    minHeight: 58,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  prBoxActive: {
    backgroundColor: 'rgba(255, 95, 31, 0.16)',
    borderColor: 'rgba(255, 95, 31, 0.35)',
  },
  prLabel: {
    color: SemanticColors.textSecondary,
    fontFamily: Fonts.bodyBold,
    fontSize: 10,
    lineHeight: 13,
  },
  prLabelActive: {
    color: SemanticColors.actionSoft,
    fontFamily: Fonts.bodyBold,
    fontSize: 10,
    lineHeight: 13,
  },
  prValue: {
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.heading,
    fontSize: 16,
    lineHeight: 20,
  },
  prValueActive: {
    color: SemanticColors.action,
    fontFamily: Fonts.heading,
    fontSize: 16,
    lineHeight: 20,
  },
  notesBlock: {
    gap: Spacing.two,
  },
  notesTitle: {
    ...Typography.lg,
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.heading,
  },
  notesInput: {
    backgroundColor: DesignColors.surfaceContainerLowest,
    borderColor: SemanticColors.border,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 19,
    minHeight: 112,
    padding: Spacing.three,
  },
  actions: {
    gap: Spacing.two,
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: SemanticColors.action,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    flexDirection: 'row',
    gap: Spacing.two,
    justifyContent: 'center',
    minHeight: TouchTarget.min,
  },
  saveButtonPressed: {
    backgroundColor: DesignColors.inversePrimary,
    transform: [{ scale: 0.99 }],
  },
  saveText: {
    color: DesignColors.onPrimaryContainer,
    fontFamily: Fonts.bodyBold,
    fontSize: 13,
    letterSpacing: 0.6,
    lineHeight: 18,
    textTransform: 'uppercase',
  },
  historyButton: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderColor: SemanticColors.action,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: Spacing.two,
    justifyContent: 'center',
    minHeight: TouchTarget.min,
  },
  historyText: {
    color: SemanticColors.action,
    fontFamily: Fonts.bodyBold,
    fontSize: 13,
    letterSpacing: 0.6,
    lineHeight: 18,
    textTransform: 'uppercase',
  },
  chartCard: {
    backgroundColor: DesignColors.surfaceContainerLow,
    borderColor: SemanticColors.border,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    gap: Spacing.three,
    padding: Spacing.three,
  },
  chartHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chartTitle: {
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
    letterSpacing: 1,
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  dots: {
    flexDirection: 'row',
    gap: Spacing.one,
  },
  dot: {
    backgroundColor: DesignColors.surfaceContainerHighest,
    borderRadius: 3,
    height: 6,
    width: 6,
  },
  dotActive: {
    backgroundColor: SemanticColors.action,
    borderRadius: 3,
    height: 6,
    width: 6,
  },
  chartPlot: {
    backgroundColor: DesignColors.surfaceContainerLowest,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    minHeight: 184,
    padding: Spacing.three,
  },
  barRow: {
    alignItems: 'flex-end',
    flex: 1,
    flexDirection: 'row',
    gap: Spacing.two,
    justifyContent: 'space-around',
    minHeight: 132,
  },
  bar: {
    borderRadius: Radius.sm,
    width: 40,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.two,
    paddingTop: Spacing.two,
  },
  chartLabel: {
    color: SemanticColors.textMuted,
    fontFamily: Fonts.bodyBold,
    fontSize: 10,
    lineHeight: 13,
    textTransform: 'uppercase',
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.99 }],
  },
});

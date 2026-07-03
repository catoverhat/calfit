import { Image } from 'expo-image';
import { router, type Href } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MOCK_USER, MOCK_WORKOUTS } from '@/constants/mock-data';
import { Fonts, MaxContentWidth, Palette, Spacing, Typography } from '@/constants/theme';

const weekDays = [
  { date: '23', day: 'M' },
  { date: '24', day: 'T' },
  { date: '25', day: 'W' },
  { date: '26', day: 'T' },
  { date: '27', day: 'F' },
  { date: '28', day: 'S' },
  { date: '29', day: 'S' },
] as const;

const todayDashboard = {
  dateLabel: 'Tuesday, Oct 24',
  name: 'Dan',
  routine: {
    id: MOCK_WORKOUTS[0].id,
    title: 'Push Day',
    focus: 'Hypertrophy - Chest, Shoulders, Triceps',
    scheduledTime: '9:00 AM',
    exercises: 6,
    duration: '45 min',
  },
  progress: {
    bodyWeight: '78.4 kg',
    bodyWeightDelta: '+0.2kg vs last week',
    streak: '12 days',
    calories: '1,840 / 2,400',
    caloriesProgress: 0.76,
  },
  tip: '"Intensity over duration. Focus on the squeeze today."',
} as const;

export function TodayDashboardScreen() {
  const [selectedDate, setSelectedDate] = useState('24');

  const startWorkout = () => {
    router.push({
      pathname: '/workout-session/[id]',
      params: { id: todayDashboard.routine.id },
    } as unknown as Href);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        style={styles.screen}>
        <View style={styles.content}>
          <View style={styles.brandBar}>
            <View style={styles.brandLeft}>
              <Image
                accessibilityLabel={`${MOCK_USER.name}'s profile photo`}
                contentFit="cover"
                source={MOCK_USER.avatarUrl}
                style={styles.avatar}
              />
              <Text style={styles.brandName}>Kinetic Pulse</Text>
            </View>
            <View style={styles.syncPill}>
              <CloudCheckIcon />
              <Text style={styles.syncText}>Sync completed</Text>
            </View>
          </View>

          <View style={styles.greetingBlock}>
            <Text style={styles.dateLabel}>{todayDashboard.dateLabel}</Text>
            <Text style={styles.greeting}>Good morning, {todayDashboard.name}!</Text>
          </View>

          <View style={styles.weekCard}>
            {weekDays.map((item) => {
              const selected = item.date === selectedDate;

              return (
                <Pressable
                  accessibilityLabel={`${item.day} ${item.date}`}
                  accessibilityRole="button"
                  key={`${item.day}-${item.date}`}
                  onPress={() => setSelectedDate(item.date)}
                  style={({ pressed }) => [
                    styles.dayCell,
                    selected && styles.dayCellSelected,
                    pressed && styles.pressed,
                  ]}>
                  <Text style={[styles.dayLabel, selected && styles.dayTextSelected]}>
                    {item.day}
                  </Text>
                  <Text style={[styles.dayDate, selected && styles.dayTextSelected]}>
                    {item.date}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.workoutCard}>
            <View style={styles.schedulePill}>
              <View style={styles.scheduleDot} />
              <Text style={styles.scheduleText}>
                Scheduled for {todayDashboard.routine.scheduledTime}
              </Text>
            </View>

            <View style={styles.cardTitleRow}>
              <View style={styles.workoutCopy}>
                <Text style={styles.workoutTitle}>{todayDashboard.routine.title}</Text>
                <Text style={styles.focusText}>Focus: {todayDashboard.routine.focus}</Text>
              </View>
              <DumbbellMark />
            </View>

            <View style={styles.workoutMeta}>
              <View style={styles.metaItem}>
                <GridIcon />
                <Text style={styles.metaText}>{todayDashboard.routine.exercises} Exercises</Text>
              </View>
              <View style={styles.metaItem}>
                <ClockIcon />
                <Text style={styles.metaText}>{todayDashboard.routine.duration}</Text>
              </View>
            </View>

            <Pressable
              accessibilityLabel="Start Workout"
              accessibilityRole="button"
              onPress={startWorkout}
              style={({ pressed }) => [styles.startButton, pressed && styles.startButtonPressed]}>
              <Text style={styles.playIcon}>{'>'}</Text>
              <Text style={styles.startButtonText}>Start Workout</Text>
            </Pressable>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionEyebrow}>Recent Progress</Text>
            <View style={styles.progressGrid}>
              <View style={[styles.progressCard, styles.weightCard]}>
                <Text style={styles.progressLabel}>Body Weight</Text>
                <Text style={styles.progressValue}>{todayDashboard.progress.bodyWeight}</Text>
                <Text style={styles.deltaText}>{todayDashboard.progress.bodyWeightDelta}</Text>
              </View>

              <View style={styles.progressCard}>
                <Text style={styles.progressLabel}>Streak</Text>
                <Text style={styles.progressValue}>{todayDashboard.progress.streak}</Text>
                <View style={styles.streakTrack}>
                  <View style={styles.streakFill} />
                </View>
              </View>
            </View>

            <View style={styles.caloriesCard}>
              <View style={styles.caloriesHeader}>
                <Text style={styles.progressLabel}>Daily Calories</Text>
                <FlameIcon />
              </View>
              <Text style={styles.calorieValue}>{todayDashboard.progress.calories}</Text>
              <View style={styles.calorieProgressRow}>
                <View style={styles.calorieTrack}>
                  <View
                    style={[
                      styles.calorieFill,
                      { width: `${todayDashboard.progress.caloriesProgress * 100}%` },
                    ]}
                  />
                </View>
                <Text style={styles.caloriePercent}>76%</Text>
              </View>
            </View>
          </View>

          <View style={styles.tipCard}>
            <View style={styles.tipIcon}>
              <MedalIcon />
            </View>
            <Text style={styles.tipText}>{todayDashboard.tip}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function CloudCheckIcon() {
  return (
    <View accessibilityElementsHidden style={styles.cloudIcon}>
      <View style={styles.cloudBody} />
      <Text style={styles.cloudCheck}>OK</Text>
    </View>
  );
}

function DumbbellMark() {
  return (
    <View accessibilityElementsHidden style={styles.dumbbellMark}>
      <View style={styles.dumbbellLine} />
      <View style={[styles.dumbbellPlate, styles.dumbbellPlateLeft]} />
      <View style={[styles.dumbbellPlate, styles.dumbbellPlateRight]} />
      <View style={[styles.dumbbellPlate, styles.dumbbellPlateFarLeft]} />
      <View style={[styles.dumbbellPlate, styles.dumbbellPlateFarRight]} />
    </View>
  );
}

function GridIcon() {
  return (
    <View accessibilityElementsHidden style={styles.gridIcon}>
      <View style={styles.gridLineHorizontal} />
      <View style={styles.gridLineVertical} />
    </View>
  );
}

function ClockIcon() {
  return (
    <View accessibilityElementsHidden style={styles.clockIcon}>
      <View style={styles.clockHandTall} />
      <View style={styles.clockHandWide} />
    </View>
  );
}

function FlameIcon() {
  return <Text accessibilityElementsHidden style={styles.flameIcon}>F</Text>;
}

function MedalIcon() {
  return <Text accessibilityElementsHidden style={styles.medalIcon}>O</Text>;
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Palette.secondary[950],
    flex: 1,
  },
  screen: {
    backgroundColor: Palette.secondary[950],
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    flexGrow: 1,
    paddingBottom: 104,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
  },
  content: {
    gap: Spacing.three,
    maxWidth: Math.min(MaxContentWidth, 430),
    width: '100%',
  },
  brandBar: {
    alignItems: 'center',
    backgroundColor: 'rgba(13, 14, 18, 0.96)',
    borderColor: Palette.secondary[800],
    borderCurve: 'continuous',
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 56,
    paddingHorizontal: Spacing.two,
  },
  brandLeft: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: Spacing.two,
    minWidth: 0,
  },
  avatar: {
    borderColor: Palette.primary[700],
    borderRadius: 19,
    borderWidth: 1,
    height: 38,
    width: 38,
  },
  brandName: {
    ...Typography.base,
    color: Palette.white,
    fontFamily: Fonts.heading,
  },
  syncPill: {
    alignItems: 'center',
    backgroundColor: '#272525',
    borderCurve: 'continuous',
    borderRadius: 16,
    flexDirection: 'row',
    gap: Spacing.one,
    minHeight: 30,
    paddingHorizontal: Spacing.two,
  },
  syncText: {
    color: Palette.white,
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    lineHeight: 14,
  },
  cloudIcon: {
    alignItems: 'center',
    height: 14,
    justifyContent: 'center',
    width: 18,
  },
  cloudBody: {
    backgroundColor: '#1DBA66',
    borderRadius: 8,
    height: 12,
    width: 18,
  },
  cloudCheck: {
    color: Palette.secondary[950],
    fontFamily: Fonts.bodyBold,
    fontSize: 6,
    lineHeight: 8,
    position: 'absolute',
  },
  greetingBlock: {
    gap: Spacing.one,
  },
  dateLabel: {
    color: Palette.primary[400],
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  greeting: {
    ...Typography['3xl'],
    color: Palette.white,
    fontFamily: Fonts.heading,
    lineHeight: 34,
  },
  weekCard: {
    backgroundColor: '#1F1D1D',
    borderColor: '#343131',
    borderCurve: 'continuous',
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    gap: Spacing.one,
    justifyContent: 'space-between',
    padding: Spacing.two,
  },
  dayCell: {
    alignItems: 'center',
    borderCurve: 'continuous',
    borderRadius: 8,
    flex: 1,
    gap: 2,
    minHeight: 54,
    minWidth: 36,
    paddingVertical: Spacing.one,
  },
  dayCellSelected: {
    backgroundColor: Palette.primary[500],
  },
  pressed: {
    opacity: 0.68,
  },
  dayLabel: {
    color: Palette.neutral[400],
    fontFamily: Fonts.bodyBold,
    fontSize: 10,
    lineHeight: 14,
  },
  dayDate: {
    color: Palette.white,
    fontFamily: Fonts.bodyBold,
    fontSize: 13,
    lineHeight: 18,
  },
  dayTextSelected: {
    color: Palette.secondary[950],
  },
  workoutCard: {
    backgroundColor: '#2A2828',
    borderColor: '#3B3838',
    borderCurve: 'continuous',
    borderRadius: 10,
    borderWidth: 1,
    gap: Spacing.three,
    padding: Spacing.three,
  },
  schedulePill: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 95, 31, 0.14)',
    borderColor: 'rgba(255, 95, 31, 0.28)',
    borderRadius: 13,
    borderWidth: 1,
    flexDirection: 'row',
    gap: Spacing.one,
    minHeight: 26,
    paddingHorizontal: Spacing.two,
  },
  scheduleDot: {
    backgroundColor: Palette.primary[500],
    borderRadius: 3,
    height: 6,
    width: 6,
  },
  scheduleText: {
    color: Palette.primary[400],
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    lineHeight: 14,
  },
  cardTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.two,
  },
  workoutCopy: {
    flex: 1,
    gap: Spacing.one,
  },
  workoutTitle: {
    ...Typography['2xl'],
    color: Palette.white,
    fontFamily: Fonts.heading,
    lineHeight: 30,
  },
  focusText: {
    color: Palette.white,
    fontFamily: Fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
  },
  dumbbellMark: {
    height: 58,
    transform: [{ rotate: '-45deg' }],
    width: 58,
  },
  dumbbellLine: {
    backgroundColor: Palette.primary[800],
    height: 8,
    left: 10,
    position: 'absolute',
    top: 25,
    width: 38,
  },
  dumbbellPlate: {
    backgroundColor: Palette.primary[800],
    borderRadius: 2,
    height: 21,
    position: 'absolute',
    top: 18,
    width: 7,
  },
  dumbbellPlateLeft: {
    left: 6,
  },
  dumbbellPlateRight: {
    right: 6,
  },
  dumbbellPlateFarLeft: {
    left: 16,
  },
  dumbbellPlateFarRight: {
    right: 16,
  },
  workoutMeta: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  metaItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.one,
  },
  metaText: {
    color: Palette.white,
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
    lineHeight: 16,
  },
  gridIcon: {
    borderColor: Palette.primary[500],
    borderRadius: 2,
    borderWidth: 1.5,
    height: 14,
    width: 14,
  },
  gridLineHorizontal: {
    backgroundColor: Palette.primary[500],
    height: 1.5,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 5,
  },
  gridLineVertical: {
    backgroundColor: Palette.primary[500],
    bottom: 0,
    left: 5,
    position: 'absolute',
    top: 0,
    width: 1.5,
  },
  clockIcon: {
    borderColor: Palette.primary[500],
    borderRadius: 7,
    borderWidth: 1.5,
    height: 14,
    width: 14,
  },
  clockHandTall: {
    backgroundColor: Palette.primary[500],
    height: 5,
    left: 5,
    position: 'absolute',
    top: 2,
    width: 1.5,
  },
  clockHandWide: {
    backgroundColor: Palette.primary[500],
    height: 1.5,
    left: 5,
    position: 'absolute',
    top: 6,
    width: 4,
  },
  startButton: {
    alignItems: 'center',
    backgroundColor: Palette.primary[500],
    borderCurve: 'continuous',
    borderRadius: 7,
    flexDirection: 'row',
    gap: Spacing.two,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: Spacing.three,
  },
  startButtonPressed: {
    backgroundColor: Palette.primary[600],
    transform: [{ scale: 0.99 }],
  },
  playIcon: {
    color: Palette.secondary[950],
    fontFamily: Fonts.bodyBold,
    fontSize: 15,
    lineHeight: 18,
  },
  startButtonText: {
    color: Palette.secondary[950],
    fontFamily: Fonts.bodyBold,
    fontSize: 17,
    lineHeight: 22,
  },
  section: {
    gap: Spacing.two,
  },
  sectionEyebrow: {
    color: Palette.primary[400],
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  progressGrid: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  progressCard: {
    backgroundColor: '#1F1D1D',
    borderColor: '#343131',
    borderCurve: 'continuous',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    gap: Spacing.two,
    minHeight: 112,
    padding: Spacing.three,
  },
  weightCard: {
    borderLeftColor: Palette.primary[500],
    borderLeftWidth: 3,
  },
  progressLabel: {
    color: Palette.neutral[300],
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    lineHeight: 15,
  },
  progressValue: {
    ...Typography.xl,
    color: Palette.white,
    fontFamily: Fonts.heading,
    lineHeight: 26,
  },
  deltaText: {
    color: '#2AD06F',
    fontFamily: Fonts.bodyBold,
    fontSize: 10,
    lineHeight: 14,
  },
  streakTrack: {
    backgroundColor: '#3A3737',
    borderRadius: 2,
    height: 5,
    overflow: 'hidden',
    width: '100%',
  },
  streakFill: {
    backgroundColor: Palette.primary[500],
    height: '100%',
    width: '58%',
  },
  caloriesCard: {
    backgroundColor: '#1F1D1D',
    borderColor: '#343131',
    borderCurve: 'continuous',
    borderRadius: 8,
    borderWidth: 1,
    gap: Spacing.two,
    padding: Spacing.three,
  },
  caloriesHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flameIcon: {
    color: Palette.tertiary[300],
    fontFamily: Fonts.bodyBold,
    fontSize: 16,
    lineHeight: 18,
  },
  calorieValue: {
    ...Typography['2xl'],
    color: Palette.white,
    fontFamily: Fonts.heading,
    lineHeight: 30,
  },
  calorieProgressRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.two,
  },
  calorieTrack: {
    backgroundColor: '#3A3737',
    borderRadius: 3,
    flex: 1,
    height: 8,
    overflow: 'hidden',
  },
  calorieFill: {
    backgroundColor: Palette.tertiary[300],
    height: '100%',
  },
  caloriePercent: {
    color: Palette.tertiary[300],
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
    lineHeight: 16,
    width: 38,
  },
  tipCard: {
    alignItems: 'center',
    backgroundColor: '#111010',
    borderColor: '#383434',
    borderCurve: 'continuous',
    borderRadius: 9,
    borderWidth: 1,
    flexDirection: 'row',
    gap: Spacing.three,
    padding: Spacing.three,
  },
  tipIcon: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 95, 31, 0.12)',
    borderColor: 'rgba(255, 95, 31, 0.35)',
    borderRadius: 18,
    borderWidth: 1,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  medalIcon: {
    color: Palette.primary[500],
    fontFamily: Fonts.bodyBold,
    fontSize: 18,
    lineHeight: 20,
  },
  tipText: {
    color: Palette.white,
    flex: 1,
    fontFamily: Fonts.bodyMedium,
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 19,
  },
});

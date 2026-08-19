import { Image } from 'expo-image';
import { router, type Href } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
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
import type { WorkoutViewModel } from '@/hooks/today-dashboard-view-model';

export type ActiveWorkoutSessionWorkout = WorkoutViewModel;

type ActiveWorkoutSessionScreenProps = {
  workout: ActiveWorkoutSessionWorkout;
};

const completedSetRows = [
  { id: 1, reps: '10 reps', weight: '135 lb' },
  { id: 2, reps: '8 reps', weight: '145 lb' },
] as const;

const exerciseMetaById: Record<string, string> = {
  'bench-press': 'Chest - Barbell',
  'shoulder-press': 'Shoulders - Barbell',
  'push-ups': 'Chest - Bodyweight',
  'back-squat': 'Legs - Barbell',
  'romanian-deadlift': 'Hamstrings - Barbell',
  'calf-raise': 'Calves - Machine',
  'goblet-squat': 'Legs - Dumbbell',
  'dumbbell-press': 'Chest - Dumbbell',
  row: 'Back - Dumbbell',
  'warm-up': 'Cardio - Warm-up',
  'tempo-run': 'Cardio - Run',
  cooldown: 'Cardio - Recovery',
};

export function ActiveWorkoutSessionScreen({ workout }: ActiveWorkoutSessionScreenProps) {
  const activeExercise = workout.exercises[0];
  const lockedExercise = workout.exercises[1] ?? workout.exercises[0];
  const lockedExerciseName =
    workout.id === 'push-day' && lockedExercise.id === 'shoulder-press'
      ? 'Overhead Press'
      : lockedExercise.name;
  const activeMeta = exerciseMetaById[activeExercise.id] ?? 'Chest - Barbell';
  const lockedMeta = exerciseMetaById[lockedExercise.id] ?? 'Shoulders - Barbell';

  const [completedSets, setCompletedSets] = useState(() => new Set<number>([1, 2]));
  const [currentWeight, setCurrentWeight] = useState('155');
  const [currentReps, setCurrentReps] = useState('8');
  const [currentSetDone, setCurrentSetDone] = useState(false);

  const sessionTitle = useMemo(() => workout.title || 'Push Day', [workout.title]);

  const finishWorkout = () => {
    router.replace('/progress/summary' as Href);
  };

  const toggleCompletedSet = (setId: number) => {
    setCompletedSets((current) => {
      const next = new Set(current);

      if (next.has(setId)) {
        next.delete(setId);
      } else {
        next.add(setId);
      }

      return next;
    });
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      style={styles.screen}>
      <View style={styles.content}>
        <View style={styles.sessionHeader}>
          <View style={styles.sessionIdentity}>
            <Image
              accessibilityLabel={`${MOCK_USER.name}'s profile photo`}
              contentFit="cover"
              source={MOCK_USER.avatarUrl}
              style={styles.avatar}
            />
            <View style={styles.titleBlock}>
              <Text numberOfLines={1} style={styles.sessionTitle}>
                {sessionTitle}
              </Text>
              <Text style={styles.inProgress}>In Progress</Text>
            </View>
          </View>

          <View style={styles.headerActions}>
            <View style={styles.offlineStatus}>
              <AppIcon color={SemanticColors.textPrimary} name="offline" size={13} />
              <Text style={styles.offlineText}>Saved Offline</Text>
            </View>
            <Pressable
              accessibilityLabel="Session timer"
              accessibilityRole="button"
              style={({ pressed }) => [styles.timerButton, pressed && styles.pressed]}>
              <AppIcon color={SemanticColors.action} name="timer" size={20} />
            </Pressable>
          </View>
        </View>

        <View style={styles.timeCard}>
          <View>
            <Text style={styles.smallLabel}>Session Time</Text>
            <Text style={styles.timeValue}>14:22</Text>
          </View>
          <View style={styles.activePill}>
            <View style={styles.activeDot} />
            <Text style={styles.activeText}>Active</Text>
          </View>
        </View>

        <View style={styles.exerciseCard}>
          <View style={styles.exerciseHeader}>
            <View style={styles.exerciseTitleBlock}>
              <Text style={styles.exerciseTitle}>{activeExercise.name}</Text>
              <Text style={styles.exerciseMeta}>{activeMeta}</Text>
            </View>
            <Pressable
              accessibilityLabel={`${activeExercise.name} information`}
              accessibilityRole="button"
              style={({ pressed }) => [styles.infoButton, pressed && styles.pressed]}>
              <AppIcon color={SemanticColors.textPrimary} name="info" size={18} />
            </Pressable>
          </View>

          <View style={styles.setList}>
            {completedSetRows.map((setRow) => {
              const completed = completedSets.has(setRow.id);

              return (
                <View key={setRow.id} style={styles.completedSetRow}>
                  <View style={styles.setNumber}>
                    <Text style={styles.setNumberText}>{setRow.id}</Text>
                  </View>
                  <Text style={styles.setValue}>{setRow.weight}</Text>
                  <Text style={styles.setValue}>{setRow.reps}</Text>
                  <Pressable
                    accessibilityLabel={`Toggle set ${setRow.id}`}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: completed }}
                    onPress={() => toggleCompletedSet(setRow.id)}
                    style={({ pressed }) => [
                      styles.setCheckButton,
                      !completed && styles.setCheckButtonInactive,
                      pressed && styles.pressed,
                    ]}>
                    <AppIcon
                      color={completed ? DesignColors.primaryFixed : SemanticColors.textMuted}
                      name="check"
                      size={16}
                    />
                  </Pressable>
                </View>
              );
            })}

            <View style={styles.currentSetRow}>
              <View style={styles.currentSetNumber}>
                <Text style={styles.currentSetNumberText}>3</Text>
              </View>
              <TextInput
                accessibilityLabel="Current set weight"
                keyboardType="number-pad"
                onChangeText={setCurrentWeight}
                selectionColor={ComponentTokens.input.selectionColor}
                style={styles.currentInput}
                value={currentWeight}
              />
              <Text style={styles.multiplyText}>x</Text>
              <TextInput
                accessibilityLabel="Current set repetitions"
                keyboardType="number-pad"
                onChangeText={setCurrentReps}
                selectionColor={ComponentTokens.input.selectionColor}
                style={styles.currentInput}
                value={currentReps}
              />
              <Pressable
                accessibilityLabel="Complete current set"
                accessibilityRole="checkbox"
                accessibilityState={{ checked: currentSetDone }}
                onPress={() => setCurrentSetDone((value) => !value)}
                style={({ pressed }) => [
                  styles.currentToggle,
                  currentSetDone && styles.currentToggleDone,
                  pressed && styles.pressed,
                ]}>
                <AppIcon
                  color={currentSetDone ? DesignColors.onPrimaryContainer : DesignColors.primaryFixed}
                  name={currentSetDone ? 'check' : 'stop'}
                  size={16}
                />
              </Pressable>
            </View>
          </View>

          <View style={styles.restCard}>
            <View style={styles.restRing}>
              <Text style={styles.restLabel}>Rest</Text>
              <Text style={styles.restTime}>00:00</Text>
            </View>
            <View style={styles.restActions}>
              <Pressable
                accessibilityLabel="Add thirty seconds to rest"
                accessibilityRole="button"
                style={({ pressed }) => [styles.addRestButton, pressed && styles.pressed]}>
                <Text style={styles.addRestText}>+30 Sec</Text>
              </Pressable>
              <Pressable
                accessibilityLabel="Skip rest"
                accessibilityRole="button"
                style={({ pressed }) => [styles.skipRestButton, pressed && styles.pressed]}>
                <Text style={styles.skipRestText}>Skip Rest</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.lockedCard}>
          <View>
            <Text style={styles.lockedTitle}>{lockedExerciseName}</Text>
            <Text style={styles.lockedMeta}>{lockedMeta}</Text>
          </View>
          <AppIcon color={SemanticColors.textMuted} name="lock" size={22} />
        </View>

        <View style={styles.bottomActions}>
          <Pressable
            accessibilityLabel="Next exercise"
            accessibilityRole="button"
            style={({ pressed }) => [styles.nextButton, pressed && styles.pressed]}>
            <AppIcon color={SemanticColors.action} name="next" size={18} />
            <Text style={styles.nextButtonText}>Next Exercise</Text>
          </Pressable>
          <Pressable
            accessibilityLabel="Finish workout"
            accessibilityRole="button"
            onPress={finishWorkout}
            style={({ pressed }) => [styles.finishButton, pressed && styles.finishButtonPressed]}>
            <AppIcon color={DesignColors.onPrimaryContainer} name="check" size={18} />
            <Text style={styles.finishButtonText}>Finish Workout</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: SemanticColors.canvas,
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    flexGrow: 1,
    paddingBottom: Spacing.five,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
  },
  content: {
    gap: Spacing.three,
    maxWidth: Math.min(MaxContentWidth, 430),
    width: '100%',
  },
  sessionHeader: {
    alignItems: 'center',
    backgroundColor: DesignColors.surfaceContainerLowest,
    borderColor: SemanticColors.border,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: ComponentTokens.card.borderWidth,
    flexDirection: 'row',
    gap: Spacing.two,
    justifyContent: 'space-between',
    minHeight: 72,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
  },
  sessionIdentity: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: Spacing.two,
    minWidth: 0,
  },
  avatar: {
    borderColor: SemanticColors.action,
    borderRadius: 22,
    borderWidth: 1,
    height: 44,
    width: 44,
  },
  titleBlock: {
    flex: 1,
    minWidth: 0,
  },
  sessionTitle: {
    ...TypeScale.headlineSm,
    color: SemanticColors.actionSoft,
  },
  inProgress: {
    color: SemanticColors.action,
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 1.2,
    lineHeight: 14,
    textTransform: 'uppercase',
  },
  headerActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.two,
  },
  offlineStatus: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.one,
  },
  offlineText: {
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
    lineHeight: 16,
  },
  timerButton: {
    alignItems: 'center',
    borderRadius: Radius.full,
    height: TouchTarget.min,
    justifyContent: 'center',
    width: TouchTarget.min,
  },
  timeCard: {
    alignItems: 'center',
    backgroundColor: DesignColors.surfaceContainerLow,
    borderColor: SemanticColors.border,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 88,
    padding: Spacing.three,
  },
  smallLabel: {
    color: SemanticColors.textSecondary,
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
    lineHeight: 16,
  },
  timeValue: {
    ...TypeScale.headlineMd,
    color: SemanticColors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  activePill: {
    alignItems: 'center',
    backgroundColor: DesignColors.surfaceContainerHigh,
    borderRadius: Radius.full,
    flexDirection: 'row',
    gap: Spacing.one,
    minHeight: 32,
    paddingHorizontal: Spacing.three,
  },
  activeDot: {
    backgroundColor: SemanticColors.action,
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  activeText: {
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
    lineHeight: 16,
  },
  exerciseCard: {
    backgroundColor: DesignColors.surfaceContainerLow,
    borderColor: SemanticColors.border,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    gap: Spacing.three,
    padding: Spacing.three,
  },
  exerciseHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.two,
    justifyContent: 'space-between',
  },
  exerciseTitleBlock: {
    flex: 1,
  },
  exerciseTitle: {
    ...TypeScale.headlineSm,
    color: SemanticColors.textPrimary,
  },
  exerciseMeta: {
    color: SemanticColors.textSecondary,
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
    lineHeight: 16,
  },
  infoButton: {
    alignItems: 'center',
    backgroundColor: DesignColors.surfaceContainerHigh,
    borderColor: SemanticColors.border,
    borderRadius: Radius.full,
    borderWidth: 1,
    height: TouchTarget.min,
    justifyContent: 'center',
    width: TouchTarget.min,
  },
  setList: {
    gap: Spacing.two,
  },
  completedSetRow: {
    alignItems: 'center',
    backgroundColor: DesignColors.surfaceContainerLowest,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    flexDirection: 'row',
    gap: Spacing.two,
    minHeight: 64,
    paddingHorizontal: Spacing.two,
  },
  setNumber: {
    alignItems: 'center',
    backgroundColor: DesignColors.surfaceContainerHigh,
    borderRadius: Radius.full,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  setNumberText: {
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.bodyBold,
    fontSize: 15,
    lineHeight: 20,
  },
  setValue: {
    color: SemanticColors.textPrimary,
    flex: 1,
    fontFamily: Fonts.bodyMedium,
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
  setCheckButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 95, 31, 0.42)',
    borderRadius: Radius.md,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  setCheckButtonInactive: {
    backgroundColor: DesignColors.surfaceContainerHigh,
  },
  currentSetRow: {
    alignItems: 'center',
    backgroundColor: DesignColors.surfaceContainerLowest,
    borderColor: SemanticColors.action,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: Spacing.two,
    minHeight: 64,
    paddingHorizontal: Spacing.two,
  },
  currentSetNumber: {
    alignItems: 'center',
    backgroundColor: SemanticColors.action,
    borderRadius: Radius.full,
    height: 36,
    justifyContent: 'center',
    width: 30,
  },
  currentSetNumberText: {
    color: DesignColors.onPrimaryContainer,
    fontFamily: Fonts.bodyBold,
    fontSize: 15,
    lineHeight: 20,
  },
  currentInput: {
    backgroundColor: DesignColors.inputBackground,
    borderCurve: 'continuous',
    borderRadius: Radius.sm,
    color: SemanticColors.textPrimary,
    flex: 1,
    fontFamily: Fonts.bodyBold,
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: Spacing.two,
    textAlign: 'center',
  },
  multiplyText: {
    color: SemanticColors.textSecondary,
    fontFamily: Fonts.bodyBold,
    fontSize: 16,
    lineHeight: 22,
  },
  currentToggle: {
    alignItems: 'center',
    backgroundColor: DesignColors.inputBackground,
    borderColor: DesignColors.primaryFixed,
    borderRadius: Radius.sm,
    borderWidth: 1,
    height: 48,
    justifyContent: 'center',
    width: 34,
  },
  currentToggleDone: {
    backgroundColor: SemanticColors.action,
    borderColor: SemanticColors.action,
  },
  restCard: {
    alignItems: 'center',
    backgroundColor: DesignColors.surfaceContainerLowest,
    borderColor: SemanticColors.border,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: Spacing.three,
    minHeight: 132,
    padding: Spacing.three,
  },
  restRing: {
    alignItems: 'center',
    borderColor: DesignColors.surfaceContainerHighest,
    borderRadius: Radius.full,
    borderWidth: 8,
    height: 96,
    justifyContent: 'center',
    width: 96,
  },
  restLabel: {
    color: SemanticColors.textSecondary,
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
    letterSpacing: 0.8,
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  restTime: {
    ...Typography['2xl'],
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.heading,
    fontVariant: ['tabular-nums'],
    lineHeight: 30,
  },
  restActions: {
    flex: 1,
    gap: Spacing.two,
  },
  addRestButton: {
    alignItems: 'center',
    backgroundColor: DesignColors.surfaceContainerHigh,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    justifyContent: 'center',
    minHeight: TouchTarget.min,
  },
  addRestText: {
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
    lineHeight: 20,
    textTransform: 'uppercase',
  },
  skipRestButton: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderColor: SemanticColors.action,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: TouchTarget.min,
  },
  skipRestText: {
    color: SemanticColors.actionSoft,
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
    lineHeight: 20,
    textTransform: 'uppercase',
  },
  lockedCard: {
    alignItems: 'center',
    backgroundColor: DesignColors.surfaceContainerLow,
    borderColor: SemanticColors.border,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 88,
    opacity: 0.72,
    padding: Spacing.three,
  },
  lockedTitle: {
    ...TypeScale.headlineSm,
    color: SemanticColors.textMuted,
  },
  lockedMeta: {
    color: SemanticColors.textMuted,
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
    lineHeight: 16,
  },
  bottomActions: {
    flexDirection: 'row',
    gap: Spacing.two,
    paddingBottom: Spacing.two,
  },
  nextButton: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderColor: SemanticColors.action,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    flex: 0.92,
    flexDirection: 'row',
    gap: Spacing.two,
    justifyContent: 'center',
    minHeight: 64,
    paddingHorizontal: Spacing.two,
  },
  nextButtonText: {
    color: SemanticColors.actionSoft,
    fontFamily: Fonts.bodyBold,
    fontSize: 13,
    lineHeight: 16,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  finishButton: {
    alignItems: 'center',
    backgroundColor: SemanticColors.action,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    flex: 1.42,
    flexDirection: 'row',
    gap: Spacing.two,
    justifyContent: 'center',
    minHeight: 64,
    paddingHorizontal: Spacing.two,
  },
  finishButtonPressed: {
    backgroundColor: DesignColors.inversePrimary,
    transform: [{ scale: 0.99 }],
  },
  finishButtonText: {
    ...Typography.lg,
    color: DesignColors.onPrimaryContainer,
    fontFamily: Fonts.bodyBold,
    lineHeight: 24,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  pressed: {
    opacity: 0.72,
    transform: [{ scale: 0.99 }],
  },
});

import { useReducer } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { AppIcon } from '@/components/ui/app-icon';
import {
  createWorkoutSessionState,
  getActiveSet,
  isExerciseComplete,
  workoutSessionReducer,
} from '@/components/workouts/session-state';
import { Fonts, MaxContentWidth, Palette, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type MockWorkout = (typeof import('@/constants/mock-data').MOCK_WORKOUTS)[number];

type WorkoutSessionScreenProps = {
  onFinishWorkout: () => void;
  onReturnToWorkouts: () => void;
  workout?: MockWorkout;
};

export function WorkoutSessionScreen({
  onFinishWorkout,
  onReturnToWorkouts,
  workout,
}: WorkoutSessionScreenProps) {
  const theme = useTheme();
  const [session, dispatch] = useReducer(
    workoutSessionReducer,
    workout?.exercises ?? [],
    createWorkoutSessionState,
  );

  if (!workout) {
    return (
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.missingContent}
        style={{ backgroundColor: theme.background }}>
        <ThemedText selectable style={styles.title}>Workout not found</ThemedText>
        <ThemedText selectable style={styles.missingDescription} themeColor="textSecondary">
          This workout session is no longer available.
        </ThemedText>
        <Pressable
          accessibilityRole="button"
          onPress={onReturnToWorkouts}
          style={({ pressed }) => [
            styles.primaryButton,
            { backgroundColor: theme.primary },
            pressed && styles.pressed,
          ]}>
          <ThemedText style={styles.primaryButtonText}>Back to Workouts</ThemedText>
        </Pressable>
      </ScrollView>
    );
  }

  const exercise = session.exercises[session.currentExerciseIndex];
  const activeSet = getActiveSet(exercise);
  const exerciseComplete = isExerciseComplete(exercise);
  const isLastExercise = session.currentExerciseIndex === session.exercises.length - 1;
  const primaryLabel = exerciseComplete
    ? isLastExercise
      ? 'All Sets Complete'
      : 'Next Exercise'
    : 'Finish Set';

  const handlePrimaryPress = () => {
    dispatch({ type: exerciseComplete ? 'next-exercise' : 'finish-set' });
  };

  return (
    <ScrollView
      automaticallyAdjustKeyboardInsets
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      style={{ backgroundColor: theme.background }}>
      <View style={styles.content}>
        <View style={styles.exerciseHeader}>
          <View style={styles.exerciseCopy}>
            <ThemedText style={styles.title}>{exercise.name}</ThemedText>
            <ThemedText style={styles.exerciseProgress} themeColor="textSecondary">
              Exercise {session.currentExerciseIndex + 1} of {session.exercises.length}
            </ThemedText>
          </View>
          <Pressable
            accessibilityLabel="More exercise options are not available yet"
            accessibilityRole="button"
            accessibilityState={{ disabled: true }}
            disabled
            style={[styles.moreButton, { backgroundColor: theme.border }]}>
            <AppIcon color={theme.textSecondary} name="more" size={18} />
          </Pressable>
        </View>

        <View style={[styles.tip, { backgroundColor: Palette.tertiary[100] }]}>
          <AppIcon color={Palette.tertiary[700]} name="intensity" size={17} />
          <ThemedText selectable style={styles.tipText}>{exercise.tip}</ThemedText>
        </View>

        <View style={[styles.setCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
          <View style={styles.tableHeader}>
            <ThemedText style={[styles.columnLabel, styles.setColumn]} themeColor="textSecondary">Set</ThemedText>
            <ThemedText style={styles.columnLabel} themeColor="textSecondary">Lbs</ThemedText>
            <ThemedText style={styles.columnLabel} themeColor="textSecondary">Reps</ThemedText>
            <View style={styles.statusColumn}>
              <AppIcon color={theme.textSecondary} name="check" size={12} />
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.setList}>
            {exercise.sets.map((set) => {
              const isActive = set.id === activeSet?.id;

              return (
                <View
                  key={set.id}
                  style={[
                    styles.setRow,
                    isActive && styles.activeSetRow,
                    isActive && { borderColor: theme.primary },
                  ]}>
                  <ThemedText
                    style={[styles.setNumber, styles.setColumn, isActive && { color: theme.primary }]}
                    themeColor={set.completed ? 'textSecondary' : 'text'}>
                    {set.number}
                  </ThemedText>

                  <SetValue
                    active={isActive}
                    accessibilityLabel={`Weight for set ${set.number}`}
                    onChangeText={(value) =>
                      dispatch({
                        type: 'update-set',
                        field: 'weight',
                        setId: set.id,
                        value: value.replace(/[^0-9.]/g, ''),
                      })
                    }
                    value={set.weight}
                  />
                  <SetValue
                    active={isActive}
                    accessibilityLabel={`Repetitions for set ${set.number}`}
                    integer
                    onChangeText={(value) =>
                      dispatch({
                        type: 'update-set',
                        field: 'reps',
                        setId: set.id,
                        value: value.replace(/\D/g, ''),
                      })
                    }
                    value={set.reps}
                  />

                  <View
                    accessibilityLabel={set.completed ? `Set ${set.number} completed` : `Set ${set.number} incomplete`}
                    style={[
                      styles.status,
                      {
                        backgroundColor: set.completed ? Palette.primary[100] : theme.background,
                        borderColor: isActive ? theme.primary : theme.border,
                      },
                    ]}>
                    {set.completed ? (
                      <AppIcon color={Palette.primary[600]} name="check" size={13} />
                    ) : null}
                  </View>
                </View>
              );
            })}
          </View>

          <Pressable
            accessibilityLabel={`Add a set to ${exercise.name}`}
            accessibilityRole="button"
            onPress={() => dispatch({ type: 'add-set' })}
            style={({ pressed }) => [
              styles.addSetButton,
              { backgroundColor: theme.background },
              pressed && styles.pressed,
            ]}>
            <AppIcon color={theme.textSecondary} name="add" size={13} />
            <ThemedText style={styles.addSetText} themeColor="textSecondary">Add Set</ThemedText>
          </Pressable>
        </View>

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: exerciseComplete && isLastExercise }}
            disabled={exerciseComplete && isLastExercise}
            onPress={handlePrimaryPress}
            style={({ pressed }) => [
              styles.primaryButton,
              { backgroundColor: theme.primary },
              exerciseComplete && isLastExercise && styles.disabled,
              pressed && styles.pressed,
            ]}>
            <AppIcon color={theme.onPrimary} name="complete" size={15} />
            <ThemedText style={[styles.primaryButtonText, { color: theme.onPrimary }]}>
              {primaryLabel}
            </ThemedText>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={onFinishWorkout}
            style={({ pressed }) => [
              styles.finishWorkoutButton,
              { borderColor: theme.textSecondary },
              pressed && styles.pressed,
            ]}>
            <AppIcon color={theme.text} name="complete" size={14} />
            <ThemedText style={styles.finishWorkoutText}>Finish Workout</ThemedText>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

type SetValueProps = {
  accessibilityLabel: string;
  active: boolean;
  integer?: boolean;
  onChangeText: (value: string) => void;
  value: string;
};

function SetValue({ accessibilityLabel, active, integer, onChangeText, value }: SetValueProps) {
  const theme = useTheme();

  if (!active) {
    return (
      <ThemedText selectable style={styles.setValue} themeColor="textSecondary">
        {value}
      </ThemedText>
    );
  }

  return (
    <TextInput
      accessibilityLabel={accessibilityLabel}
      keyboardType={integer ? 'number-pad' : 'decimal-pad'}
      maxLength={6}
      onChangeText={onChangeText}
      selectTextOnFocus
      style={[
        styles.input,
        {
          backgroundColor: theme.backgroundElement,
          borderColor: theme.border,
          color: theme.text,
        },
      ]}
      value={value}
    />
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    alignItems: 'center',
    flexGrow: 1,
    padding: Spacing.three,
    paddingBottom: Spacing.five,
  },
  content: {
    flex: 1,
    gap: Spacing.three,
    maxWidth: MaxContentWidth,
    width: '100%',
  },
  exerciseHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.three,
  },
  exerciseCopy: {
    flex: 1,
  },
  title: {
    ...Typography['2xl'],
    fontFamily: Fonts.heading,
  },
  exerciseProgress: {
    ...Typography.xs,
    fontFamily: Fonts.body,
  },
  moreButton: {
    alignItems: 'center',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    opacity: 0.62,
    width: 40,
  },
  tip: {
    alignItems: 'center',
    borderCurve: 'continuous',
    borderLeftColor: Palette.tertiary[500],
    borderLeftWidth: 4,
    borderRadius: 8,
    flexDirection: 'row',
    gap: Spacing.three,
    minHeight: 72,
    padding: Spacing.three,
  },
  tipText: {
    ...Typography.sm,
    color: Palette.tertiary[950],
    flex: 1,
    fontFamily: Fonts.bodyMedium,
  },
  setCard: {
    borderCurve: 'continuous',
    borderRadius: 12,
    borderWidth: 1,
    gap: Spacing.three,
    padding: Spacing.three,
  },
  tableHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.two,
  },
  columnLabel: {
    ...Typography.xs,
    flex: 1,
    fontFamily: Fonts.bodySemiBold,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  setColumn: {
    flex: 0,
    textAlign: 'center',
    width: 42,
  },
  statusColumn: {
    alignItems: 'center',
    width: 36,
  },
  divider: {
    height: 1,
  },
  setList: {
    gap: Spacing.two,
  },
  setRow: {
    alignItems: 'center',
    borderCurve: 'continuous',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    flexDirection: 'row',
    gap: Spacing.two,
    minHeight: 54,
    padding: Spacing.two,
  },
  activeSetRow: {
    borderWidth: 1.5,
  },
  setNumber: {
    ...Typography.sm,
    fontFamily: Fonts.bodyMedium,
  },
  setValue: {
    ...Typography.sm,
    flex: 1,
    fontFamily: Fonts.bodyMedium,
    fontVariant: ['tabular-nums'],
    textAlign: 'center',
  },
  input: {
    ...Typography.base,
    borderCurve: 'continuous',
    borderRadius: 7,
    borderWidth: 1,
    flex: 1,
    fontFamily: Fonts.bodyBold,
    fontVariant: ['tabular-nums'],
    minHeight: 40,
    minWidth: 56,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    textAlign: 'center',
  },
  status: {
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  addSetButton: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 18,
    flexDirection: 'row',
    gap: Spacing.one,
    minHeight: 36,
    paddingHorizontal: Spacing.three,
  },
  addSetText: {
    ...Typography.xs,
    fontFamily: Fonts.bodyMedium,
  },
  actions: {
    gap: Spacing.three,
    marginTop: 'auto',
    paddingTop: Spacing.six,
  },
  primaryButton: {
    alignItems: 'center',
    borderCurve: 'continuous',
    borderRadius: 9,
    flexDirection: 'row',
    gap: Spacing.two,
    justifyContent: 'center',
    minHeight: 54,
    paddingHorizontal: Spacing.three,
  },
  primaryButtonText: {
    ...Typography.sm,
    color: Palette.white,
    fontFamily: Fonts.bodyBold,
    textTransform: 'uppercase',
  },
  finishWorkoutButton: {
    alignItems: 'center',
    borderCurve: 'continuous',
    borderRadius: 9,
    borderWidth: 1,
    flexDirection: 'row',
    gap: Spacing.two,
    justifyContent: 'center',
    minHeight: 50,
    paddingHorizontal: Spacing.three,
  },
  finishWorkoutText: {
    ...Typography.sm,
    fontFamily: Fonts.bodyBold,
    textTransform: 'uppercase',
  },
  disabled: {
    opacity: 0.48,
  },
  pressed: {
    opacity: 0.76,
    transform: [{ scale: 0.99 }],
  },
  missingContent: {
    alignItems: 'center',
    flexGrow: 1,
    gap: Spacing.three,
    justifyContent: 'center',
    padding: Spacing.four,
  },
  missingDescription: {
    ...Typography.sm,
    fontFamily: Fonts.body,
    textAlign: 'center',
  },
});

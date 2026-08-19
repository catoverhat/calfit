import { styles } from './active-workout-session-screen.styles';
import { router, type Href } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import { SemanticColors } from '@/theme/tokens';
import { LockedExerciseCard } from './components/locked-exercise-card';
import { SessionActions } from './components/session-actions';
import { SessionOverview } from './components/session-overview';
import { SessionRestCard } from './components/session-rest-card';
import { SessionSetEditor } from './components/session-set-editor';
import type { WorkoutSessionViewModel } from './workout-session.viewmodel';

export type ActiveWorkoutSessionWorkout = WorkoutSessionViewModel;

type ActiveWorkoutSessionScreenProps = {
  workout: ActiveWorkoutSessionWorkout;
};

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
        <SessionOverview title={sessionTitle} />

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

          <SessionSetEditor
            completedSets={completedSets}
            currentReps={currentReps}
            currentSetDone={currentSetDone}
            currentWeight={currentWeight}
            onCurrentRepsChange={setCurrentReps}
            onCurrentSetDoneChange={setCurrentSetDone}
            onCurrentWeightChange={setCurrentWeight}
            onToggleCompletedSet={toggleCompletedSet}
          />
          <SessionRestCard />
        </View>
        <LockedExerciseCard meta={lockedMeta} name={lockedExerciseName} />
        <SessionActions onFinish={finishWorkout} />
      </View>
    </ScrollView>
  );
}

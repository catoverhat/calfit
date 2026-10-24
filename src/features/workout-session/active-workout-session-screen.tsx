import { useAppTheme } from '@/theme/app-theme-provider';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Linking, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useState } from 'react';

import { AppIcon } from '@/components/ui/app-icon';
import { completeWorkoutSession, initializeLocalDatabase } from '@/db';

import { SessionActions } from './components/session-actions';
import { SessionOverview } from './components/session-overview';
import { SessionRestCard } from './components/session-rest-card';
import { SessionSetEditor } from './components/session-set-editor';
import { useStyles } from './active-workout-session-screen.styles';
import { useActiveWorkout } from './use-active-workout';
import type { WorkoutSessionViewModel } from './workout-session.viewmodel';

export function ActiveWorkoutSessionScreen({ workout }: { workout: WorkoutSessionViewModel }) {
  const styles = useStyles();
  const { SemanticColors } = useAppTheme();
  const active = useActiveWorkout(workout);
  const [finishError, setFinishError] = useState<string | null>(null);
  const [isFinishing, setIsFinishing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const hasSaveErrors = Object.keys(active.saveErrors).length > 0;
  const totalSets = workout.exercises.reduce((sum, exercise) => sum + exercise.sets.length, 0);
  const completedSets = workout.exercises.reduce(
    (sum, exercise) =>
      sum + exercise.sets.filter((set) => active.sets[set.id].completed).length,
    0,
  );

  const finishWorkout = async () => {
    if (isFinishing) return;
    setShowConfirmation(false);
    setFinishError(null);
    setIsFinishing(true);
    const saved = await active.flush();
    if (!saved) {
      setFinishError('Resolve the set errors before finishing this workout.');
      setIsFinishing(false);
      return;
    }
    try {
      const db = await initializeLocalDatabase();
      await completeWorkoutSession(db, workout.id);
      router.replace({ pathname: '/progress/summary', params: { sessionId: workout.id } });
    } catch (error) {
      setFinishError(error instanceof Error ? error.message : 'Workout could not be completed.');
      setIsFinishing(false);
    }
  };

  const requestFinish = () => {
    if (active.incompleteCount > 0) setShowConfirmation(true);
    else void finishWorkout();
  };

  return (
    <>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} style={styles.screen}>
        <View style={styles.content}>
          <SessionOverview
            completedSets={completedSets}
            elapsed={formatElapsed(active.elapsedSeconds)}
            isSaving={active.isSaving}
            title={workout.title}
            totalSets={totalSets}
          />

          {workout.exercises.map((exercise) => {
            const expanded = active.expandedExerciseId === exercise.id;
            const completed = exercise.sets.filter((set) => active.sets[set.id].completed).length;
            return (
              <View key={exercise.id} style={styles.exerciseCard}>
                <View style={styles.exerciseHeader}>
                  <Pressable accessibilityLabel={`${expanded ? 'Collapse' : 'Expand'} ${exercise.name}`} accessibilityRole="button" accessibilityState={{ expanded }} onPress={() => active.setExpandedExerciseId(expanded ? '' : exercise.id)} style={styles.exerciseTitleBlock}>
                    <View style={styles.exerciseTitleLine}>
                      <Text style={styles.exerciseTitle}>{exercise.name}</Text>
                      <AppIcon color={SemanticColors.textMuted} name={expanded ? 'chevronUp' : 'chevronDown'} size={18} />
                    </View>
                    <Text style={styles.exerciseMeta}>{completed} of {exercise.sets.length} sets complete</Text>
                  </Pressable>
                  <Pressable accessibilityLabel={`${exercise.name} information`} accessibilityRole="button" accessibilityState={{ expanded: active.infoExerciseId === exercise.id }} onPress={() => active.toggleInfo(exercise.id)} style={({ pressed }) => [styles.infoButton, pressed && styles.pressed]}>
                    <AppIcon color={SemanticColors.textPrimary} name="info" size={18} />
                  </Pressable>
                </View>

                {active.infoExerciseId === exercise.id ? <ExerciseDetails exercise={exercise} /> : null}
                {expanded ? (
                  <>
                    <SessionSetEditor exercise={exercise} onBlurField={active.blurField} onToggleSet={(id) => void active.toggleSet(id)} onUpdateField={active.updateField} saveErrors={active.saveErrors} sets={active.sets} units={workout} />
                    {active.restSeconds > 0 ? <SessionRestCard onAdd={active.addRest} onSkip={active.skipRest} seconds={active.restSeconds} /> : null}
                  </>
                ) : null}
              </View>
            );
          })}

          {finishError ? <Text selectable style={styles.finishError}>{finishError}</Text> : null}
          {hasSaveErrors ? <Text style={styles.finishError}>One or more sets need attention.</Text> : null}
          <SessionActions busy={isFinishing} disabled={isFinishing || active.isSaving || hasSaveErrors} onFinish={requestFinish} />
        </View>
      </ScrollView>

      <Modal animationType="fade" onRequestClose={() => setShowConfirmation(false)} transparent visible={showConfirmation}>
        <View style={styles.modalBackdrop}>
          <View accessibilityViewIsModal style={styles.confirmationCard}>
            <Text style={styles.confirmationTitle}>Finish with incomplete sets?</Text>
            <Text style={styles.confirmationBody}>{active.incompleteCount} {active.incompleteCount === 1 ? 'set is' : 'sets are'} still incomplete. Saved values will remain in workout history.</Text>
            <View style={styles.confirmationActions}>
              <Pressable accessibilityRole="button" onPress={() => setShowConfirmation(false)} style={({ pressed }) => [styles.confirmationCancel, pressed && styles.pressed]}>
                <Text style={styles.confirmationCancelText}>Keep Training</Text>
              </Pressable>
              <Pressable accessibilityRole="button" onPress={() => void finishWorkout()} style={({ pressed }) => [styles.confirmationFinish, pressed && styles.finishButtonPressed]}>
                <Text style={styles.confirmationFinishText}>Finish Anyway</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

function ExerciseDetails({ exercise }: { exercise: WorkoutSessionViewModel['exercises'][number] }) {
  const styles = useStyles();
  const { SemanticColors } = useAppTheme();
  const safeVideoUrl = exercise.videoUrl && /^https?:\/\//i.test(exercise.videoUrl) ? exercise.videoUrl : null;
  return (
    <View style={styles.exerciseDetails}>
      {exercise.imageUrl ? <Image accessibilityLabel={`${exercise.name} reference`} contentFit="cover" source={exercise.imageUrl} style={styles.exerciseDetailImage} /> : null}
      <Text style={styles.exerciseDetailText}>{exercise.description ?? 'No exercise notes have been saved yet.'}</Text>
      {safeVideoUrl ? (
        <Pressable accessibilityLabel={`Open ${exercise.name} video`} accessibilityRole="link" onPress={() => void Linking.openURL(safeVideoUrl)} style={({ pressed }) => [styles.videoLink, pressed && styles.pressed]}>
          <AppIcon color={SemanticColors.actionSoft} name="open" size={15} />
          <Text style={styles.videoLinkText}>Open exercise video</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function formatElapsed(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const remainder = (seconds % 60).toString().padStart(2, '0');
  return hours > 0 ? `${hours}:${minutes}:${remainder}` : `${minutes}:${remainder}`;
}

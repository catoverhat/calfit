import { useAppTheme } from "@/theme/app-theme-provider";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import {
  Linking,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppIcon } from "@/components/ui/app-icon";
import {
  addWorkoutSet,
  completeWorkoutSession,
  discardWorkoutSession,
  initializeLocalDatabase,
  removeWorkoutSet,
  type LocalDatabase,
} from "@/db";

import { useStyles } from "./active-workout-session-screen.styles";
import { SessionActions } from "./components/session-actions";
import { SessionOverview } from "./components/session-overview";
import { SessionRestCard } from "./components/session-rest-card";
import { SessionSetEditor } from "./components/session-set-editor";
import { useActiveWorkout } from "./use-active-workout";
import { useWorkoutForeground } from "./use-workout-foreground";
import { useWorkoutScreenAwake } from "./use-workout-screen-awake";
import { useWorkoutPreferences } from "./workout-preferences";
import type { WorkoutSessionViewModel } from "./workout-session.viewmodel";

export function ActiveWorkoutSessionScreen({
  onReload,
  workout,
}: {
  onReload: () => void;
  workout: WorkoutSessionViewModel;
}) {
  const styles = useStyles();
  const { SemanticColors } = useAppTheme();
  const isForeground = useWorkoutForeground();
  const { keepScreenAwake } = useWorkoutPreferences();
  const active = useActiveWorkout(workout, isForeground);
  useWorkoutScreenAwake(isForeground && keepScreenAwake);
  const [finishError, setFinishError] = useState<string | null>(null);
  const [isFinishing, setIsFinishing] = useState(false);
  const [isEditingSets, setIsEditingSets] = useState(false);
  const [confirmation, setConfirmation] = useState<
    "discard" | "finish" | null
  >(null);
  const hasSaveErrors = Object.keys(active.saveErrors).length > 0;
  const totalSets = workout.exercises.reduce(
    (sum, exercise) => sum + exercise.sets.length,
    0,
  );
  const completedSets = workout.exercises.reduce(
    (sum, exercise) =>
      sum + exercise.sets.filter((set) => active.sets[set.id].completed).length,
    0,
  );

  const finishWorkout = async () => {
    if (isFinishing) return;
    setConfirmation(null);
    setFinishError(null);
    setIsFinishing(true);
    const saved = await active.flush();
    if (!saved) {
      setFinishError("Resolve the set errors before finishing this workout.");
      setIsFinishing(false);
      return;
    }
    try {
      const db = await initializeLocalDatabase();
      await completeWorkoutSession(db, workout.id);
      router.replace({
        pathname: "/progress/summary",
        params: { sessionId: workout.id },
      });
    } catch (error) {
      setFinishError(
        error instanceof Error
          ? error.message
          : "Workout could not be completed.",
      );
      setIsFinishing(false);
    }
  };

  const requestFinish = () => {
    if (active.incompleteCount > 0) setConfirmation("finish");
    else void finishWorkout();
  };

  const discardWorkout = async () => {
    if (isFinishing) return;
    setConfirmation(null);
    setFinishError(null);
    setIsFinishing(true);
    try {
      const db = await initializeLocalDatabase();
      await discardWorkoutSession(db, workout.id);
      router.replace("/(tabs)");
    } catch (error) {
      setFinishError(
        error instanceof Error ? error.message : "Workout could not be discarded.",
      );
      setIsFinishing(false);
    }
  };

  /** Saves typed values first so the reload after a structure change cannot overwrite them. */
  const changeSets = async (change: (db: LocalDatabase) => Promise<void>) => {
    if (isEditingSets) return;
    setFinishError(null);
    setIsEditingSets(true);
    try {
      if (!(await active.flush())) {
        setFinishError("Resolve the set errors before changing sets.");
        return;
      }
      await change(await initializeLocalDatabase());
      onReload();
    } catch (error) {
      setFinishError(
        error instanceof Error ? error.message : "Sets could not be changed.",
      );
    } finally {
      setIsEditingSets(false);
    }
  };

  return (
    <>
      <ScrollView
        automaticallyAdjustKeyboardInsets
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={styles.screen}
      >
        <View style={styles.content}>
          <SessionOverview
            completedSets={completedSets}
            elapsed={formatElapsed(active.elapsedSeconds)}
            hasSaveErrors={hasSaveErrors}
            isSaving={active.isSaving}
            title={workout.title}
            totalSets={totalSets}
          />

          <View style={styles.exerciseSectionHeading}>
            <Text accessibilityRole="header" style={styles.sectionTitle}>
              Your exercises
            </Text>
            <Text style={styles.sectionCount}>
              {workout.exercises.length} total
            </Text>
          </View>

          {workout.exercises.map((exercise, index) => {
            const expanded = active.expandedExerciseId === exercise.id;
            const completed = exercise.sets.filter(
              (set) => active.sets[set.id].completed,
            ).length;
            const allComplete =
              exercise.sets.length > 0 && completed === exercise.sets.length;
            return (
              <View
                key={exercise.id}
                style={[
                  styles.exerciseCard,
                  expanded && styles.exerciseCardActive,
                  allComplete && styles.exerciseCardComplete,
                ]}
              >
                <View style={styles.exerciseHeader}>
                  <Pressable
                    accessibilityLabel={`${expanded ? "Collapse" : "Expand"} ${exercise.name}. ${completed} of ${exercise.sets.length} sets logged.`}
                    accessibilityRole="button"
                    accessibilityState={{ expanded }}
                    onPress={() =>
                      active.setExpandedExerciseId(expanded ? "" : exercise.id)
                    }
                    style={({ pressed }) => [
                      styles.exerciseTitleBlock,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.exerciseEyebrow,
                        allComplete && styles.successText,
                      ]}
                    >
                      {allComplete
                        ? "Completed"
                        : `Exercise ${String(index + 1).padStart(2, "0")}`}
                    </Text>
                    <View style={styles.exerciseTitleLine}>
                      <Text style={styles.exerciseTitle}>{exercise.name}</Text>
                      <AppIcon
                        color={SemanticColors.textMuted}
                        name={expanded ? "chevronUp" : "chevronDown"}
                        size={18}
                      />
                    </View>
                    <Text style={styles.exerciseMeta}>
                      {completed} of {exercise.sets.length} sets logged
                    </Text>
                  </Pressable>
                  <Pressable
                    accessibilityLabel={`${exercise.name} information`}
                    accessibilityRole="button"
                    accessibilityState={{
                      expanded: active.infoExerciseId === exercise.id,
                    }}
                    onPress={() => active.toggleInfo(exercise.id)}
                    style={({ pressed }) => [
                      styles.infoButton,
                      pressed && styles.pressed,
                    ]}
                  >
                    <AppIcon
                      color={SemanticColors.textPrimary}
                      name="info"
                      size={18}
                    />
                  </Pressable>
                </View>

                {active.infoExerciseId === exercise.id ? (
                  <ExerciseDetails exercise={exercise} />
                ) : null}
                {expanded ? (
                  <SessionSetEditor
                    busy={isEditingSets || isFinishing}
                    exercise={exercise}
                    onAddSet={() =>
                      void changeSets((db) => addWorkoutSet(db, exercise.id))
                    }
                    onBlurField={active.blurField}
                    onRemoveSet={(id) =>
                      void changeSets((db) => removeWorkoutSet(db, id))
                    }
                    onToggleSet={(id) => void active.toggleSet(id)}
                    onUpdateField={active.updateField}
                    saveErrors={active.saveErrors}
                    sets={active.sets}
                    units={workout}
                  />
                ) : null}
              </View>
            );
          })}

          {finishError ? (
            <Text
              accessibilityRole="alert"
              selectable
              style={styles.finishError}
            >
              {finishError}
            </Text>
          ) : null}
          {hasSaveErrors ? (
            <Text accessibilityRole="alert" style={styles.finishError}>
              Check the highlighted set values before finishing.
            </Text>
          ) : null}
          <SessionActions
            busy={isFinishing}
            disabled={
              isFinishing || isEditingSets || active.isSaving || hasSaveErrors
            }
            onDiscard={() => setConfirmation("discard")}
            onFinish={requestFinish}
          />
        </View>
      </ScrollView>

      {active.restSeconds > 0 ? (
        <SafeAreaView edges={["bottom"]} style={styles.restDock}>
          <View style={styles.restDockContent}>
            <SessionRestCard
              durationSeconds={active.restDurationSeconds}
              onAdd={active.addRest}
              onSkip={active.skipRest}
              onSubtract={active.subtractRest}
              seconds={active.restSeconds}
            />
          </View>
        </SafeAreaView>
      ) : null}

      <Modal
        animationType="fade"
        onRequestClose={() => setConfirmation(null)}
        transparent
        visible={confirmation !== null}
      >
        <View style={styles.modalBackdrop}>
          <View accessibilityViewIsModal style={styles.confirmationCard}>
            <Text accessibilityRole="header" style={styles.confirmationTitle}>
              {confirmation === "discard"
                ? "Discard this workout?"
                : "Finish with incomplete sets?"}
            </Text>
            <Text style={styles.confirmationBody}>
              {confirmation === "discard"
                ? `${completedSets} logged ${completedSets === 1 ? "set" : "sets"} and this session will be deleted. Your workout plan is kept.`
                : `${active.incompleteCount} ${active.incompleteCount === 1 ? "set is" : "sets are"} still incomplete. Saved values will remain in workout history.`}
            </Text>
            <View style={styles.confirmationActions}>
              <Pressable
                accessibilityRole="button"
                onPress={() => setConfirmation(null)}
                style={({ pressed }) => [
                  styles.confirmationCancel,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.confirmationCancelText}>Keep training</Text>
              </Pressable>
              {confirmation === "discard" ? (
                <Pressable
                  accessibilityRole="button"
                  onPress={() => void discardWorkout()}
                  style={({ pressed }) => [
                    styles.confirmationDanger,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.confirmationDangerText}>
                    Discard workout
                  </Text>
                </Pressable>
              ) : (
                <Pressable
                  accessibilityRole="button"
                  onPress={() => void finishWorkout()}
                  style={({ pressed }) => [
                    styles.confirmationFinish,
                    pressed && styles.finishButtonPressed,
                  ]}
                >
                  <Text style={styles.confirmationFinishText}>
                    Finish anyway
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

function ExerciseDetails({
  exercise,
}: {
  exercise: WorkoutSessionViewModel["exercises"][number];
}) {
  const styles = useStyles();
  const { SemanticColors } = useAppTheme();
  const safeVideoUrl =
    exercise.videoUrl && /^https?:\/\//i.test(exercise.videoUrl)
      ? exercise.videoUrl
      : null;
  return (
    <View style={styles.exerciseDetails}>
      {exercise.imageUrl ? (
        <Image
          accessibilityLabel={`${exercise.name} reference`}
          contentFit="cover"
          source={exercise.imageUrl}
          style={styles.exerciseDetailImage}
        />
      ) : null}
      <Text style={styles.exerciseDetailText}>
        {exercise.description ?? "No exercise notes have been saved yet."}
      </Text>
      {safeVideoUrl ? (
        <Pressable
          accessibilityLabel={`Open ${exercise.name} video`}
          accessibilityRole="link"
          onPress={() => void Linking.openURL(safeVideoUrl)}
          style={({ pressed }) => [styles.videoLink, pressed && styles.pressed]}
        >
          <AppIcon color={SemanticColors.actionSoft} name="open" size={15} />
          <Text style={styles.videoLinkText}>Open exercise video</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function formatElapsed(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const remainder = (seconds % 60).toString().padStart(2, "0");
  return hours > 0
    ? `${hours}:${minutes}:${remainder}`
    : `${minutes}:${remainder}`;
}

import { Link, type Href } from "expo-router";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";

import { AppIcon } from "@/components/ui/app-icon";
import { ThemedText } from "@/components/ui/themed-text";
import { useAppTheme } from "@/theme/app-theme-provider";

import { RoutineDetailExercise } from "./components/routine-detail-exercise";
import { useStyles } from "./routine-detail-screen.styles";
import { getRoutineTotals } from "./routine.viewmodel";
import { useRoutineDetail } from "./use-routine-detail";

export function RoutineDetailScreen({ routineId }: { routineId?: string }) {
  const styles = useStyles();
  const { DesignColors, SemanticColors } = useAppTheme();
  const {
    activeSessionId,
    error,
    isLoading,
    isStarting,
    reload,
    routine,
    startWorkout,
    units,
  } = useRoutineDetail(routineId);

  if (isLoading || !routine) {
    return (
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.stateContent}
        style={styles.screen}
      >
        {isLoading ? (
          <ActivityIndicator color={SemanticColors.action} size="large" />
        ) : (
          <View style={styles.stateIcon}>
            <AppIcon color={SemanticColors.danger} name="warning" size={24} />
          </View>
        )}
        <ThemedText accessibilityRole="header" style={styles.stateTitle}>
          {isLoading
            ? "Loading workout..."
            : error
              ? "Workout unavailable"
              : "Workout not found"}
        </ThemedText>
        {!isLoading ? (
          <>
            <ThemedText style={styles.stateText}>
              {error ??
                "This workout no longer exists. Choose another from your library."}
            </ThemedText>
            {error ? (
              <Pressable
                accessibilityRole="button"
                onPress={reload}
                style={({ pressed }) => [
                  styles.secondaryButton,
                  pressed && styles.pressed,
                ]}
              >
                <ThemedText style={styles.secondaryButtonText}>
                  Try again
                </ThemedText>
              </Pressable>
            ) : null}
            <Link href={"/workouts" as Href} asChild>
              <Pressable accessibilityRole="button">
                {({ pressed }) => (
                  <View
                    style={[styles.primaryButton, pressed && styles.pressed]}
                  >
                    <ThemedText style={styles.primaryButtonText}>
                      Back to workouts
                    </ThemedText>
                  </View>
                )}
              </Pressable>
            </Link>
          </>
        ) : null}
      </ScrollView>
    );
  }

  const totals = getRoutineTotals(routine);
  const cannotStart =
    !activeSessionId && (!routine.active || totals.exerciseCount === 0);
  const startDisabled = isStarting || cannotStart;
  const editHref = {
    pathname: "/workouts/[id]/edit",
    params: { id: routine.routine_id },
  } as unknown as Href;

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      style={styles.screen}
    >
      <View style={styles.content}>
        <View style={styles.summary}>
          <View style={styles.titleRow}>
            <View style={styles.titleCopy}>
              <ThemedText style={styles.eyebrow}>Workout overview</ThemedText>
              <ThemedText accessibilityRole="header" style={styles.title}>
                {routine.name}
              </ThemedText>
            </View>
            <Link href={editHref} asChild>
              <Pressable
                accessibilityLabel={`Edit ${routine.name}`}
                accessibilityRole="button"
              >
                {({ pressed }) => (
                  <View style={[styles.iconButton, pressed && styles.pressed]}>
                    <AppIcon
                      color={SemanticColors.actionSoft}
                      name="edit"
                      size={20}
                    />
                  </View>
                )}
              </Pressable>
            </Link>
          </View>
          {routine.description ? (
            <ThemedText style={styles.description}>
              {routine.description}
            </ThemedText>
          ) : null}
          <View style={styles.statsRow}>
            <Stat
              icon="exercises"
              label="Exercises"
              value={String(totals.exerciseCount)}
            />
            <View style={styles.statDivider} />
            <Stat
              icon="sets"
              label="Target sets"
              value={String(totals.setCount)}
            />
          </View>
          {activeSessionId || cannotStart ? (
            <View style={styles.guidance}>
              <AppIcon color={SemanticColors.info} name="info" size={20} />
              <ThemedText style={styles.guidanceText}>
                {activeSessionId
                  ? "You have a workout in progress. Resume it before starting a new session."
                  : !routine.active
                    ? "This workout is inactive. Edit it to turn it on before training."
                    : "Add at least one exercise to start this workout."}
              </ThemedText>
            </View>
          ) : null}
          {error ? (
            <ThemedText
              accessibilityLiveRegion="polite"
              style={styles.inlineError}
            >
              {error}
            </ThemedText>
          ) : null}
          {cannotStart ? (
            <Link href={editHref} asChild>
              <Pressable accessibilityRole="button">
                {({ pressed }) => (
                  <View style={[styles.startButton, pressed && styles.pressed]}>
                    <AppIcon
                      color={DesignColors.onPrimaryContainer}
                      name="edit"
                      size={20}
                    />
                    <ThemedText style={styles.startButtonText}>
                      Edit workout
                    </ThemedText>
                  </View>
                )}
              </Pressable>
            </Link>
          ) : (
            <Pressable
              accessibilityLabel={
                activeSessionId
                  ? "Resume active workout"
                  : `Start ${routine.name}`
              }
              accessibilityRole="button"
              accessibilityState={{ busy: isStarting, disabled: startDisabled }}
              disabled={startDisabled}
              onPress={startWorkout}
              style={({ pressed }) => [
                styles.startButton,
                startDisabled && styles.buttonDisabled,
                pressed && styles.pressed,
              ]}
            >
              {isStarting ? (
                <ActivityIndicator color={DesignColors.onPrimaryContainer} />
              ) : (
                <AppIcon
                  color={DesignColors.onPrimaryContainer}
                  name="play"
                  size={20}
                />
              )}
              <ThemedText style={styles.startButtonText}>
                {isStarting
                  ? "Opening workout..."
                  : activeSessionId
                    ? "Resume active workout"
                    : "Start workout"}
              </ThemedText>
            </Pressable>
          )}
          <Link href={"/plan" as Href} asChild>
            <Pressable
              accessibilityLabel="Open weekly plan to schedule a workout"
              accessibilityRole="button"
            >
              {({ pressed }) => (
                <View style={[styles.planLink, pressed && styles.pressed]}>
                  <AppIcon
                    color={SemanticColors.actionSoft}
                    name="calendar"
                    size={18}
                  />
                  <ThemedText style={styles.secondaryButtonText}>
                    Plan a training day
                  </ThemedText>
                  <AppIcon
                    color={SemanticColors.textMuted}
                    name="chevronRight"
                    size={18}
                  />
                </View>
              )}
            </Pressable>
          </Link>
        </View>
        <View style={styles.exerciseSection}>
          <View style={styles.sectionHeading}>
            <ThemedText accessibilityRole="header" style={styles.sectionTitle}>
              Your session
            </ThemedText>
            <ThemedText style={styles.sectionHint}>
              {totals.exerciseCount
                ? "Follow this order. Tap an exercise to review its targets."
                : "Your exercises will appear here when you add them."}
            </ThemedText>
          </View>
          {routine.exercises.map((item, index) => (
            <RoutineDetailExercise
              index={index}
              item={item}
              key={item.routine_exercise_id}
              units={units}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: "exercises" | "sets";
  label: string;
  value: string;
}) {
  const styles = useStyles();
  const { SemanticColors } = useAppTheme();
  return (
    <View style={styles.stat}>
      <AppIcon color={SemanticColors.textMuted} name={icon} size={20} />
      <View style={styles.statCopy}>
        <ThemedText style={styles.statValue}>{value}</ThemedText>
        <ThemedText style={styles.statLabel}>{label}</ThemedText>
      </View>
    </View>
  );
}

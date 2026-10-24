import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { Header } from "@/components/layout/header";
import { AppIcon } from "@/components/ui/app-icon";
import { DesignColors, SemanticColors } from "@/theme/tokens";
import { styles } from "../today-dashboard-screen.styles";
import type {
  TodayDashboardData,
  TodayDashboardRoutine,
} from "../today-dashboard.viewmodel";

export function TodayHeader({
  avatarUrl,
  name,
  syncLabel,
}: Pick<TodayDashboardData, "avatarUrl" | "name" | "syncLabel">) {
  return (
    <Header avatarUrl={avatarUrl} profileName={name} showAction={false} statusLabel={syncLabel} />
  );
}

export function TodayRoutineCard({
  actionLabel,
  canStart,
  error,
  isLoading,
  isStarting,
  onBrowseWorkouts,
  onOpenPlan,
  onStart,
  routine,
}: {
  actionLabel: string;
  canStart: boolean;
  error: string | null;
  isLoading: boolean;
  isStarting: boolean;
  onBrowseWorkouts: () => void;
  onOpenPlan: () => void;
  onStart: () => void;
  routine: TodayDashboardRoutine | null;
}) {
  const startDisabled = isLoading || isStarting || !canStart || routine?.state === 'completed' || routine?.state === 'unavailable';

  return (
    <View style={styles.workoutCard}>
      {error ? (
        <StatusCard body={error} title="Local database unavailable" />
      ) : routine ? (
        <>
          <View style={styles.schedulePill}>
            <View style={styles.scheduleDot} />
            <Text style={styles.scheduleText}>
              {routine.state === 'completed' ? 'Completed today' : routine.state === 'in_progress' ? 'Workout in progress' : routine.state === 'unavailable' ? 'Workout unavailable' : 'Planned for today'}
            </Text>
          </View>
          <View style={styles.cardTitleRow}>
            <View style={styles.workoutCopy}>
              <Text style={styles.workoutTitle}>{routine.title}</Text>
              <Text style={styles.focusText}>Focus: {routine.focus}</Text>
            </View>
            <View style={styles.heroIconTile}>
              <AppIcon color={SemanticColors.action} name="strength" size={28} />
            </View>
          </View>
          <View style={styles.workoutMeta}>
            <View style={styles.metaItem}>
              <AppIcon color={SemanticColors.action} name="exercises" size={16} />
              <Text style={styles.metaText}>{routine.exercises} Exercises</Text>
            </View>
            <View style={styles.metaItem}>
              <AppIcon color={SemanticColors.action} name="clock" size={16} />
              <Text style={styles.metaText}>{routine.duration}</Text>
            </View>
          </View>
        </>
      ) : (
        <StatusCard
          body={
            isLoading
              ? "Preparing your local plan."
              : canStart
                ? "Your active workout is ready to continue."
                : "No workout is assigned today. Recover or plan one when it fits your week."
          }
          title={isLoading ? "Loading today’s plan" : canStart ? "Workout in progress" : "Planned Rest Day"}
        />
      )}
      {routine || canStart ? <View style={styles.restActions}><Pressable
          accessibilityLabel={isStarting ? "Opening workout" : actionLabel}
          accessibilityRole="button"
          accessibilityState={{ disabled: startDisabled }}
          disabled={startDisabled}
          onPress={onStart}
          style={({ pressed }) => [
            styles.startButton,
            startDisabled && styles.startButtonDisabled,
            pressed && !startDisabled && styles.startButtonPressed,
          ]}
        >
          <AppIcon color={DesignColors.onPrimaryContainer} name="play" size={18} />
          <Text style={styles.startButtonText}>
            {isStarting
              ? "Starting..."
              : isLoading
                ? "Loading..."
                : actionLabel}
          </Text>
        </Pressable>
        {routine ? <Pressable accessibilityLabel="Edit today's plan" accessibilityRole="button" onPress={onOpenPlan} style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
          <Text style={styles.secondaryButtonText}>Edit Today&apos;s Plan</Text>
        </Pressable> : null}
      </View> : !isLoading && !error ? (
        <View style={styles.restActions}>
          <Pressable accessibilityLabel="Plan this week" accessibilityRole="button" onPress={onOpenPlan} style={({ pressed }) => [styles.startButton, pressed && styles.startButtonPressed]}>
            <Text style={styles.startButtonText}>Plan This Week</Text>
          </Pressable>
          <Pressable accessibilityLabel="Browse workouts" accessibilityRole="button" onPress={onBrowseWorkouts} style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
            <Text style={styles.secondaryButtonText}>Browse Workouts</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

export function ProgressSummary({
  progress,
}: {
  progress: TodayDashboardData["progress"];
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeading}>
        <Text style={styles.sectionEyebrow}>Training snapshot</Text>
        <Text style={styles.sectionHint}>Your latest measurements and training streak.</Text>
      </View>
      <View style={styles.progressGrid}>
        <Link href="/progress/measurements" asChild>
          <Pressable accessibilityLabel={`Body weight ${progress.bodyWeight}. ${progress.bodyWeightDelta}. Open measurements.`} accessibilityRole="button" style={styles.progressLink}>
          {({ pressed }) => <View style={[styles.progressCard, pressed && styles.pressed]}>
          <View style={styles.progressCardTop}>
            <View style={styles.progressIconTile}>
              <AppIcon color={SemanticColors.actionSoft} name="body" size={17} />
            </View>
            <Text style={styles.progressLabel}>Body weight</Text>
          </View>
          <Text style={styles.progressValue}>{progress.bodyWeight}</Text>
          <Text style={styles.deltaText}>{progress.bodyWeightDelta}</Text>
          </View>}
          </Pressable>
        </Link>
        <View accessibilityLabel={`Workout streak ${progress.streak}`} style={styles.progressCard}>
          <View style={styles.progressCardTop}>
            <View style={styles.progressIconTile}>
              <AppIcon color={SemanticColors.actionSoft} name="flame" size={17} />
            </View>
            <Text style={styles.progressLabel}>Streak</Text>
          </View>
          <Text style={styles.progressValue}>{progress.streak}</Text>
          <View style={styles.streakTrack}>
            <View
              style={[
                styles.streakFill,
                { width: `${progress.streakProgress * 100}%` },
              ]}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

export function TrainingTip({ tip }: { tip: string }) {
  return (
    <View style={styles.tipCard}>
      <View style={styles.tipIcon}>
        <AppIcon color={SemanticColors.action} name="trophy" size={18} />
      </View>
      <Text style={styles.tipText}>{tip}</Text>
    </View>
  );
}

export function StatusCard({ body, title }: { body: string; title: string }) {
  return (
    <View accessibilityLiveRegion="polite" style={styles.statusCard}>
      <Text style={styles.statusTitle}>{title}</Text>
      <Text selectable style={styles.statusBody}>
        {body}
      </Text>
    </View>
  );
}

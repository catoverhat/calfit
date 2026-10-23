import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";

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
  const initials = name.slice(0, 2).toUpperCase();

  return (
    <>
      <View style={styles.brandBar}>
        <View style={styles.brandLeft}>
          {avatarUrl ? (
            <Image
              accessibilityLabel={`${name}'s profile photo`}
              contentFit="cover"
              source={avatarUrl}
              style={styles.avatar}
            />
          ) : (
            <View
              accessibilityLabel={`${name}'s local profile initials`}
              style={styles.avatarFallback}
            >
              <Text style={styles.avatarInitials}>{initials}</Text>
            </View>
          )}
          <Text style={styles.brandName}>Kinetic Pulse</Text>
        </View>
        <View style={styles.syncPill}>
          <CloudCheckIcon />
          <Text style={styles.syncText}>{syncLabel}</Text>
        </View>
      </View>
    </>
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
            <DumbbellMark />
          </View>
          <View style={styles.workoutMeta}>
            <View style={styles.metaItem}>
              <GridIcon />
              <Text style={styles.metaText}>{routine.exercises} Exercises</Text>
            </View>
            <View style={styles.metaItem}>
              <ClockIcon />
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
          <Text style={styles.playIcon}>{">"}</Text>
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
      <Text style={styles.sectionEyebrow}>Recent Progress</Text>
      <View style={styles.progressGrid}>
        <View style={[styles.progressCard, styles.weightCard]}>
          <Text style={styles.progressLabel}>Body Weight</Text>
          <Text style={styles.progressValue}>{progress.bodyWeight}</Text>
          <Text style={styles.deltaText}>{progress.bodyWeightDelta}</Text>
        </View>
        <View style={styles.progressCard}>
          <Text style={styles.progressLabel}>Streak</Text>
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
        <MedalIcon />
      </View>
      <Text style={styles.tipText}>{tip}</Text>
    </View>
  );
}

export function StatusCard({ body, title }: { body: string; title: string }) {
  return (
    <View style={styles.statusCard}>
      <Text style={styles.statusTitle}>{title}</Text>
      <Text selectable style={styles.statusBody}>
        {body}
      </Text>
    </View>
  );
}

export function CloudCheckIcon() {
  return (
    <View accessibilityElementsHidden style={styles.cloudIcon}>
      <View style={styles.cloudBody} />
      <Text style={styles.cloudCheck}>OK</Text>
    </View>
  );
}

export function DumbbellMark() {
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

export function GridIcon() {
  return (
    <View accessibilityElementsHidden style={styles.gridIcon}>
      <View style={styles.gridLineHorizontal} />
      <View style={styles.gridLineVertical} />
    </View>
  );
}

export function ClockIcon() {
  return (
    <View accessibilityElementsHidden style={styles.clockIcon}>
      <View style={styles.clockHandTall} />
      <View style={styles.clockHandWide} />
    </View>
  );
}

export function MedalIcon() {
  return (
    <Text accessibilityElementsHidden style={styles.medalIcon}>
      O
    </Text>
  );
}

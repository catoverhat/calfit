import { Link } from "expo-router";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { AppIcon, type AppIconName } from "@/components/ui/app-icon";
import { useAppTheme } from "@/theme/app-theme-provider";
import type { TodayDashboardData } from "../today-dashboard.viewmodel";
import { useStyles } from "./today-workout-card.styles";

type TodayWorkoutCardProps = {
  data: TodayDashboardData;
  error: string | null;
  isLoading: boolean;
  isStarting: boolean;
  onBrowseWorkouts: () => void;
  onOpenPlan: () => void;
  onRetry: () => void;
  onStart: () => void;
};

export function TodayWorkoutCard({
  data,
  error,
  isLoading,
  isStarting,
  onBrowseWorkouts,
  onOpenPlan,
  onRetry,
  onStart,
}: TodayWorkoutCardProps) {
  const styles = useStyles();
  const { SemanticColors } = useAppTheme();
  const {
    routine,
    activeSessionId,
    activeWorkoutIsSeparate,
    completedSessionId,
  } = data;
  const isActive = Boolean(activeSessionId);
  const isComplete = !isActive && routine?.state === "completed";
  const isUnavailable = !isActive && routine?.state === "unavailable";
  const visibleRoutine = activeWorkoutIsSeparate ? null : routine;
  const status = isActive
    ? "Workout in progress"
    : isComplete
      ? "Completed today"
      : isUnavailable
        ? "Plan needs an update"
        : routine
          ? "Up next · Today"
          : "Your day, your pace";
  const icon: AppIconName = isComplete
    ? "check"
    : isUnavailable
      ? "warning"
      : isActive
        ? "play"
        : routine
          ? "strength"
          : "sun";
  const title =
    visibleRoutine?.title ??
    (isActive ? "Pick up where you left off" : "Room to move. Or recover.");
  const description = isActive
    ? "Your logged sets are saved. Continue when you’re ready."
    : isComplete
      ? "Workout saved. Take a look at what you accomplished."
      : isUnavailable
        ? "This workout is inactive. Choose another one for today."
        : routine
          ? routine.focus
          : "Nothing is scheduled today. Choose a workout or make space for a rest day.";

  if (isLoading) {
    return (
      <View
        accessibilityLiveRegion="polite"
        accessibilityState={{ busy: true }}
        style={styles.card}
      >
        <View style={styles.statusRow}>
          <ActivityIndicator color={SemanticColors.action} />
          <Text style={styles.statusLabel}>Getting your day ready</Text>
        </View>
        <Text style={styles.title}>Your next workout</Text>
        <Text style={styles.description}>
          Loading your plan and saved activity…
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View accessibilityLiveRegion="polite" style={styles.card}>
        <View style={styles.statusRow}>
          <AppIcon color={SemanticColors.danger} name="warning" size={20} />
          <Text style={styles.statusLabel}>Something went wrong</Text>
        </View>
        <Text style={styles.title}>Couldn’t open your workout</Text>
        <Text selectable style={styles.description}>
          {error}
        </Text>
        <ActionButton icon="sync" label="Try again" onPress={onRetry} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.card,
        isActive && styles.activeCard,
        isComplete && styles.completedCard,
      ]}
    >
      <View style={styles.statusRow}>
        <View style={[styles.statusIcon, isComplete && styles.completedIcon]}>
          <AppIcon
            color={
              isComplete ? SemanticColors.success : SemanticColors.actionSoft
            }
            name={icon}
            size={20}
          />
        </View>
        <Text style={[styles.statusLabel, isComplete && styles.successText]}>
          {status}
        </Text>
      </View>
      <View style={styles.copy}>
        <Text accessibilityRole="header" style={styles.title}>
          {title}
        </Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      {visibleRoutine && !isUnavailable ? (
        <View style={styles.metadata}>
          <View style={styles.metaItem}>
            <AppIcon
              color={SemanticColors.textMuted}
              name="exercises"
              size={16}
            />
            <Text style={styles.metaText}>
              {visibleRoutine.exercises}{" "}
              {visibleRoutine.exercises === 1 ? "exercise" : "exercises"}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <AppIcon color={SemanticColors.textMuted} name="clock" size={16} />
            <Text style={styles.metaText}>About {visibleRoutine.duration}</Text>
          </View>
        </View>
      ) : null}
      <View style={styles.actions}>
        {isComplete && completedSessionId ? (
          <Link
            href={{
              pathname: "/progress/summary",
              params: { sessionId: completedSessionId },
            }}
            asChild
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="View today's workout summary"
            >
              {({ pressed }) => (
                <View style={[styles.primaryButton, pressed && styles.pressed]}>
                  <Text style={styles.primaryLabel}>View workout summary</Text>
                  <AppIcon
                    color={SemanticColors.actionText}
                    name="chevronRight"
                    size={20}
                  />
                </View>
              )}
            </Pressable>
          </Link>
        ) : (
          <ActionButton
            busy={isStarting}
            icon={
              isUnavailable ? "swap" : isActive || routine ? "play" : "strength"
            }
            label={
              isStarting
                ? "Opening workout…"
                : isActive
                  ? "Resume workout"
                  : isUnavailable
                    ? "Choose another workout"
                    : routine
                      ? "Start workout"
                      : "Find a workout"
            }
            onPress={
              isUnavailable
                ? onOpenPlan
                : isActive || routine
                  ? onStart
                  : onBrowseWorkouts
            }
          />
        )}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            activeWorkoutIsSeparate && routine
              ? `View today's plan: ${routine.title}`
              : "Open weekly plan"
          }
          onPress={onOpenPlan}
          style={({ pressed }) => [
            styles.planButton,
            pressed && styles.pressed,
          ]}
        >
          <AppIcon
            color={SemanticColors.textSecondary}
            name="calendar"
            size={18}
          />
          <Text style={styles.planLabel}>
            {activeWorkoutIsSeparate && routine
              ? `Today’s plan: ${routine.title}`
              : routine
                ? "View weekly plan"
                : "Plan my week"}
          </Text>
          <AppIcon
            color={SemanticColors.textMuted}
            name="chevronRight"
            size={16}
          />
        </Pressable>
      </View>
    </View>
  );
}

function ActionButton({
  busy = false,
  icon,
  label,
  onPress,
}: {
  busy?: boolean;
  icon: AppIconName;
  label: string;
  onPress: () => void;
}) {
  const styles = useStyles();
  const { SemanticColors } = useAppTheme();
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ busy, disabled: busy }}
      disabled={busy}
      onPress={onPress}
      style={({ pressed }) => [
        styles.primaryButton,
        busy && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      {busy ? (
        <ActivityIndicator color={SemanticColors.actionText} />
      ) : (
        <AppIcon color={SemanticColors.actionText} name={icon} size={20} />
      )}
      <Text style={styles.primaryLabel}>{label}</Text>
    </Pressable>
  );
}

import { useAppTheme } from '@/theme/app-theme-provider';
import { ActivityIndicator, Pressable, View } from "react-native";
import Animated, {
  LinearTransition,
  ReduceMotion,
} from "react-native-reanimated";

import { AppIcon } from "@/components/ui/app-icon";
import { ThemedText } from "@/components/ui/themed-text";

import { useStyles } from "./weekly-plan-screen.styles";
import type { WorkoutPlanDay } from "./weekly-plan.viewmodel";

export function DayCard({
  busy,
  initialLoading,
  disabled,
  day,
  onAssign,
  onChange,
  onMove,
  onRemove,
  onStart,
  onView,
  wide,
}: {
  busy: boolean;
  initialLoading: boolean;
  disabled: boolean;
  day: WorkoutPlanDay;
  onAssign: () => void;
  onChange: () => void;
  onMove: () => void;
  onRemove: () => void;
  onStart: () => void;
  onView: () => void;
  wide: boolean;
}) {
  const styles = useStyles();
  const { SemanticColors } = useAppTheme();
  const canStart =
    day.entryId &&
    (day.state === "assigned" || day.state === "in_progress") &&
    day.isToday;
  return (
    <Animated.View
      layout={LinearTransition.duration(180).reduceMotion(ReduceMotion.System)}
      accessibilityState={{ busy }}
      style={[
        styles.dayCard,
        day.state === 'rest' && styles.dayCardRest,
        wide && styles.dayCardWide,
        day.isToday && styles.dayCardToday,
      ]}
    >
      <View style={styles.dayHeader}>
        <View>
          <ThemedText style={styles.weekday}>
            {day.weekday}
          </ThemedText>
          <ThemedText style={styles.dateLabel}>{day.dateLabel}</ThemedText>
        </View>
        <View
          accessibilityLiveRegion="polite"
          style={[styles.statePill, statusStyle(day, styles)]}
        >
          {busy && !initialLoading ? (
            <ActivityIndicator color={SemanticColors.actionSoft} size="small" />
          ) : null}
          <ThemedText style={styles.stateText}>
            {busy
              ? initialLoading
                ? "Loading"
                : "Saving"
              : day.isToday &&
                  (day.state === "rest" || day.state === "assigned")
                ? "Today"
                : day.stateLabel}
          </ThemedText>
        </View>
      </View>
      {initialLoading ? (
        <View accessibilityLiveRegion="polite" style={styles.dayBusy}>
          <ActivityIndicator color={SemanticColors.action} />
          <ThemedText style={styles.muted}>Loading day...</ThemedText>
        </View>
      ) : day.workout ? (
        <View style={styles.dayBody}>
          <ThemedText style={styles.workoutTitle}>
            {day.workout.title}
          </ThemedText>
          <ThemedText style={styles.workoutMeta}>
            {day.workout.exerciseCount} exercises · {day.workout.duration}
          </ThemedText>
          {canStart ? (
            <SmallAction
              disabled={disabled}
              label={day.state === "in_progress" ? "Resume workout" : "Start workout"}
              onPress={onStart}
              primary
            />
          ) : null}
          <View style={styles.dayActions}>
            <SmallAction label="View" onPress={onView} />
            {day.editable ? (
              <SmallAction
                disabled={disabled}
                label="Change"
                onPress={onChange}
              />
            ) : null}
            {day.editable ? (
              <SmallAction disabled={disabled} label="Move" onPress={onMove} />
            ) : null}
            {day.editable ? (
              <SmallAction
                disabled={disabled}
                danger
                label="Remove"
                onPress={onRemove}
              />
            ) : null}
          </View>
        </View>
      ) : (
        <View style={styles.restBody}>
          <View style={styles.restHeading}>
            <AppIcon color={SemanticColors.textMuted} name="sun" size={20} />
            <ThemedText style={styles.restTitle}>Rest day</ThemedText>
          </View>
          {day.editable ? (
            <SmallAction
              busy={busy}
              disabled={disabled}
              label="Assign workout"
              onPress={onAssign}
            />
          ) : (
            <ThemedText style={styles.lockedText}>No workout was planned.</ThemedText>
          )}
        </View>
      )}
    </Animated.View>
  );
}

function SmallAction({
  busy,
  danger,
  disabled,
  label,
  onPress,
  primary,
}: {
  busy?: boolean;
  disabled?: boolean;
  danger?: boolean;
  label: string;
  onPress: () => void;
  primary?: boolean;
}) {
  const styles = useStyles();
  const { SemanticColors } = useAppTheme();
  const assign = label === "Assign workout";
  const start = label === 'Start workout' || label === 'Resume workout';
  return (
    <Pressable
      accessibilityLabel={busy ? "Assigning workout" : label}
      accessibilityRole="button"
      accessibilityState={{ busy, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.smallAction,
        assign && styles.assignAction,
        start && styles.startAction,
        primary && styles.smallActionPrimary,
        danger && styles.smallActionDanger,
        disabled && !assign && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      {assign ? (
        busy ? (
          <ActivityIndicator color={SemanticColors.actionSoft} size="small" />
        ) : (
          <AppIcon color={SemanticColors.actionSoft} name="add" size={18} />
        )
      ) : null}
      {start ? <AppIcon color={SemanticColors.actionText} name="play" size={18} /> : null}
      <ThemedText
        style={[
          styles.smallActionText,
          assign && styles.assignActionText,
          start && styles.startActionText,
          primary && styles.smallActionPrimaryText,
          danger && styles.smallActionDangerText,
        ]}
      >
        {busy ? "Assigning..." : label}
      </ThemedText>
    </Pressable>
  );
}

function statusStyle(day: WorkoutPlanDay, styles: ReturnType<typeof useStyles>) {
  if (day.state === "completed") return styles.stateCompleted;
  if (day.state === "missed" || day.state === "unavailable")
    return styles.stateDanger;
  if (day.state === "in_progress" || day.isToday) return styles.stateActive;
  return styles.stateNeutral;
}

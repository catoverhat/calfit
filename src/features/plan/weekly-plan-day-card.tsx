import { ActivityIndicator, Pressable, View } from "react-native";
import Animated, {
  LinearTransition,
  ReduceMotion,
} from "react-native-reanimated";

import { AppIcon } from "@/components/ui/app-icon";
import { ThemedText } from "@/components/ui/themed-text";
import { SemanticColors } from "@/theme/tokens";
import { styles } from "./weekly-plan-screen.styles";
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
        wide && styles.dayCardWide,
        day.isToday && styles.dayCardToday,
      ]}
    >
      <View style={styles.dayHeader}>
        <View>
          <ThemedText style={styles.weekday}>
            {wide ? day.weekday.slice(0, 3) : day.weekday}
          </ThemedText>
          <ThemedText style={styles.dateLabel}>{day.dateLabel}</ThemedText>
        </View>
        <View
          accessibilityLiveRegion="polite"
          style={[styles.statePill, statusStyle(day)]}
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
          <ThemedText numberOfLines={2} style={styles.workoutTitle}>
            {day.workout.title}
          </ThemedText>
          <ThemedText style={styles.workoutMeta}>
            {day.workout.exerciseCount} exercises · {day.workout.duration}
          </ThemedText>
          {canStart ? (
            <SmallAction
              disabled={disabled}
              label={day.state === "in_progress" ? "Resume" : "Start"}
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
          <ThemedText style={styles.restTitle}>
            {day.isToday ? "Planned rest day" : "Rest day"}
          </ThemedText>
          {day.editable ? (
            <SmallAction
              busy={busy}
              disabled={disabled}
              label="Assign workout"
              onPress={onAssign}
              primary
            />
          ) : (
            <ThemedText style={styles.lockedText}>Read-only</ThemedText>
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
  const assign = label === "Assign workout";
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
        primary && styles.smallActionPrimary,
        danger && styles.smallActionDanger,
        pressed && styles.pressed,
      ]}
    >
      {assign ? (
        busy ? (
          <ActivityIndicator color={SemanticColors.actionText} size="small" />
        ) : (
          <AppIcon color={SemanticColors.actionText} name="add" size={18} />
        )
      ) : null}
      <ThemedText
        style={[
          styles.smallActionText,
          assign && styles.assignActionText,
          primary && styles.smallActionPrimaryText,
          danger && styles.smallActionDangerText,
        ]}
      >
        {busy ? "Assigning..." : label}
      </ThemedText>
    </Pressable>
  );
}

function statusStyle(day: WorkoutPlanDay) {
  if (day.state === "completed") return styles.stateCompleted;
  if (day.state === "missed" || day.state === "unavailable")
    return styles.stateDanger;
  if (day.state === "in_progress" || day.isToday) return styles.stateActive;
  return styles.stateNeutral;
}

import { Image } from "expo-image";
import { useState } from "react";
import { Pressable, View } from "react-native";

import { AppIcon } from "@/components/ui/app-icon";
import { ThemedText } from "@/components/ui/themed-text";
import {
  distanceFromCanonical,
  formatUnitNumber,
  speedFromCanonical,
  weightFromCanonical,
  type RoutineExerciseTargetRow,
  type RoutineExerciseWithTargets,
} from "@/db";
import { useAppTheme } from "@/theme/app-theme-provider";

import { useStyles } from "../routine-detail-screen.styles";
import type { RoutineUnits } from "../routine-draft-context";

export function RoutineDetailExercise({
  index,
  item,
  units,
}: {
  index: number;
  item: RoutineExerciseWithTargets;
  units: RoutineUnits;
}) {
  const styles = useStyles();
  const { SemanticColors } = useAppTheme();
  const [expanded, setExpanded] = useState(index === 0);

  return (
    <View style={styles.exerciseCard}>
      <Pressable
        accessibilityLabel={`${index + 1}. ${item.exercise.name}, ${item.targets.length} target ${item.targets.length === 1 ? "set" : "sets"}`}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        onPress={() => setExpanded((value) => !value)}
        style={({ pressed }) => [
          styles.exerciseHeader,
          pressed && styles.pressed,
        ]}
      >
        <View style={styles.exerciseIndex}>
          <ThemedText style={styles.exerciseIndexText}>
            {String(index + 1).padStart(2, "0")}
          </ThemedText>
        </View>
        <View style={styles.exerciseCopy}>
          <ThemedText style={styles.exerciseName}>
            {item.exercise.name}
          </ThemedText>
          <ThemedText style={styles.exerciseMeta}>
            {item.targets.length}{" "}
            {item.targets.length === 1 ? "target set" : "target sets"} ·{" "}
            {expanded ? "Hide targets" : "View targets"}
          </ThemedText>
        </View>
        <AppIcon
          color={SemanticColors.textMuted}
          name={expanded ? "chevronUp" : "chevronDown"}
          size={20}
        />
      </Pressable>
      {expanded ? (
        <View style={styles.exerciseDetails}>
          {item.exercise.image_url || item.exercise.description ? (
            <View style={styles.exerciseAbout}>
              {item.exercise.image_url ? (
                <Image
                  accessibilityLabel={`${item.exercise.name} preview`}
                  contentFit="cover"
                  source={item.exercise.image_url}
                  style={styles.exerciseImage}
                />
              ) : null}
              {item.exercise.description ? (
                <ThemedText
                  style={[styles.exerciseDescription, styles.exerciseAboutCopy]}
                >
                  {item.exercise.description}
                </ThemedText>
              ) : null}
            </View>
          ) : null}
          <View style={styles.targetList}>
            {item.targets.length ? (
              item.targets.map((target) => (
                <TargetRow
                  key={target.routine_exercise_target_id}
                  target={target}
                  units={units}
                />
              ))
            ) : (
              <ThemedText style={styles.exerciseDescription}>
                No targets set. Edit this workout to add your sets.
              </ThemedText>
            )}
          </View>
        </View>
      ) : null}
    </View>
  );
}

function TargetRow({
  target,
  units,
}: {
  target: RoutineExerciseTargetRow;
  units: RoutineUnits;
}) {
  const styles = useStyles();
  const values = [
    target.target_reps !== null ? `${target.target_reps} reps` : null,
    target.target_weight !== null
      ? `${formatUnitNumber(weightFromCanonical(target.target_weight, units.weightUnit))} ${units.weightUnit}`
      : null,
    target.target_speed !== null
      ? `${formatUnitNumber(speedFromCanonical(target.target_speed, units.speedUnit))} ${units.speedUnit === "kmh" ? "km/h" : "mph"}`
      : null,
    target.target_duration_seconds !== null
      ? formatDuration(target.target_duration_seconds)
      : null,
    target.target_distance !== null
      ? `${formatUnitNumber(distanceFromCanonical(target.target_distance, units.distanceUnit), 2)} ${units.distanceUnit}`
      : null,
  ].filter(Boolean);
  return (
    <View style={styles.targetRow}>
      <ThemedText style={styles.setNumber}>SET {target.set_number}</ThemedText>
      <View style={styles.targetCopy}>
        <ThemedText style={styles.targetText}>
          {values.join(" · ") || "Open target"}
        </ThemedText>
        {target.rest_time_seconds !== null ? (
          <ThemedText style={styles.restText}>
            {formatDuration(target.rest_time_seconds)} rest
          </ThemedText>
        ) : null}
      </View>
    </View>
  );
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return minutes
    ? `${minutes} min${remainder ? ` ${remainder} sec` : ""}`
    : `${seconds} sec`;
}

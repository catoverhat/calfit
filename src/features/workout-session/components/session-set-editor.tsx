import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { AppIcon } from "@/components/ui/app-icon";
import { useAppTheme } from "@/theme/app-theme-provider";

import { useStyles } from "../active-workout-session-screen.styles";
import type {
  WorkoutMetricField,
  WorkoutSessionExerciseViewModel,
  WorkoutSessionSetViewModel,
  WorkoutSessionViewModel,
} from "../workout-session.viewmodel";

export function SessionSetEditor({
  exercise,
  onBlurField,
  onToggleSet,
  onUpdateField,
  saveErrors,
  sets,
  units,
}: {
  exercise: WorkoutSessionExerciseViewModel;
  onBlurField: (setId: string) => void;
  onToggleSet: (setId: string) => void;
  onUpdateField: (
    setId: string,
    field: WorkoutMetricField,
    value: string,
  ) => void;
  saveErrors: Record<string, string>;
  sets: Record<string, WorkoutSessionSetViewModel>;
  units: Pick<
    WorkoutSessionViewModel,
    "distanceUnit" | "speedUnit" | "weightUnit"
  >;
}) {
  const styles = useStyles();
  const { SemanticColors } = useAppTheme();
  const nextSetId = exercise.sets.find((set) => !sets[set.id].completed)?.id;

  return (
    <View style={styles.setList}>
      {exercise.sets.map((sourceSet) => {
        const set = sets[sourceSet.id];
        const isNext = set.id === nextSetId;
        const error = saveErrors[set.id];

        return (
          <View
            key={set.id}
            style={[
              styles.dynamicSetCard,
              isNext && styles.dynamicSetCardNext,
              set.completed && styles.dynamicSetCardCompleted,
              Boolean(error) && styles.dynamicSetCardError,
            ]}
          >
            <View style={styles.dynamicSetHeader}>
              <View style={styles.setIdentity}>
                <Text style={styles.dynamicSetLabel}>Set {set.setNumber}</Text>
                <Text
                  style={[
                    styles.setStatus,
                    isNext && styles.nextSetText,
                    set.completed && styles.successText,
                  ]}
                >
                  {set.completed ? "Completed" : isNext ? "Next set" : "To do"}
                </Text>
              </View>
              <Pressable
                accessibilityHint={
                  set.completed
                    ? "Tap to mark this set incomplete."
                    : "Saves your values and starts the rest timer if one is set."
                }
                accessibilityLabel={`${set.completed ? "Reopen" : "Log"} set ${set.setNumber} for ${exercise.name}`}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: set.completed }}
                onPress={() => onToggleSet(set.id)}
                style={({ pressed }) => [
                  styles.setCheckButton,
                  isNext && styles.setCheckButtonNext,
                  set.completed && styles.setCheckButtonCompleted,
                  pressed && styles.pressed,
                ]}
              >
                <AppIcon
                  color={
                    set.completed
                      ? SemanticColors.success
                      : isNext
                        ? SemanticColors.actionText
                        : SemanticColors.textPrimary
                  }
                  name="check"
                  size={18}
                />
                <Text
                  style={[
                    styles.setCheckText,
                    isNext && styles.setCheckTextNext,
                    set.completed && styles.successText,
                  ]}
                >
                  {set.completed ? "Logged" : "Log set"}
                </Text>
              </Pressable>
            </View>
            <View style={styles.dynamicFieldRow}>
              {set.fields.map((field) => (
                <MetricInput
                  exerciseName={exercise.name}
                  field={field}
                  hasError={Boolean(error)}
                  key={field}
                  onBlur={() => onBlurField(set.id)}
                  onChange={(value) => onUpdateField(set.id, field, value)}
                  set={set}
                  units={units}
                />
              ))}
            </View>
            {error ? (
              <View accessibilityRole="alert" style={styles.setErrorRow}>
                <AppIcon
                  color={SemanticColors.danger}
                  name="warning"
                  size={16}
                />
                <Text style={styles.setError}>{error}</Text>
              </View>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

function MetricInput({
  exerciseName,
  field,
  hasError,
  onBlur,
  onChange,
  set,
  units,
}: {
  exerciseName: string;
  field: WorkoutMetricField;
  hasError: boolean;
  onBlur: () => void;
  onChange: (value: string) => void;
  set: WorkoutSessionSetViewModel;
  units: Pick<
    WorkoutSessionViewModel,
    "distanceUnit" | "speedUnit" | "weightUnit"
  >;
}) {
  const { scheme, SemanticColors, ComponentTokens } = useAppTheme();
  const styles = useStyles();
  const [focused, setFocused] = useState(false);
  const labels: Record<WorkoutMetricField, string> = {
    reps: "Reps",
    weight: `Weight (${units.weightUnit})`,
    speed: `Speed (${units.speedUnit === "kmh" ? "km/h" : "mph"})`,
    duration: "Time (sec)",
    distance: `Distance (${units.distanceUnit})`,
  };

  return (
    <View style={styles.dynamicField}>
      <Text style={styles.dynamicFieldLabel}>{labels[field]}</Text>
      <TextInput
        accessibilityLabel={`${labels[field]} for ${exerciseName}, set ${set.setNumber}`}
        keyboardAppearance={scheme}
        keyboardType={
          field === "reps" || field === "duration"
            ? "number-pad"
            : "decimal-pad"
        }
        onBlur={() => {
          setFocused(false);
          onBlur();
        }}
        onChangeText={onChange}
        onFocus={() => setFocused(true)}
        placeholder="—"
        placeholderTextColor={SemanticColors.textMuted}
        selectTextOnFocus
        selectionColor={ComponentTokens.input.selectionColor}
        style={[
          styles.dynamicInput,
          hasError && styles.inputError,
          focused && styles.inputFocused,
        ]}
        value={set[field]}
      />
    </View>
  );
}

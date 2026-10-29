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

type Units = Pick<
  WorkoutSessionViewModel,
  "distanceUnit" | "speedUnit" | "weightUnit"
>;

export function SessionSetEditor({
  busy,
  exercise,
  onAddSet,
  onBlurField,
  onRemoveSet,
  onToggleSet,
  onUpdateField,
  saveErrors,
  sets,
  units,
}: {
  busy: boolean;
  exercise: WorkoutSessionExerciseViewModel;
  onAddSet: () => void;
  onBlurField: (setId: string) => void;
  onRemoveSet: (setId: string) => void;
  onToggleSet: (setId: string) => void;
  onUpdateField: (
    setId: string,
    field: WorkoutMetricField,
    value: string,
  ) => void;
  saveErrors: Record<string, string>;
  sets: Record<string, WorkoutSessionSetViewModel>;
  units: Units;
}) {
  const styles = useStyles();
  const { SemanticColors } = useAppTheme();
  const nextSetId = exercise.sets.find((set) => !sets[set.id].completed)?.id;
  const lastSet = exercise.sets.at(-1);
  // Only an unlogged trailing set can be removed, so set numbers stay contiguous and no logged work is lost.
  const removableSetId =
    exercise.sets.length > 1 && lastSet && !sets[lastSet.id].completed
      ? lastSet.id
      : null;

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
                {set.previous ? (
                  <Text style={styles.previousText}>
                    Last time: {set.previous}
                  </Text>
                ) : null}
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
            {set.id === removableSetId ? (
              <Pressable
                accessibilityLabel={`Remove set ${set.setNumber} from ${exercise.name}`}
                accessibilityRole="button"
                accessibilityState={{ disabled: busy }}
                disabled={busy}
                onPress={() => onRemoveSet(set.id)}
                style={({ pressed }) => [
                  styles.removeSetButton,
                  busy && styles.disabled,
                  pressed && styles.pressed,
                ]}
              >
                <AppIcon color={SemanticColors.danger} name="trash" size={16} />
                <Text style={styles.removeSetText}>Remove set</Text>
              </Pressable>
            ) : null}
          </View>
        );
      })}
      <Pressable
        accessibilityLabel={`Add a set to ${exercise.name}`}
        accessibilityRole="button"
        accessibilityState={{ disabled: busy }}
        disabled={busy}
        onPress={onAddSet}
        style={({ pressed }) => [
          styles.addSetButton,
          busy && styles.disabled,
          pressed && styles.pressed,
        ]}
      >
        <AppIcon color={SemanticColors.actionSoft} name="add" size={18} />
        <Text style={styles.addSetText}>Add set</Text>
      </Pressable>
    </View>
  );
}

function stepFor(field: WorkoutMetricField, units: Units): number | null {
  if (field === "reps") return 1;
  if (field === "weight") return units.weightUnit === "lb" ? 5 : 2.5;
  if (field === "duration") return 5;
  return null;
}

function stepValue(value: string, delta: number): string {
  const current = Number(value.replace(",", "."));
  const next =
    Math.round(((Number.isFinite(current) ? current : 0) + delta) * 100) / 100;
  return next > 0 ? String(next) : "";
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
  units: Units;
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
  const step = stepFor(field, units);
  const fieldLabel = `${labels[field]} for ${exerciseName}, set ${set.setNumber}`;

  const stepper = (delta: number) => (
    <Pressable
      accessibilityLabel={`${delta > 0 ? "Increase" : "Decrease"} ${fieldLabel} by ${Math.abs(delta)}`}
      accessibilityRole="button"
      hitSlop={4}
      onPress={() => onChange(stepValue(set[field], delta))}
      style={({ pressed }) => [styles.stepButton, pressed && styles.pressed]}
    >
      <AppIcon
        color={SemanticColors.textPrimary}
        name={delta > 0 ? "add" : "minus"}
        size={18}
      />
    </Pressable>
  );

  return (
    <View style={[styles.dynamicField, step !== null && styles.stepperField]}>
      <Text style={styles.dynamicFieldLabel}>{labels[field]}</Text>
      <View style={styles.stepperRow}>
        {step !== null ? stepper(-step) : null}
        <TextInput
          accessibilityLabel={fieldLabel}
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
        {step !== null ? stepper(step) : null}
      </View>
    </View>
  );
}

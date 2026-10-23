import { Pressable, TextInput, View } from "react-native";

import { AppIcon } from "@/components/ui/app-icon";
import { ThemedText } from "@/components/ui/themed-text";
import { DesignColors, SemanticColors } from "@/theme/tokens";
import type {
  RoutineExerciseDraft,
  RoutineTargetDraft,
  RoutineUnits,
} from "../routine-draft-context";
import { styles } from "../routine-editor-screen.styles";

export function RoutineExerciseCard({
  addTarget,
  canMoveDown,
  canMoveUp,
  exercise,
  moveDown,
  moveUp,
  onDelete,
  removeTarget,
  units,
  updateTarget,
}: {
  addTarget: () => void;
  canMoveDown: boolean;
  canMoveUp: boolean;
  exercise: RoutineExerciseDraft;
  moveDown: () => void;
  moveUp: () => void;
  onDelete: () => void;
  removeTarget: (targetId: string) => void;
  units: RoutineUnits;
  updateTarget: (
    targetId: string,
    field: keyof Omit<RoutineTargetDraft, "id">,
    value: string,
  ) => void;
}) {
  return (
    <View style={styles.exerciseCard}>
      <View style={styles.exerciseTitleRow}>
        <View style={styles.exerciseTitleCopy}>
          <ThemedText style={styles.exerciseName}>{exercise.name}</ThemedText>
          <ThemedText style={styles.exerciseMeta}>
            {exercise.targets.length}{" "}
            {exercise.targets.length === 1 ? "set" : "sets"}
          </ThemedText>
        </View>
        <View style={styles.exerciseActions}>
          <IconButton
            disabled={!canMoveUp}
            icon="arrowUp"
            label={`Move ${exercise.name} up`}
            onPress={moveUp}
          />
          <IconButton
            disabled={!canMoveDown}
            icon="arrowDown"
            label={`Move ${exercise.name} down`}
            onPress={moveDown}
          />
          <IconButton
            icon="trash"
            label={`Remove ${exercise.name}`}
            onPress={onDelete}
            tone="danger"
          />
        </View>
      </View>
      <View style={styles.targetEditorList}>
        {exercise.targets.map((target, index) => (
          <View key={target.id} style={styles.targetEditor}>
            <View style={styles.targetHeader}>
              <ThemedText style={styles.targetTitle}>
                SET {index + 1}
              </ThemedText>
              <Pressable
                accessibilityLabel={`Remove set ${index + 1}`}
                accessibilityRole="button"
                accessibilityState={{ disabled: exercise.targets.length === 1 }}
                disabled={exercise.targets.length === 1}
                onPress={() => removeTarget(target.id)}
                style={({ pressed }) => [
                  styles.removeSetButton,
                  exercise.targets.length === 1 && styles.buttonDisabled,
                  pressed && styles.pressed,
                ]}
              >
                <AppIcon color={SemanticColors.danger} name="trash" size={16} />
              </Pressable>
            </View>
            <View style={styles.targetFields}>
              <TargetInput
                field="reps"
                label="Reps"
                target={target}
                updateTarget={updateTarget}
              />
              <TargetInput
                decimal
                field="weight"
                label={`Weight ${units.weightUnit}`}
                target={target}
                updateTarget={updateTarget}
              />
              <TargetInput
                decimal
                field="speed"
                label={`Speed ${units.speedUnit === 'kmh' ? 'km/h' : 'mph'}`}
                target={target}
                updateTarget={updateTarget}
              />
              <TargetInput
                field="duration"
                label="Duration sec"
                target={target}
                updateTarget={updateTarget}
              />
              <TargetInput
                decimal
                field="distance"
                label={`Distance ${units.distanceUnit}`}
                target={target}
                updateTarget={updateTarget}
              />
              <TargetInput
                field="rest"
                label="Rest sec"
                target={target}
                updateTarget={updateTarget}
              />
            </View>
          </View>
        ))}
      </View>
      <Pressable
        accessibilityLabel={`Add target set to ${exercise.name}`}
        accessibilityRole="button"
        onPress={addTarget}
        style={({ pressed }) => [
          styles.addSetButton,
          pressed && styles.pressed,
        ]}
      >
        <AppIcon color={SemanticColors.actionSoft} name="add" size={16} />
        <ThemedText style={styles.addSetText}>Add target set</ThemedText>
      </Pressable>
    </View>
  );
}

function TargetInput({
  decimal,
  field,
  label,
  target,
  updateTarget,
}: {
  decimal?: boolean;
  field: keyof Omit<RoutineTargetDraft, "id">;
  label: string;
  target: RoutineTargetDraft;
  updateTarget: (
    targetId: string,
    field: keyof Omit<RoutineTargetDraft, "id">,
    value: string,
  ) => void;
}) {
  return (
    <View style={styles.targetField}>
      <ThemedText style={styles.targetLabel}>{label}</ThemedText>
      <TextInput
        accessibilityLabel={label}
        keyboardType={decimal ? "decimal-pad" : "number-pad"}
        onChangeText={(value) => updateTarget(target.id, field, value)}
        placeholder="—"
        placeholderTextColor={DesignColors.onSecondaryContainer}
        selectionColor={SemanticColors.action}
        style={styles.targetInput}
        value={target[field]}
      />
    </View>
  );
}

function IconButton({
  disabled,
  icon,
  label,
  onPress,
  tone,
}: {
  disabled?: boolean;
  icon: "arrowUp" | "arrowDown" | "trash";
  label: string;
  onPress: () => void;
  tone?: "danger";
}) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.exerciseIconButton,
        disabled && styles.buttonDisabled,
        pressed && styles.pressed,
      ]}
    >
      <AppIcon
        color={
          tone === "danger" ? SemanticColors.danger : SemanticColors.textMuted
        }
        name={icon}
        size={17}
      />
    </Pressable>
  );
}

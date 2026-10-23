import { ActivityIndicator, Pressable, TextInput, View } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import { ThemedText } from '@/components/ui/themed-text';
import { DesignColors, SemanticColors } from '@/theme/tokens';
import type {
  RoutineDraft,
  RoutineExerciseDraft,
  RoutineTargetDraft,
  RoutineUnits,
} from '../routine-draft-context';
import { styles } from '../routine-editor-screen.styles';
import { RoutineExerciseCard } from './routine-exercise-card';

type SetDraftField = <Key extends 'active' | 'description' | 'name'>(
  key: Key,
  value: RoutineDraft[Key]
) => void;

export function RoutineIdentitySection({ draft, mode, setDraftField }: {
  draft: RoutineDraft;
  mode: 'create' | 'edit';
  setDraftField: SetDraftField;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.titleRow}>
        <View style={styles.titleCopy}>
          <ThemedText style={styles.eyebrow}>
            {mode === 'edit' ? 'Update your workout' : 'Build your workout'}
          </ThemedText>
          <ThemedText style={styles.title}>
            {mode === 'edit' ? 'Edit Workout' : 'Create Workout'}
          </ThemedText>
        </View>
        <Pressable
          accessibilityLabel={draft.active ? 'Deactivate workout' : 'Activate workout'}
          accessibilityRole="switch"
          accessibilityState={{ checked: draft.active }}
          hitSlop={9}
          onPress={() => setDraftField('active', !draft.active)}
          style={[styles.toggleTrack, draft.active && styles.toggleTrackActive]}>
          <View style={[styles.toggleThumb, draft.active && styles.toggleThumbActive]} />
        </Pressable>
      </View>
      <View style={styles.fieldGroup}>
        <ThemedText style={styles.label}>Workout name</ThemedText>
        <TextInput
          accessibilityLabel="Workout name"
          onChangeText={(value) => setDraftField('name', value)}
          placeholder="e.g. Upper Body Power"
          placeholderTextColor={DesignColors.onSecondaryContainer}
          selectionColor={SemanticColors.action}
          style={styles.nameInput}
          value={draft.name}
        />
      </View>
      <View style={styles.fieldGroup}>
        <ThemedText style={styles.label}>Description</ThemedText>
        <TextInput
          accessibilityLabel="Workout description"
          multiline
          onChangeText={(value) => setDraftField('description', value)}
          placeholder="What is this workout designed to accomplish?"
          placeholderTextColor={DesignColors.onSecondaryContainer}
          selectionColor={SemanticColors.action}
          style={styles.descriptionInput}
          textAlignVertical="top"
          value={draft.description}
        />
      </View>
    </View>
  );
}

export function RoutineExerciseSection({
  addTarget,
  exercises,
  moveExercise,
  onAdd,
  removeExercise,
  removeTarget,
  units,
  updateTarget,
}: {
  addTarget: (exerciseId: string) => void;
  exercises: RoutineExerciseDraft[];
  moveExercise: (id: string, direction: -1 | 1) => void;
  onAdd: () => void;
  removeExercise: (id: string) => void;
  removeTarget: (exerciseId: string, targetId: string) => void;
  units: RoutineUnits;
  updateTarget: (
    exerciseId: string,
    targetId: string,
    field: keyof Omit<RoutineTargetDraft, 'id'>,
    value: string
  ) => void;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.exerciseHeader}>
        <View>
          <ThemedText style={styles.eyebrow}>Workout definition</ThemedText>
          <ThemedText style={styles.sectionTitle}>Exercises</ThemedText>
        </View>
        <ThemedText style={styles.exerciseCount}>{exercises.length} selected</ThemedText>
      </View>
      <View style={styles.exerciseList}>
        {exercises.map((exercise, index) => (
          <RoutineExerciseCard
            addTarget={() => addTarget(exercise.id)}
            canMoveDown={index < exercises.length - 1}
            canMoveUp={index > 0}
            exercise={exercise}
            key={exercise.id}
            moveDown={() => moveExercise(exercise.id, 1)}
            moveUp={() => moveExercise(exercise.id, -1)}
            onDelete={() => removeExercise(exercise.id)}
            removeTarget={(targetId) => removeTarget(exercise.id, targetId)}
            units={units}
            updateTarget={(targetId, field, value) =>
              updateTarget(exercise.id, targetId, field, value)
            }
          />
        ))}
        <Pressable
          accessibilityLabel="Add exercises"
          accessibilityRole="button"
          onPress={onAdd}
          style={({ pressed }) => [styles.addExerciseCard, pressed && styles.pressed]}>
          <View style={styles.addIconCircle}>
            <AppIcon color={SemanticColors.actionSoft} name="add" size={22} />
          </View>
          <View style={styles.addCopy}>
            <ThemedText style={styles.addExerciseText}>Add exercises</ThemedText>
            <ThemedText style={styles.addExerciseHint}>Search your local exercise catalog</ThemedText>
          </View>
          <AppIcon color={SemanticColors.textMuted} name="open" size={18} />
        </Pressable>
      </View>
    </View>
  );
}

export function RoutineEditorFooter({ isSaving, onSave }: { isSaving: boolean; onSave: () => void }) {
  return (
    <Pressable
      accessibilityLabel="Save workout"
      accessibilityRole="button"
      disabled={isSaving}
      onPress={onSave}
      style={({ pressed }) => [
        styles.saveButton,
        isSaving && styles.buttonDisabled,
        pressed && styles.saveButtonPressed,
      ]}>
      {isSaving ? (
        <ActivityIndicator color={DesignColors.onPrimaryContainer} />
      ) : (
        <AppIcon color={DesignColors.onPrimaryContainer} name="save" size={20} />
      )}
      <ThemedText style={styles.saveButtonText}>{isSaving ? 'Saving…' : 'Save workout'}</ThemedText>
    </Pressable>
  );
}

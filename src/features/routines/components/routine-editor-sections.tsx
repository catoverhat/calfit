import { Pressable, Text, TextInput, View } from 'react-native';

import { Palette } from '@/theme/tokens';
import { styles } from '../routine-editor-screen.styles';
import { RoutineExerciseCard, type EditableExercise } from './routine-exercise-card';

export function RoutineIdentitySection({
  active,
  description,
  mode,
  onActiveChange,
  onDescriptionChange,
  onNameChange,
  routineId,
  routineName,
}: {
  active: boolean;
  description: string;
  mode: 'create' | 'edit';
  onActiveChange: (active: boolean) => void;
  onDescriptionChange: (description: string) => void;
  onNameChange: (name: string) => void;
  routineId?: string;
  routineName: string;
}) {
  return (
    <>
      <View style={styles.titleRow}>
        <View style={styles.titleCopy}>
          <Text style={styles.title}>{mode === 'edit' ? 'Edit Routine' : 'Create Routine'}</Text>
          {routineId ? <Text style={styles.routeHint}>Routine ID: {routineId}</Text> : null}
        </View>
        <View style={styles.activeRow}>
          <Pressable
            accessibilityLabel={active ? 'Deactivate routine' : 'Activate routine'}
            accessibilityRole="switch"
            accessibilityState={{ checked: active }}
            onPress={() => onActiveChange(!active)}
            style={[styles.toggleTrack, active && styles.toggleTrackActive]}>
            <View style={[styles.toggleThumb, active && styles.toggleThumbActive]} />
          </Pressable>
          <Text style={styles.activeText}>{active ? 'Active' : 'Inactive'}</Text>
        </View>
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Routine Name</Text>
        <TextInput
          accessibilityLabel="Routine Name"
          onChangeText={onNameChange}
          placeholder="Routine name"
          placeholderTextColor="rgba(255, 255, 255, 0.18)"
          selectionColor={Palette.primary[500]}
          style={styles.nameInput}
          value={routineName}
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          accessibilityLabel="Description"
          multiline
          onChangeText={onDescriptionChange}
          placeholder="Describe the routine"
          placeholderTextColor="rgba(255, 255, 255, 0.18)"
          selectionColor={Palette.primary[500]}
          style={styles.descriptionInput}
          textAlignVertical="top"
          value={description}
        />
      </View>
    </>
  );
}

export function RoutineExerciseSection({
  exercises,
  onAdd,
  onDelete,
}: {
  exercises: EditableExercise[];
  onAdd: () => void;
  onDelete: (id: string) => void;
}) {
  return (
    <>
      <View style={styles.exerciseHeader}>
        <Text style={styles.sectionTitle}>Exercise List</Text>
        <Text style={styles.exerciseCount}>{exercises.length} Exercises</Text>
      </View>
      <View style={styles.exerciseList}>
        {exercises.map((exercise) => (
          <RoutineExerciseCard
            exercise={exercise}
            key={exercise.id}
            onDelete={() => onDelete(exercise.id)}
          />
        ))}
      </View>
      <Pressable
        accessibilityLabel="Add Exercise"
        accessibilityRole="button"
        onPress={onAdd}
        style={({ pressed }) => [styles.addExerciseCard, pressed && styles.pressed]}>
        <View style={styles.addIconCircle}>
          <Text style={styles.addIcon}>+</Text>
        </View>
        <Text style={styles.addExerciseText}>Add Exercise</Text>
      </Pressable>
    </>
  );
}

export function RoutineEditorFooter({ onSave }: { onSave: () => void }) {
  return (
    <Pressable
      accessibilityLabel="Save Routine"
      accessibilityRole="button"
      onPress={onSave}
      style={({ pressed }) => [styles.saveButton, pressed && styles.saveButtonPressed]}>
      <Text style={styles.saveButtonText}>Save Routine</Text>
    </Pressable>
  );
}

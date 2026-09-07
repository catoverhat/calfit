import { ActivityIndicator, Pressable, TextInput, View } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import { ThemedText } from '@/components/ui/themed-text';
import { DesignColors, SemanticColors } from '@/theme/tokens';
import type { RoutineDraft, RoutineExerciseDraft, RoutineTargetDraft } from '../routine-draft-context';
import { WEEKDAYS } from '../routine.viewmodel';
import { styles } from '../routine-editor-screen.styles';
import { RoutineExerciseCard } from './routine-exercise-card';

type SetDraftField = <Key extends 'active' | 'description' | 'name' | 'scheduleDays'>(key: Key, value: RoutineDraft[Key]) => void;

export function RoutineIdentitySection({ draft, mode, setDraftField }: { draft: RoutineDraft; mode: 'create' | 'edit'; setDraftField: SetDraftField }) {
  const toggleDay = (day: number) => setDraftField('scheduleDays', draft.scheduleDays.includes(day) ? draft.scheduleDays.filter((value) => value !== day) : [...draft.scheduleDays, day].sort());
  return (
    <View style={styles.section}>
      <View style={styles.titleRow}><View style={styles.titleCopy}><ThemedText style={styles.eyebrow}>{mode === 'edit' ? 'Update your program' : 'Build your program'}</ThemedText><ThemedText style={styles.title}>{mode === 'edit' ? 'Edit Routine' : 'Create Routine'}</ThemedText></View><Pressable accessibilityLabel={draft.active ? 'Deactivate routine' : 'Activate routine'} accessibilityRole="switch" accessibilityState={{ checked: draft.active }} onPress={() => setDraftField('active', !draft.active)} style={[styles.toggleTrack, draft.active && styles.toggleTrackActive]}><View style={[styles.toggleThumb, draft.active && styles.toggleThumbActive]} /></Pressable></View>
      <View style={styles.fieldGroup}><ThemedText style={styles.label}>Routine name</ThemedText><TextInput accessibilityLabel="Routine name" onChangeText={(value) => setDraftField('name', value)} placeholder="e.g. Upper Body Power" placeholderTextColor={DesignColors.onSecondaryContainer} selectionColor={SemanticColors.action} style={styles.nameInput} value={draft.name} /></View>
      <View style={styles.fieldGroup}><ThemedText style={styles.label}>Description</ThemedText><TextInput accessibilityLabel="Routine description" multiline onChangeText={(value) => setDraftField('description', value)} placeholder="What is this session designed to accomplish?" placeholderTextColor={DesignColors.onSecondaryContainer} selectionColor={SemanticColors.action} style={styles.descriptionInput} textAlignVertical="top" value={draft.description} /></View>
      <View style={styles.fieldGroup}><ThemedText style={styles.label}>Recurring training days</ThemedText><View style={styles.weekdayRow}>{WEEKDAYS.map((weekday) => { const selected = draft.scheduleDays.includes(weekday.day); return <Pressable accessibilityLabel={weekday.longLabel} accessibilityRole="button" accessibilityState={{ selected }} key={weekday.day} onPress={() => toggleDay(weekday.day)} style={({ pressed }) => [styles.weekdayButton, selected && styles.weekdayButtonSelected, pressed && styles.pressed]}><ThemedText style={[styles.weekdayText, selected && styles.weekdayTextSelected]}>{weekday.label}</ThemedText></Pressable>; })}</View><ThemedText style={styles.fieldHint}>{draft.scheduleDays.length ? `${draft.scheduleDays.length} training days selected` : 'No fixed schedule — this routine stays flexible.'}</ThemedText></View>
    </View>
  );
}

export function RoutineExerciseSection({ addTarget, exercises, moveExercise, onAdd, removeExercise, removeTarget, updateTarget }: { addTarget: (exerciseId: string) => void; exercises: RoutineExerciseDraft[]; moveExercise: (id: string, direction: -1 | 1) => void; onAdd: () => void; removeExercise: (id: string) => void; removeTarget: (exerciseId: string, targetId: string) => void; updateTarget: (exerciseId: string, targetId: string, field: keyof Omit<RoutineTargetDraft, 'id'>, value: string) => void }) {
  return <View style={styles.section}><View style={styles.exerciseHeader}><View><ThemedText style={styles.eyebrow}>Workout plan</ThemedText><ThemedText style={styles.sectionTitle}>Exercises</ThemedText></View><ThemedText style={styles.exerciseCount}>{exercises.length} selected</ThemedText></View><View style={styles.exerciseList}>{exercises.map((exercise, index) => <RoutineExerciseCard addTarget={() => addTarget(exercise.id)} canMoveDown={index < exercises.length - 1} canMoveUp={index > 0} exercise={exercise} key={exercise.id} moveDown={() => moveExercise(exercise.id, 1)} moveUp={() => moveExercise(exercise.id, -1)} onDelete={() => removeExercise(exercise.id)} removeTarget={(targetId) => removeTarget(exercise.id, targetId)} updateTarget={(targetId, field, value) => updateTarget(exercise.id, targetId, field, value)} />)}<Pressable accessibilityLabel="Add exercises" accessibilityRole="button" onPress={onAdd} style={({ pressed }) => [styles.addExerciseCard, pressed && styles.pressed]}><View style={styles.addIconCircle}><AppIcon color={SemanticColors.actionSoft} name="add" size={22} /></View><View style={styles.addCopy}><ThemedText style={styles.addExerciseText}>Add exercises</ThemedText><ThemedText style={styles.addExerciseHint}>Search your local exercise catalog</ThemedText></View><AppIcon color={SemanticColors.textMuted} name="open" size={18} /></Pressable></View></View>;
}

export function RoutineEditorFooter({ isSaving, onSave }: { isSaving: boolean; onSave: () => void }) {
  return <Pressable accessibilityLabel="Save routine" accessibilityRole="button" disabled={isSaving} onPress={onSave} style={({ pressed }) => [styles.saveButton, isSaving && styles.buttonDisabled, pressed && styles.saveButtonPressed]}>{isSaving ? <ActivityIndicator color={DesignColors.onPrimaryContainer} /> : <AppIcon color={DesignColors.onPrimaryContainer} name="save" size={20} />}<ThemedText style={styles.saveButtonText}>{isSaving ? 'Saving…' : 'Save routine'}</ThemedText></Pressable>;
}

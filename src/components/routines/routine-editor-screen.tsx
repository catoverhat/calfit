import { router } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Fonts, MaxContentWidth, Palette, Spacing, Typography } from '@/constants/theme';

type RoutineEditorScreenProps = {
  mode: 'create' | 'edit';
  routineId?: string;
};

type EditableExercise = {
  dist: string;
  id: string;
  name: string;
  reps: string;
  sets: string;
  speed: string;
  weight: string;
};

const initialExercises: EditableExercise[] = [
  {
    id: 'bench-press',
    name: 'Bench Press',
    sets: '4',
    reps: '8-10',
    weight: '85',
    speed: '-',
    dist: '-',
  },
  {
    id: 'shoulder-press',
    name: 'Shoulder Press',
    sets: '3',
    reps: '12',
    weight: '40',
    speed: '-',
    dist: '-',
  },
  {
    id: 'push-ups',
    name: 'Push-ups',
    sets: '3',
    reps: 'AMRAP',
    weight: 'BW',
    speed: '-',
    dist: '-',
  },
];

export function RoutineEditorScreen({ mode, routineId }: RoutineEditorScreenProps) {
  const [active, setActive] = useState(true);
  const [routineName, setRoutineName] = useState('Hypertrophy A');
  const [description, setDescription] = useState(
    'Focus on high intensity and 2-second eccentric phases. Targets chest and shoulders.'
  );
  const [exercises, setExercises] = useState(initialExercises);

  const deleteExercise = (id: string) => {
    setExercises((items) => items.filter((item) => item.id !== id));
  };

  const saveRoutine = () => {
    router.replace('/routines/index');
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      style={styles.screen}>
      <View style={styles.content}>
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
              onPress={() => setActive((value) => !value)}
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
            onChangeText={setRoutineName}
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
            onChangeText={setDescription}
            placeholder="Describe the routine"
            placeholderTextColor="rgba(255, 255, 255, 0.18)"
            selectionColor={Palette.primary[500]}
            style={styles.descriptionInput}
            textAlignVertical="top"
            value={description}
          />
        </View>

        <View style={styles.exerciseHeader}>
          <Text style={styles.sectionTitle}>Exercise List</Text>
          <Text style={styles.exerciseCount}>{exercises.length} Exercises</Text>
        </View>

        <View style={styles.exerciseList}>
          {exercises.map((exercise) => (
            <ExerciseCard
              exercise={exercise}
              key={exercise.id}
              onDelete={() => deleteExercise(exercise.id)}
            />
          ))}
        </View>

        <Pressable
          accessibilityLabel="Add Exercise"
          accessibilityRole="button"
          onPress={() => router.push('/routines/add-exercise')}
          style={({ pressed }) => [styles.addExerciseCard, pressed && styles.pressed]}>
          <View style={styles.addIconCircle}>
            <Text style={styles.addIcon}>+</Text>
          </View>
          <Text style={styles.addExerciseText}>Add Exercise</Text>
        </Pressable>

        <Pressable
          accessibilityLabel="Save Routine"
          accessibilityRole="button"
          onPress={saveRoutine}
          style={({ pressed }) => [styles.saveButton, pressed && styles.saveButtonPressed]}>
          <Text style={styles.saveButtonText}>Save Routine</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

function ExerciseCard({
  exercise,
  onDelete,
}: {
  exercise: EditableExercise;
  onDelete: () => void;
}) {
  return (
    <View style={styles.exerciseCard}>
      <View accessibilityElementsHidden style={styles.dragHandle}>
        <View style={styles.dragDot} />
        <View style={styles.dragDot} />
        <View style={styles.dragDot} />
      </View>

      <View style={styles.exerciseBody}>
        <View style={styles.exerciseTitleRow}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          <Pressable
            accessibilityLabel={`Delete ${exercise.name}`}
            accessibilityRole="button"
            hitSlop={8}
            onPress={onDelete}
            style={({ pressed }) => pressed && styles.pressed}>
            <TrashIcon />
          </Pressable>
        </View>

        <View style={styles.metricRow}>
          <MetricCell label="Sets" value={exercise.sets} />
          <MetricCell label="Reps" value={exercise.reps} />
          <MetricCell label="Weight (kg)" tone="accent" value={exercise.weight} />
          <MetricCell label="Speed" value={exercise.speed} />
          <MetricCell label="Dist (m)" value={exercise.dist} />
        </View>
      </View>
    </View>
  );
}

function MetricCell({
  label,
  tone,
  value,
}: {
  label: string;
  tone?: 'accent';
  value: string;
}) {
  return (
    <View style={styles.metricCell}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={[styles.metricValue, tone === 'accent' && styles.metricValueAccent]}>
        {value}
      </Text>
    </View>
  );
}

function TrashIcon() {
  return (
    <View accessibilityElementsHidden style={styles.trashIcon}>
      <View style={styles.trashLid} />
      <View style={styles.trashCan} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: Palette.secondary[950],
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    flexGrow: 1,
    paddingBottom: 112,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
  },
  content: {
    gap: Spacing.three,
    maxWidth: Math.min(MaxContentWidth, 430),
    width: '100%',
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.three,
    justifyContent: 'space-between',
  },
  titleCopy: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...Typography['3xl'],
    color: Palette.white,
    fontFamily: Fonts.heading,
    lineHeight: 36,
  },
  routeHint: {
    color: Palette.neutral[500],
    fontFamily: Fonts.bodyMedium,
    fontSize: 10,
    lineHeight: 14,
  },
  activeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.two,
  },
  toggleTrack: {
    backgroundColor: Palette.secondary[700],
    borderRadius: 14,
    height: 28,
    justifyContent: 'center',
    paddingHorizontal: 3,
    width: 50,
  },
  toggleTrackActive: {
    backgroundColor: Palette.primary[500],
  },
  toggleThumb: {
    backgroundColor: Palette.white,
    borderRadius: 11,
    height: 22,
    width: 22,
  },
  toggleThumbActive: {
    transform: [{ translateX: 22 }],
  },
  activeText: {
    color: Palette.white,
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
    lineHeight: 16,
  },
  formGroup: {
    gap: Spacing.one,
  },
  label: {
    color: Palette.primary[400],
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
    lineHeight: 16,
  },
  nameInput: {
    ...Typography.lg,
    backgroundColor: '#111010',
    borderColor: '#3A3737',
    borderCurve: 'continuous',
    borderRadius: 7,
    borderWidth: 1,
    color: Palette.white,
    fontFamily: Fonts.heading,
    minHeight: 64,
    paddingHorizontal: Spacing.three,
  },
  descriptionInput: {
    ...Typography.sm,
    backgroundColor: '#111010',
    borderColor: '#3A3737',
    borderCurve: 'continuous',
    borderRadius: 7,
    borderWidth: 1,
    color: Palette.white,
    fontFamily: Fonts.bodyMedium,
    minHeight: 86,
    padding: Spacing.three,
  },
  exerciseHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.one,
  },
  sectionTitle: {
    ...Typography.xl,
    color: Palette.white,
    fontFamily: Fonts.heading,
  },
  exerciseCount: {
    color: Palette.primary[100],
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    lineHeight: 16,
  },
  exerciseList: {
    gap: Spacing.three,
  },
  exerciseCard: {
    backgroundColor: '#1F1D1D',
    borderColor: '#343131',
    borderCurve: 'continuous',
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 148,
    overflow: 'hidden',
    padding: Spacing.three,
  },
  dragHandle: {
    alignItems: 'center',
    gap: 3,
    justifyContent: 'center',
    paddingRight: Spacing.two,
    width: 18,
  },
  dragDot: {
    backgroundColor: Palette.secondary[700],
    borderRadius: 1.5,
    height: 3,
    width: 3,
  },
  exerciseBody: {
    flex: 1,
    gap: Spacing.two,
  },
  exerciseTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  exerciseName: {
    ...Typography.xl,
    color: Palette.white,
    flex: 1,
    fontFamily: Fonts.heading,
    lineHeight: 28,
    textAlign: 'center',
  },
  metricRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  metricCell: {
    flex: 1,
    minWidth: 42,
  },
  metricLabel: {
    color: Palette.primary[100],
    fontFamily: Fonts.bodyBold,
    fontSize: 9,
    lineHeight: 12,
    textTransform: 'uppercase',
  },
  metricValue: {
    color: Palette.white,
    fontFamily: Fonts.bodyBold,
    fontSize: 20,
    lineHeight: 25,
  },
  metricValueAccent: {
    color: Palette.primary[500],
  },
  trashIcon: {
    height: 18,
    width: 18,
  },
  trashLid: {
    backgroundColor: Palette.secondary[700],
    height: 2,
    left: 4,
    position: 'absolute',
    top: 3,
    width: 10,
  },
  trashCan: {
    borderColor: Palette.secondary[700],
    borderRadius: 2,
    borderWidth: 1.5,
    height: 12,
    left: 5,
    position: 'absolute',
    top: 5,
    width: 8,
  },
  addExerciseCard: {
    alignItems: 'center',
    borderColor: '#3A3737',
    borderCurve: 'continuous',
    borderRadius: 10,
    borderStyle: 'dashed',
    borderWidth: 1,
    gap: Spacing.two,
    justifyContent: 'center',
    minHeight: 126,
    padding: Spacing.three,
  },
  addIconCircle: {
    alignItems: 'center',
    borderColor: Palette.primary[100],
    borderRadius: 14,
    borderWidth: 2,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  addIcon: {
    color: Palette.primary[500],
    fontFamily: Fonts.bodyBold,
    fontSize: 22,
    lineHeight: 25,
  },
  addExerciseText: {
    color: Palette.primary[100],
    fontFamily: Fonts.bodyBold,
    fontSize: 15,
    lineHeight: 20,
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: Palette.primary[500],
    borderCurve: 'continuous',
    borderRadius: 9,
    boxShadow: '0 14px 28px rgba(255, 95, 31, 0.24)',
    justifyContent: 'center',
    minHeight: 62,
    paddingHorizontal: Spacing.three,
  },
  saveButtonPressed: {
    backgroundColor: Palette.primary[600],
    transform: [{ scale: 0.99 }],
  },
  saveButtonText: {
    color: Palette.secondary[950],
    fontFamily: Fonts.bodyBold,
    fontSize: 18,
    lineHeight: 24,
  },
  pressed: {
    opacity: 0.7,
  },
});

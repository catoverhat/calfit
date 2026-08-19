import { Pressable, Text, View } from 'react-native';

import { styles } from '../routine-editor-screen.styles';

export type EditableExercise = {
  dist: string;
  id: string;
  name: string;
  reps: string;
  sets: string;
  speed: string;
  weight: string;
};
export function RoutineExerciseCard({
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

import { useAppTheme } from '@/theme/app-theme-provider';
import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import type { ExerciseCatalogRow } from '@/db';


import { useStyles } from '../add-exercise-screen.styles';
export function ExercisePickerRow({
  exercise,
  onToggle,
  selected,
}: {
  exercise: ExerciseCatalogRow;
  onToggle: () => void;
  selected: boolean;
}) {
  const styles = useStyles();
  const { DesignColors, SemanticColors } = useAppTheme();
  return (
    <View style={[styles.exerciseRow, selected && styles.exerciseRowSelected]}>
      <Image
        accessibilityLabel={`${exercise.name} thumbnail`}
        contentFit="cover"
        source={exercise.image_url}
        style={styles.exerciseImage}
        transition={180}
      />

      <View style={styles.exerciseCopy}>
        <Text style={styles.exerciseName}>{exercise.name}</Text>
        <Text style={styles.exerciseMeta}>
          {exercise.category_muscle_group ?? 'Uncategorized'} · {exercise.category_name ?? 'Exercise'}
        </Text>
      </View>

      <Pressable
        accessibilityLabel={selected ? `Remove ${exercise.name}` : `Add ${exercise.name}`}
        accessibilityRole="button"
        accessibilityState={{ selected }}
        onPress={onToggle}
        style={({ pressed }) => [
          styles.addButton,
          selected && styles.addButtonSelected,
          pressed && styles.pressed,
        ]}>
        <AppIcon
          color={selected ? DesignColors.onPrimaryContainer : SemanticColors.textPrimary}
          name={selected ? 'check' : 'add'}
          size={18}
        />
      </Pressable>
    </View>
  );
}

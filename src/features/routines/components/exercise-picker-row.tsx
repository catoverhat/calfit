import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import type { ExerciseCatalogItem } from '@/db/seed-data/exercise-catalog';
import { DesignColors, SemanticColors } from '@/theme/tokens';

import { styles } from '../add-exercise-screen.styles';
export function ExercisePickerRow({
  exercise,
  onToggle,
  selected,
}: {
  exercise: ExerciseCatalogItem;
  onToggle: () => void;
  selected: boolean;
}) {
  return (
    <View style={[styles.exerciseRow, selected && styles.exerciseRowSelected]}>
      <Image
        accessibilityLabel={`${exercise.name} thumbnail`}
        contentFit="cover"
        source={exercise.imageUrl}
        style={styles.exerciseImage}
        transition={180}
      />

      <View style={styles.exerciseCopy}>
        <Text style={styles.exerciseName}>{exercise.name}</Text>
        <Text style={styles.exerciseMeta}>
          {exercise.muscleGroup} - {exercise.equipment}
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

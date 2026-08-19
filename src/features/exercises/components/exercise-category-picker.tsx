import { Pressable, ScrollView, Text, View } from 'react-native';

import type { ExerciseEditorCategoryOption } from '../exercise-catalog.viewmodel';
import { styles } from './exercise-editor-form.styles';

export function ExerciseCategoryPicker({
  categories,
  onSelect,
  selectedId,
}: {
  categories: ExerciseEditorCategoryOption[];
  onSelect: (categoryId: string) => void;
  selectedId: string | null;
}) {
  return (
    <View style={styles.categoryGroup}>
      <Text style={styles.inputLabel}>Category</Text>
      <ScrollView
        horizontal
        contentContainerStyle={styles.categoryChips}
        showsHorizontalScrollIndicator={false}>
        {categories.map((category) => {
          const selected = category.id === selectedId;

          return (
            <Pressable
              accessibilityLabel={`Choose ${category.label}`}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              key={category.id}
              onPress={() => onSelect(category.id)}
              style={({ pressed }) => [
                styles.categoryChip,
                selected && styles.categoryChipSelected,
                pressed && styles.pressed,
              ]}>
              <Text style={[styles.categoryChipText, selected && styles.categoryChipTextSelected]}>
                {category.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import { DesignColors, SemanticColors } from '@/theme/tokens';
import { styles } from '../add-exercise-screen.styles';

export function ExercisePickerFilters({
  filters,
  onQueryChange,
  onSelectFilter,
  query,
  selectedFilter,
}: {
  filters: readonly string[];
  onQueryChange: (query: string) => void;
  onSelectFilter: (filter: string) => void;
  query: string;
  selectedFilter: string;
}) {
  return (
    <>
      <View style={styles.searchBox}>
        <AppIcon color={DesignColors.onSurfaceVariant} name="search" size={18} />
        <TextInput
          accessibilityLabel="Search exercises"
          onChangeText={onQueryChange}
          placeholder="Search exercises..."
          placeholderTextColor="rgba(229, 226, 225, 0.32)"
          selectionColor={SemanticColors.action}
          style={styles.searchInput}
          value={query}
        />
      </View>
      <ScrollView
        horizontal
        contentContainerStyle={styles.filterContent}
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}>
        {filters.map((filter) => {
          const selected = selectedFilter === filter;

          return (
            <Pressable
              accessibilityLabel={`Filter ${filter} exercises`}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              key={filter}
              onPress={() => onSelectFilter(filter)}
              style={({ pressed }) => [
                styles.filterChip,
                selected && styles.filterChipSelected,
                pressed && styles.pressed,
              ]}>
              <Text style={[styles.filterText, selected && styles.filterTextSelected]}>{filter}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </>
  );
}

export function ExercisePickerFooter({
  onAddSelection,
  selectedCount,
}: {
  onAddSelection: () => void;
  selectedCount: number;
}) {
  return (
    <>
      <Pressable
        accessibilityLabel="Create Custom Exercise"
        accessibilityRole="button"
        onPress={() => undefined}
        style={({ pressed }) => [styles.customButton, pressed && styles.pressed]}>
        <View style={styles.customIcon}>
          <AppIcon color={SemanticColors.actionSoft} name="add" size={16} />
        </View>
        <Text style={styles.customText}>Create Custom Exercise</Text>
      </Pressable>
      <View style={styles.footer}>
        <View style={styles.footerCopy}>
          <Text style={styles.selectedCount}>{selectedCount} Exercises Selected</Text>
          <Text style={styles.routineName}>Chest Day Routine</Text>
        </View>
        <Pressable
          accessibilityLabel="Add Selection"
          accessibilityRole="button"
          onPress={onAddSelection}
          style={({ pressed }) => [styles.addSelectionButton, pressed && styles.addSelectionPressed]}>
          <Text style={styles.addSelectionText}>Add Selection</Text>
        </Pressable>
      </View>
    </>
  );
}

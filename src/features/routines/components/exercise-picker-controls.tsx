import { useAppTheme } from '@/theme/app-theme-provider';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';

import { useStyles } from '../add-exercise-screen.styles';

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
  const { scheme } = useAppTheme();
  const styles = useStyles();
  const { DesignColors, SemanticColors } = useAppTheme();
  return (
    <>
      <View style={styles.searchBox}>
        <AppIcon color={DesignColors.onSurfaceVariant} name="search" size={18} />
        <TextInput keyboardAppearance={scheme}
          accessibilityLabel="Search exercises"
          onChangeText={onQueryChange}
          placeholder="Search exercises..."
          placeholderTextColor={SemanticColors.textMuted}
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

export function CustomExerciseButton() {
  const styles = useStyles();
  const { SemanticColors } = useAppTheme();
  return (
    <Pressable
      accessibilityHint="Opens the exercise form, then returns you to this list."
      accessibilityLabel="Create custom exercise"
      accessibilityRole="button"
      onPress={() =>
        router.push({ pathname: '/workouts/exercises/create', params: { returnTo: 'builder' } })
      }
      style={({ pressed }) => [styles.customButton, pressed && styles.pressed]}>
      <View style={styles.customIcon}>
        <AppIcon color={SemanticColors.actionSoft} name="add" size={16} />
      </View>
      <Text style={styles.customText}>Create custom exercise</Text>
    </Pressable>
  );
}

/** Pinned below the list so the selection can be confirmed from anywhere in the catalog. */
export function ExercisePickerFooter({
  onAddSelection,
  routineName,
  selectedCount,
}: {
  onAddSelection: () => void;
  routineName: string;
  selectedCount: number;
}) {
  const styles = useStyles();
  return (
    <View style={styles.footerDock}>
      <View style={styles.footer}>
        <View accessibilityLiveRegion="polite" style={styles.footerCopy}>
          <Text style={styles.selectedCount}>
            {selectedCount} {selectedCount === 1 ? 'exercise' : 'exercises'} selected
          </Text>
          <Text numberOfLines={1} style={styles.routineName}>{routineName}</Text>
        </View>
        <Pressable
          accessibilityLabel={selectedCount > 0 ? `Add ${selectedCount} selected exercises` : 'Select exercises to add'}
          accessibilityRole="button"
          accessibilityState={{ disabled: selectedCount === 0 }}
          disabled={selectedCount === 0}
          onPress={onAddSelection}
          style={({ pressed }) => [
            styles.addSelectionButton,
            selectedCount === 0 && styles.disabled,
            pressed && styles.addSelectionPressed,
          ]}>
          <Text style={styles.addSelectionText}>
            {selectedCount > 0
              ? `Add ${selectedCount} exercise${selectedCount === 1 ? '' : 's'}`
              : 'Select exercises'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

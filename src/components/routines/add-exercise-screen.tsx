import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import {
  ComponentTokens,
  DesignColors,
  Fonts,
  MaxContentWidth,
  Radius,
  SemanticColors,
  Space,
  Spacing,
  TypeScale,
  Typography,
} from '@/constants/theme';

type ExerciseCategory = 'Chest' | 'Back' | 'Legs' | 'Shoulders';
type ExerciseFilter = 'All' | ExerciseCategory;

type ExerciseOption = {
  category: ExerciseCategory;
  equipment: string;
  id: string;
  imageUrl: string;
  name: string;
};

const FILTERS: readonly ExerciseFilter[] = ['All', 'Chest', 'Back', 'Legs', 'Shoulders'];

const EXERCISES: readonly ExerciseOption[] = [
  {
    id: 'bench-press',
    name: 'Bench Press',
    category: 'Chest',
    equipment: 'Barbell',
    imageUrl:
      'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?auto=format&fit=crop&w=180&q=80',
  },
  {
    id: 'dumbbell-fly',
    name: 'Dumbbell Fly',
    category: 'Chest',
    equipment: 'Dumbbell',
    imageUrl:
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=180&q=80',
  },
  {
    id: 'lat-pulldown',
    name: 'Lat Pulldown',
    category: 'Back',
    equipment: 'Machine',
    imageUrl:
      'https://images.unsplash.com/photo-1596357395217-80de13130e92?auto=format&fit=crop&w=180&q=80',
  },
  {
    id: 'barbell-squat',
    name: 'Barbell Squat',
    category: 'Legs',
    equipment: 'Barbell',
    imageUrl:
      'https://images.unsplash.com/photo-1534368420009-621bfab424a8?auto=format&fit=crop&w=180&q=80',
  },
  {
    id: 'pull-up',
    name: 'Pull Up',
    category: 'Back',
    equipment: 'Bodyweight',
    imageUrl:
      'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=180&q=80',
  },
];

const INITIAL_SELECTED_IDS = ['bench-press', 'dumbbell-fly', 'lat-pulldown'];

export function AddExerciseScreen() {
  const [query, setQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<ExerciseFilter>('All');
  const [selectedIds, setSelectedIds] = useState(INITIAL_SELECTED_IDS);

  const filteredExercises = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return EXERCISES.filter((exercise) => {
      const matchesFilter = selectedFilter === 'All' || exercise.category === selectedFilter;
      const searchableText = `${exercise.name} ${exercise.category} ${exercise.equipment}`.toLowerCase();
      const matchesQuery = normalizedQuery.length === 0 || searchableText.includes(normalizedQuery);

      return matchesFilter && matchesQuery;
    });
  }, [query, selectedFilter]);

  const toggleExercise = (id: string) => {
    setSelectedIds((items) =>
      items.includes(id) ? items.filter((item) => item !== id) : [...items, id]
    );
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      style={styles.screen}>
      <View style={styles.content}>
        <View style={styles.searchBox}>
          <AppIcon color={DesignColors.onSurfaceVariant} name="search" size={18} />
          <TextInput
            accessibilityLabel="Search exercises"
            onChangeText={setQuery}
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
          {FILTERS.map((filter) => {
            const selected = selectedFilter === filter;

            return (
              <Pressable
                accessibilityLabel={`Filter ${filter} exercises`}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                key={filter}
                onPress={() => setSelectedFilter(filter)}
                style={({ pressed }) => [
                  styles.filterChip,
                  selected && styles.filterChipSelected,
                  pressed && styles.pressed,
                ]}>
                <Text style={[styles.filterText, selected && styles.filterTextSelected]}>
                  {filter}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.exerciseList}>
          {filteredExercises.length > 0 ? (
            filteredExercises.map((exercise) => (
              <ExerciseRow
                exercise={exercise}
                key={exercise.id}
                onToggle={() => toggleExercise(exercise.id)}
                selected={selectedIds.includes(exercise.id)}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No exercises found</Text>
              <Text style={styles.emptyText}>Try another search or category.</Text>
            </View>
          )}
        </View>

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
            <Text style={styles.selectedCount}>{selectedIds.length} Exercises Selected</Text>
            <Text style={styles.routineName}>Chest Day Routine</Text>
          </View>

          <Pressable
            accessibilityLabel="Add Selection"
            accessibilityRole="button"
            onPress={() => router.back()}
            style={({ pressed }) => [styles.addSelectionButton, pressed && styles.addSelectionPressed]}>
            <Text style={styles.addSelectionText}>Add Selection</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

function ExerciseRow({
  exercise,
  onToggle,
  selected,
}: {
  exercise: ExerciseOption;
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
          {exercise.category} - {exercise.equipment}
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

const styles = StyleSheet.create({
  screen: {
    backgroundColor: SemanticColors.canvas,
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    backgroundColor: SemanticColors.canvas,
    flexGrow: 1,
    paddingBottom: 116,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
  },
  content: {
    gap: Spacing.three,
    maxWidth: Math.min(MaxContentWidth, 430),
    width: '100%',
  },
  searchBox: {
    alignItems: 'center',
    backgroundColor: ComponentTokens.input.background,
    borderColor: ComponentTokens.input.borderColor,
    borderCurve: 'continuous',
    borderRadius: ComponentTokens.input.radius,
    borderWidth: ComponentTokens.input.borderWidth,
    flexDirection: 'row',
    gap: Space.sm,
    minHeight: 52,
    paddingHorizontal: Spacing.three,
  },
  searchInput: {
    ...Typography.sm,
    color: SemanticColors.textPrimary,
    flex: 1,
    fontFamily: Fonts.bodyMedium,
    minHeight: 48,
    padding: 0,
  },
  filterScroll: {
    marginHorizontal: -Spacing.three,
  },
  filterContent: {
    gap: Space.sm,
    paddingHorizontal: Spacing.three,
  },
  filterChip: {
    alignItems: 'center',
    backgroundColor: SemanticColors.card,
    borderColor: SemanticColors.border,
    borderRadius: Radius.full,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 34,
    minWidth: 62,
    paddingHorizontal: Spacing.three,
  },
  filterChipSelected: {
    backgroundColor: SemanticColors.action,
    borderColor: SemanticColors.action,
  },
  filterText: {
    ...Typography.xs,
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.bodyBold,
  },
  filterTextSelected: {
    color: DesignColors.onPrimaryContainer,
  },
  exerciseList: {
    gap: Spacing.two,
  },
  exerciseRow: {
    alignItems: 'center',
    backgroundColor: ComponentTokens.card.background,
    borderColor: ComponentTokens.card.borderColor,
    borderCurve: 'continuous',
    borderRadius: ComponentTokens.card.radius,
    borderWidth: ComponentTokens.card.borderWidth,
    flexDirection: 'row',
    gap: Spacing.three,
    minHeight: 88,
    padding: Spacing.two,
  },
  exerciseRowSelected: {
    borderColor: SemanticColors.active,
  },
  exerciseImage: {
    backgroundColor: DesignColors.surfaceContainerLowest,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    height: 58,
    width: 58,
  },
  exerciseCopy: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  exerciseName: {
    ...Typography.sm,
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.bodyBold,
  },
  exerciseMeta: {
    ...Typography.xs,
    color: SemanticColors.actionSoft,
    fontFamily: Fonts.bodyBold,
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: DesignColors.surfaceContainerHigh,
    borderRadius: Radius.full,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  addButtonSelected: {
    backgroundColor: SemanticColors.action,
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: ComponentTokens.card.background,
    borderColor: ComponentTokens.card.borderColor,
    borderCurve: 'continuous',
    borderRadius: ComponentTokens.card.radius,
    borderWidth: ComponentTokens.card.borderWidth,
    gap: Space.xs,
    padding: Spacing.four,
  },
  emptyTitle: {
    ...TypeScale.headlineSm,
    color: SemanticColors.textPrimary,
    textAlign: 'center',
  },
  emptyText: {
    ...Typography.sm,
    color: SemanticColors.textSecondary,
    fontFamily: Fonts.bodyMedium,
    textAlign: 'center',
  },
  customButton: {
    alignItems: 'center',
    backgroundColor: ComponentTokens.card.background,
    borderColor: ComponentTokens.card.borderColor,
    borderCurve: 'continuous',
    borderRadius: ComponentTokens.card.radius,
    borderWidth: ComponentTokens.card.borderWidth,
    flexDirection: 'row',
    gap: Space.sm,
    minHeight: 62,
    paddingHorizontal: Spacing.three,
  },
  customIcon: {
    alignItems: 'center',
    borderColor: SemanticColors.actionSoft,
    borderRadius: Radius.full,
    borderWidth: 2,
    height: 26,
    justifyContent: 'center',
    width: 26,
  },
  customText: {
    ...Typography.sm,
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.bodyBold,
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.three,
    justifyContent: 'space-between',
    paddingTop: Space.xs,
  },
  footerCopy: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  selectedCount: {
    ...Typography.xs,
    color: SemanticColors.textSecondary,
    fontFamily: Fonts.bodyBold,
  },
  routineName: {
    ...Typography.sm,
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.heading,
  },
  addSelectionButton: {
    alignItems: 'center',
    backgroundColor: ComponentTokens.button.primaryBackground,
    borderCurve: 'continuous',
    borderRadius: Radius.full,
    boxShadow: '0 14px 28px rgba(255, 95, 31, 0.24)',
    justifyContent: 'center',
    minHeight: 62,
    minWidth: 174,
    paddingHorizontal: Spacing.four,
  },
  addSelectionPressed: {
    backgroundColor: DesignColors.inversePrimary,
    transform: [{ scale: 0.99 }],
  },
  addSelectionText: {
    ...Typography.lg,
    color: DesignColors.onPrimaryContainer,
    fontFamily: Fonts.bodyBold,
  },
  pressed: {
    opacity: 0.72,
  },
});

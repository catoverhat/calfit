import { router } from 'expo-router';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { useMemo, useState } from 'react';

import { ThemedText } from '@/components/ui/themed-text';
import { SemanticColors } from '@/theme/tokens';
import { styles } from './add-exercise-screen.styles';
import { ExercisePickerFilters, ExercisePickerFooter } from './components/exercise-picker-controls';
import { ExercisePickerRow } from './components/exercise-picker-row';
import { useRoutineDraft } from './routine-draft-context';
import { useRoutineExercisePicker } from './use-routine-exercise-picker';

export function AddExerciseScreen() {
  const { draft, setSelectedExercises } = useRoutineDraft();
  const { categories, error, exercises, isLoading, reload } = useRoutineExercisePicker();
  const [query, setQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All Categories');
  const [selectedIds, setSelectedIds] = useState(() => draft?.exercises.map((exercise) => exercise.exerciseId) ?? []);

  const filteredExercises = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return exercises.filter((exercise) => {
      const category = exercise.category_name ?? 'Uncategorized';
      const matchesFilter = selectedFilter === 'All Categories' || category === selectedFilter;
      const searchableText = `${exercise.name} ${exercise.description ?? ''} ${category} ${exercise.category_muscle_group ?? ''}`.toLowerCase();
      return matchesFilter && (!normalizedQuery || searchableText.includes(normalizedQuery));
    });
  }, [exercises, query, selectedFilter]);

  const addSelection = () => {
    setSelectedExercises(exercises.filter((exercise) => selectedIds.includes(exercise.exercise_id)));
    router.back();
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} contentInsetAdjustmentBehavior="automatic" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} style={styles.screen}>
      <View style={styles.content}>
        <View style={styles.heading}><ThemedText style={styles.eyebrow}>Exercise catalog</ThemedText><ThemedText style={styles.title}>Build the workout</ThemedText><ThemedText style={styles.subtitle}>{draft?.name.trim() || 'New workout'}</ThemedText></View>
        <ExercisePickerFilters filters={categories} onQueryChange={setQuery} onSelectFilter={setSelectedFilter} query={query} selectedFilter={selectedFilter} />
        <View style={styles.exerciseList}>
          {isLoading ? <View style={styles.stateCard}><ActivityIndicator color={SemanticColors.action} size="large" /><ThemedText style={styles.emptyText}>Loading exercises…</ThemedText></View> : error ? <View style={styles.stateCard}><ThemedText style={styles.emptyTitle}>Catalog unavailable</ThemedText><ThemedText style={styles.emptyText}>{error}</ThemedText><ThemedText accessibilityRole="button" onPress={reload} style={styles.retryText}>Try again</ThemedText></View> : filteredExercises.length ? filteredExercises.map((exercise) => <ExercisePickerRow exercise={exercise} key={exercise.exercise_id} onToggle={() => setSelectedIds((items) => items.includes(exercise.exercise_id) ? items.filter((id) => id !== exercise.exercise_id) : [...items, exercise.exercise_id])} selected={selectedIds.includes(exercise.exercise_id)} />) : <View style={styles.stateCard}><ThemedText style={styles.emptyTitle}>No exercises found</ThemedText><ThemedText style={styles.emptyText}>Try another search or category.</ThemedText></View>}
        </View>
        <ExercisePickerFooter onAddSelection={addSelection} routineName={draft?.name.trim() || 'New workout'} selectedCount={selectedIds.length} />
      </View>
    </ScrollView>
  );
}

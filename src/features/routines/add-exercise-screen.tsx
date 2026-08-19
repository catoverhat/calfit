import { styles } from './add-exercise-screen.styles';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { EXERCISE_CATALOG, type ExerciseCatalogItem } from '@/db/seed-data/exercise-catalog';
import {
  ExercisePickerFilters,
  ExercisePickerFooter,
} from './components/exercise-picker-controls';
import { ExercisePickerRow } from './components/exercise-picker-row';

type ExerciseFilter = 'All' | ExerciseCatalogItem['muscleGroup'];

const FILTERS: readonly ExerciseFilter[] = ['All', 'Chest', 'Back', 'Legs', 'Shoulders'];
const PICKER_EXERCISES = EXERCISE_CATALOG.filter(({ id }) =>
  ['bench-press', 'dumbbell-fly', 'lat-pulldown', 'squat', 'pull-ups'].includes(id)
);

const INITIAL_SELECTED_IDS = ['bench-press', 'dumbbell-fly', 'lat-pulldown'];

export function AddExerciseScreen() {
  const [query, setQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<ExerciseFilter>('All');
  const [selectedIds, setSelectedIds] = useState(INITIAL_SELECTED_IDS);

  const filteredExercises = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return PICKER_EXERCISES.filter((exercise) => {
      const matchesFilter = selectedFilter === 'All' || exercise.muscleGroup === selectedFilter;
      const searchableText =
        `${exercise.name} ${exercise.muscleGroup} ${exercise.equipment}`.toLowerCase();
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
        <ExercisePickerFilters
          filters={FILTERS}
          onQueryChange={setQuery}
          onSelectFilter={(filter) => setSelectedFilter(filter as ExerciseFilter)}
          query={query}
          selectedFilter={selectedFilter}
        />

        <View style={styles.exerciseList}>
          {filteredExercises.length > 0 ? (
            filteredExercises.map((exercise) => (
              <ExercisePickerRow
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

        <ExercisePickerFooter onAddSelection={() => router.back()} selectedCount={selectedIds.length} />
      </View>
    </ScrollView>
  );
}

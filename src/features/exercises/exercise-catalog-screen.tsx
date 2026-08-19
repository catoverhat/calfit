import { styles } from './exercise-catalog-screen.styles';
import { router, type Href } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Header } from '@/components/layout/header';
import { TabScreen } from '@/components/layout/tab-screen';
import { AppIcon } from '@/components/ui/app-icon';
import { SemanticColors } from '@/theme/tokens';
import {
  filterExerciseCatalogItems,
} from '@/features/exercises/exercise-catalog.viewmodel';
import { useExerciseCatalog } from '@/features/exercises/use-exercise-catalog';
import {
  ExerciseCatalogCard,
  ExerciseCatalogToolbar,
  StatusCard,
} from './components/exercise-catalog-sections';

const CREATE_EXERCISE_HREF = '/(tabs)/exercises/create' as Href;

export function ExerciseCatalogScreen() {
  const { data, error, isLoading } = useExerciseCatalog();
  const [query, setQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All Categories');
  const activeFilter = data.filters.includes(selectedFilter) ? selectedFilter : 'All Categories';

  const exercises = useMemo(() => {
    return filterExerciseCatalogItems(data.items, activeFilter, query);
  }, [activeFilter, data.items, query]);

  return (
    <TabScreen contentContainerStyle={styles.scrollContent} style={styles.screen}>
      <View style={styles.content}>
        <Header
          actionAccessibilityLabel="Sync exercise catalog"
          actionIcon="cloud"
          actionIconColor={SemanticColors.actionSoft}
          avatarUrl={data.avatarUrl}
          profileName={data.profileName}
        />

        <ExerciseCatalogToolbar
          filters={data.filters}
          onCreate={() => router.push(CREATE_EXERCISE_HREF)}
          onQueryChange={setQuery}
          onSelectFilter={setSelectedFilter}
          query={query}
          selectedFilter={activeFilter}
        />

        <View style={styles.cardList}>
          {error ? (
            <StatusCard body={error} title="Local catalog unavailable" />
          ) : isLoading ? (
            <StatusCard body="Preparing your local exercise catalog." title="Loading exercises" />
          ) : exercises.length > 0 ? (
            exercises.map((exercise) => <ExerciseCatalogCard exercise={exercise} key={exercise.id} />)
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No exercises found</Text>
              <Text style={styles.emptyText}>Try another search or category.</Text>
            </View>
          )}

          <Pressable
            accessibilityLabel="Add Custom Exercise"
            accessibilityRole="button"
            onPress={() => router.push(CREATE_EXERCISE_HREF)}
            style={({ pressed }) => [styles.addCustomCard, pressed && styles.pressed]}>
            <View style={styles.addCustomIcon}>
              <AppIcon color={SemanticColors.textPrimary} name="add" size={18} />
            </View>
            <Text style={styles.addCustomText}>Add Custom Exercise</Text>
          </Pressable>
        </View>
      </View>
    </TabScreen>
  );
}

import { useAppTheme } from '@/theme/app-theme-provider';
import { useStyles } from './exercise-catalog-screen.styles';
import { Link } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { Header } from '@/components/layout/header';
import { TabScreen } from '@/components/layout/tab-screen';
import { AppIcon } from '@/components/ui/app-icon';

import { filterExerciseCatalogItems } from '@/features/exercises/exercise-catalog.viewmodel';
import { useExerciseCatalog } from '@/features/exercises/use-exercise-catalog';
import {
  ExerciseCatalogCard,
  ExerciseCatalogToolbar,
  StatusCard,
} from './components/exercise-catalog-sections';

export function ExerciseCatalogScreen({ nested = false }: { nested?: boolean }) {
  const styles = useStyles();
  const { SemanticColors } = useAppTheme();
  const { data, error, isLoading } = useExerciseCatalog();
  const [query, setQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All Categories');
  const activeFilter = data.filters.includes(selectedFilter) ? selectedFilter : 'All Categories';

  const exercises = useMemo(() => {
    return filterExerciseCatalogItems(data.items, activeFilter, query);
  }, [activeFilter, data.items, query]);

  const content = (
      <View style={styles.content}>
        {!nested ? <Header
          avatarUrl={data.avatarUrl}
          profileName={data.profileName}
          showAction={false}
        /> : null}

        <ExerciseCatalogToolbar
          filters={data.filters}
          onQueryChange={setQuery}
          onSelectFilter={setSelectedFilter}
          query={query}
          selectedFilter={activeFilter}
        />

        <View style={styles.cardList}>
          <Link href="/workouts/exercises/create" push asChild>
            <Pressable accessibilityLabel="Add custom exercise" accessibilityRole="button">
              {({ pressed }) => (
                <View style={[styles.addCustomCard, pressed && styles.pressed]}>
                  <View style={styles.addCustomIcon}>
                    <AppIcon color={SemanticColors.textPrimary} name="add" size={18} />
                  </View>
                  <Text style={styles.addCustomText}>Add custom exercise</Text>
                </View>
              )}
            </Pressable>
          </Link>

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
        </View>
      </View>
  );

  if (nested) {
    return (
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[styles.scrollContent, styles.nestedScrollContent]}
        style={styles.screen}>
        {content}
      </ScrollView>
    );
  }

  return (
    <TabScreen contentContainerStyle={styles.scrollContent} style={styles.screen}>
      {content}
    </TabScreen>
  );
}

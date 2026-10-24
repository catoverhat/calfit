import { Image } from 'expo-image';
import { Link, type Href } from 'expo-router';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import { DesignColors, SemanticColors } from '@/theme/tokens';
import type { ExerciseCatalogViewItem } from '../exercise-catalog.viewmodel';

import { styles } from '../exercise-catalog-screen.styles';

export function ExerciseCatalogToolbar({
  filters,
  onQueryChange,
  onSelectFilter,
  query,
  selectedFilter,
}: {
  filters: string[];
  onQueryChange: (query: string) => void;
  onSelectFilter: (filter: string) => void;
  query: string;
  selectedFilter: string;
}) {
  return (
    <>
      <View style={styles.heroRow}>
        <View style={styles.heroCopy}>
          <Text style={styles.title}>Catalog</Text>
          <Text style={styles.subtitle}>Browse or create your next move</Text>
        </View>
        <Link href="/workouts/exercises/create" push asChild>
          <Pressable accessibilityLabel="Create Exercise" accessibilityRole="button">
            {({ pressed }) => (
              <View style={[styles.createButton, pressed && styles.pressed]}>
                <AppIcon color={DesignColors.onPrimaryContainer} name="add" size={14} />
                <Text style={styles.createButtonText}>Create</Text>
              </View>
            )}
          </Pressable>
        </Link>
      </View>
      <View style={styles.searchBox}>
        <AppIcon color={DesignColors.onSurfaceVariant} name="search" size={16} />
        <TextInput
          accessibilityLabel="Search exercise catalog"
          onChangeText={onQueryChange}
          placeholder="Search exercise..."
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
              accessibilityLabel={`Filter ${filter}`}
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

export function ExerciseCatalogCard({ exercise }: { exercise: ExerciseCatalogViewItem }) {
  return (
    <View style={styles.exerciseCard}>
      {exercise.imageUrl ? (
        <Image
          accessibilityLabel={`${exercise.name} exercise image`}
          contentFit="cover"
          source={exercise.imageUrl}
          style={styles.exerciseImage}
          transition={220}
        />
      ) : (
        <View style={[styles.exerciseImage, styles.exerciseImageFallback]}>
          <AppIcon color={SemanticColors.actionSoft} name="exercises" size={28} />
        </View>
      )}

      <View style={styles.cardBody}>
        <View style={styles.cardTitleRow}>
          <View style={styles.exerciseCopy}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <View style={styles.tagRow}>
              {exercise.tags.slice(0, 2).map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>

          <Link
            href={{
              pathname: '/workouts/exercises/[id]/edit',
              params: { id: exercise.id },
            } as unknown as Href}
            push
            asChild>
            <Pressable
              accessibilityLabel={`Edit ${exercise.name}`}
              accessibilityRole="button"
              hitSlop={8}>
              {({ pressed }) => (
                <View style={[styles.menuButton, pressed && styles.pressed]}>
                  <AppIcon color={SemanticColors.textSecondary} name="edit" size={16} />
                </View>
              )}
            </Pressable>
          </Link>
        </View>
      </View>
    </View>
  );
}

export function StatusCard({ body, title }: { body: string; title: string }) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text selectable style={styles.emptyText}>
        {body}
      </Text>
    </View>
  );
}

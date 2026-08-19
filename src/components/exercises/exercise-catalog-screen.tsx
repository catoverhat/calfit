import { Image } from 'expo-image';
import { router, type Href } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Header } from '@/components/header';
import { TabScreen } from '@/components/tab-screen';
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
import {
  filterExerciseCatalogItems,
  type ExerciseCatalogViewItem,
} from '@/hooks/exercise-catalog-view-model';
import { useExerciseCatalog } from '@/hooks/use-exercise-catalog';

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

        <View style={styles.heroRow}>
          <View style={styles.heroCopy}>
            <Text style={styles.title}>Catalog</Text>
            <Text style={styles.subtitle}>Browse or create your next move</Text>
          </View>

          <Pressable
            accessibilityLabel="Create Exercise"
            accessibilityRole="button"
            onPress={() => router.push(CREATE_EXERCISE_HREF)}
            style={({ pressed }) => [styles.createButton, pressed && styles.pressed]}>
            <AppIcon color={DesignColors.onPrimaryContainer} name="add" size={14} />
            <Text style={styles.createButtonText}>Create Exercise</Text>
          </Pressable>
        </View>

        <View style={styles.searchBox}>
          <AppIcon color={DesignColors.onSurfaceVariant} name="search" size={16} />
          <TextInput
            accessibilityLabel="Search exercise catalog"
            onChangeText={setQuery}
            placeholder="Search exercise..."
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
          {data.filters.map((filter) => {
            const selected = activeFilter === filter;

            return (
              <Pressable
                accessibilityLabel={`Filter ${filter}`}
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

function ExerciseCatalogCard({ exercise }: { exercise: ExerciseCatalogViewItem }) {
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

          <Pressable
            accessibilityLabel={`Edit ${exercise.name}`}
            accessibilityRole="button"
            hitSlop={8}
            onPress={() =>
              router.push({
                pathname: '/(tabs)/exercises/[id]/edit',
                params: { id: exercise.id },
              } as unknown as Href)
            }
            style={({ pressed }) => [styles.menuButton, pressed && styles.pressed]}>
            <AppIcon color={SemanticColors.textSecondary} name="menu" size={16} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function StatusCard({ body, title }: { body: string; title: string }) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text selectable style={styles.emptyText}>
        {body}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: SemanticColors.canvas,
  },
  scrollContent: {
    alignItems: 'center',
    backgroundColor: SemanticColors.canvas,
    paddingBottom: 116,
    paddingHorizontal: Spacing.three,
  },
  content: {
    gap: Spacing.three,
    maxWidth: Math.min(MaxContentWidth, 430),
    paddingTop: Spacing.two,
    width: '100%',
  },
  heroRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.three,
    justifyContent: 'space-between',
  },
  heroCopy: {
    flex: 1,
    gap: Space.xs,
    minWidth: 0,
  },
  title: {
    ...TypeScale.headlineMd,
    color: SemanticColors.textPrimary,
  },
  subtitle: {
    ...Typography.xs,
    color: SemanticColors.textSecondary,
    fontFamily: Fonts.bodyMedium,
  },
  createButton: {
    alignItems: 'center',
    backgroundColor: ComponentTokens.button.primaryBackground,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    flexDirection: 'row',
    gap: Space.xs,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: Spacing.three,
    width: 134,
  },
  createButtonText: {
    color: DesignColors.onPrimaryContainer,
    flexShrink: 1,
    fontFamily: Fonts.bodyBold,
    fontSize: 10,
    lineHeight: 12,
    textAlign: 'center',
    textTransform: 'uppercase',
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
    minHeight: 44,
    paddingHorizontal: Spacing.three,
  },
  searchInput: {
    ...Typography.xs,
    color: SemanticColors.textPrimary,
    flex: 1,
    fontFamily: Fonts.bodyMedium,
    minHeight: 42,
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
    minHeight: 30,
    paddingHorizontal: Spacing.three,
  },
  filterChipSelected: {
    backgroundColor: SemanticColors.action,
    borderColor: SemanticColors.action,
  },
  filterText: {
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.bodyBold,
    fontSize: 10,
    lineHeight: 12,
  },
  filterTextSelected: {
    color: DesignColors.onPrimaryContainer,
  },
  cardList: {
    gap: Spacing.three,
  },
  exerciseCard: {
    backgroundColor: ComponentTokens.card.background,
    borderColor: ComponentTokens.card.borderColor,
    borderCurve: 'continuous',
    borderRadius: ComponentTokens.card.radius,
    borderWidth: ComponentTokens.card.borderWidth,
    overflow: 'hidden',
  },
  exerciseImage: {
    aspectRatio: 1.9,
    backgroundColor: DesignColors.surfaceContainerLowest,
    width: '100%',
  },
  exerciseImageFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    padding: Spacing.three,
  },
  cardTitleRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: Spacing.two,
    justifyContent: 'space-between',
  },
  exerciseCopy: {
    flex: 1,
    gap: Space.xs,
    minWidth: 0,
  },
  exerciseName: {
    ...Typography.sm,
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.bodyBold,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Space.xs,
  },
  tag: {
    backgroundColor: 'rgba(255, 95, 31, 0.14)',
    borderRadius: Radius.sm,
    paddingHorizontal: Space.xs,
    paddingVertical: 2,
  },
  tagText: {
    color: SemanticColors.actionSoft,
    fontFamily: Fonts.bodyBold,
    fontSize: 8,
    lineHeight: 10,
  },
  menuButton: {
    alignItems: 'center',
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  addCustomCard: {
    alignItems: 'center',
    backgroundColor: ComponentTokens.card.background,
    borderColor: ComponentTokens.card.borderColor,
    borderCurve: 'continuous',
    borderRadius: ComponentTokens.card.radius,
    borderStyle: 'dashed',
    borderWidth: ComponentTokens.card.borderWidth,
    gap: Spacing.two,
    justifyContent: 'center',
    minHeight: 122,
    padding: Spacing.three,
  },
  addCustomIcon: {
    alignItems: 'center',
    backgroundColor: DesignColors.surfaceContainerHigh,
    borderRadius: Radius.full,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  addCustomText: {
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    lineHeight: 14,
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
  pressed: {
    opacity: 0.72,
  },
});

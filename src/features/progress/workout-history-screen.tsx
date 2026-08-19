import { styles } from './workout-history-screen.styles';
import { router, type Href } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { Header } from '@/components/layout/header';
import { TabScreen } from '@/components/layout/tab-screen';
import { MOCK_USER } from '@/fixtures/mock-data';
import { SemanticColors } from '@/theme/tokens';
import {
  WorkoutHistoryCard,
  type HistoryWorkout,
} from './components/workout-history-card';

type HistoryFilter = 'all' | 'strength' | 'cardio' | 'prs';

const filters = [
  { id: 'all', label: 'All Workouts' },
  { id: 'strength', label: 'Strength' },
  { id: 'cardio', label: 'Cardio' },
  { id: 'prs', label: 'PRs' },
] satisfies { id: HistoryFilter; label: string }[];

const historyWorkouts = [
  {
    category: 'strength',
    completion: 100,
    dateGroup: 'recent',
    duration: '72m',
    exercises: '6',
    hasPr: true,
    id: 'push-day-oct-12',
    status: 'completed',
    title: 'Push Day - Oct 12',
    volume: '12.4k',
  },
  {
    category: 'strength',
    completion: 100,
    dateGroup: 'recent',
    duration: '85m',
    exercises: '8',
    id: 'leg-day-oct-10',
    status: 'completed',
    title: 'Leg Day - Oct 10',
    volume: '18.2k',
  },
  {
    category: 'strength',
    completion: 100,
    dateGroup: 'recent',
    duration: '58m',
    exercises: '5',
    id: 'full-body-oct-08',
    status: 'completed',
    title: 'Full Body - Oct 08',
    volume: '9.5k',
  },
  {
    category: 'cardio',
    completion: 58,
    dateGroup: 'september',
    duration: '15m',
    exercises: '3',
    id: 'quick-core-sep-29',
    status: 'partial',
    title: 'Quick Core - Sep 29',
    volume: '--',
  },
] satisfies HistoryWorkout[];

export function WorkoutHistoryScreen() {
  const [selectedFilter, setSelectedFilter] = useState<HistoryFilter>('all');

  const filteredWorkouts = useMemo(() => {
    if (selectedFilter === 'all') {
      return historyWorkouts;
    }

    if (selectedFilter === 'prs') {
      return historyWorkouts.filter((workout) => workout.hasPr);
    }

    return historyWorkouts.filter((workout) => workout.category === selectedFilter);
  }, [selectedFilter]);

  const recentWorkouts = filteredWorkouts.filter((workout) => workout.dateGroup === 'recent');
  const septemberWorkouts = filteredWorkouts.filter((workout) => workout.dateGroup === 'september');

  return (
    <TabScreen contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Header
          actionAccessibilityLabel="Sync workout history"
          actionIcon="cloud"
          actionIconColor={SemanticColors.actionSoft}
          avatarUrl={MOCK_USER.avatarUrl}
          onNotificationsPress={() => router.push('/progress/sync' as Href)}
          profileName={MOCK_USER.name}
        />

        <View style={styles.headingBlock}>
          <Text style={styles.title}>Workout History</Text>
          <Text style={styles.subtitle}>Review your recent performance and progress.</Text>
        </View>

        <ScrollView
          horizontal
          contentContainerStyle={styles.filterContent}
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}>
          {filters.map((filter) => {
            const selected = filter.id === selectedFilter;

            return (
              <Pressable
                accessibilityLabel={`Filter by ${filter.label}`}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                key={filter.id}
                onPress={() => setSelectedFilter(filter.id)}
                style={({ pressed }) => [
                  styles.filterChip,
                  selected && styles.filterChipSelected,
                  pressed && styles.pressed,
                ]}>
                <Text style={[styles.filterText, selected && styles.filterTextSelected]}>
                  {filter.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.list}>
          {recentWorkouts.map((workout) => (
            <WorkoutHistoryCard key={workout.id} workout={workout} />
          ))}

          {septemberWorkouts.length > 0 ? (
            <>
              <View style={styles.monthSeparator}>
                <Text style={styles.monthLabel}>September 2023</Text>
                <View style={styles.monthLine} />
              </View>
              {septemberWorkouts.map((workout) => (
                <WorkoutHistoryCard key={workout.id} workout={workout} />
              ))}
            </>
          ) : null}
        </View>
      </View>
    </TabScreen>
  );
}

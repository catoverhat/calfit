import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { WorkoutHistoryCard } from './components/workout-history-card';
import { HISTORY_FILTERS, createHistoryGroups, type ProgressHistoryFilter } from './progress.viewmodel';
import { useStyles } from './workout-history-screen.styles';
import { useWorkoutHistory } from './use-workout-history';

export function WorkoutHistoryScreen() {
  const styles = useStyles();
  const { error, history, isLoading, weightUnit } = useWorkoutHistory();
  const [selectedFilter, setSelectedFilter] = useState<ProgressHistoryFilter>('all');
  const groups = useMemo(() => createHistoryGroups(history, selectedFilter, weightUnit), [history, selectedFilter, weightUnit]);

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.subtitle}>Review every saved workout. Tap one in progress to resume it.</Text>
        <ScrollView accessibilityLabel="Workout history filters" horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContent}>
          {HISTORY_FILTERS.map((filter) => {
            const selected = filter.id === selectedFilter;
            return (
              <Pressable accessibilityLabel={`Filter by ${filter.label}`} accessibilityRole="button" accessibilityState={{ selected }} key={filter.id} onPress={() => setSelectedFilter(filter.id)} style={({ pressed }) => [styles.filterChip, selected && styles.filterChipSelected, pressed && styles.pressed]}>
                <Text style={[styles.filterText, selected && styles.filterTextSelected]}>{filter.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
        {error ? <StatusCard body={error} title="History unavailable" /> : null}
        {isLoading ? <StatusCard body="Loading locally saved workouts." title="Loading history" /> : null}
        {!isLoading && !error && groups.length === 0 ? <StatusCard body="No workouts match this filter." title="No workout history" /> : null}
        <View style={styles.list}>
          {groups.map((group) => (
            <View key={group.label} style={styles.list}>
              <View style={styles.monthSeparator}><Text style={styles.monthLabel}>{group.label}</Text><View style={styles.monthLine} /></View>
              {group.workouts.map((workout) => <WorkoutHistoryCard key={workout.id} workout={workout} />)}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

function StatusCard({ body, title }: { body: string; title: string }) {
  const styles = useStyles();
  return <View style={styles.statusCard}><Text style={styles.statusTitle}>{title}</Text><Text style={styles.statusBody}>{body}</Text></View>;
}

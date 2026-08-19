import { styles } from './routine-list-screen.styles';
import { Link } from 'expo-router';
import { Pressable, View } from 'react-native';

import { Header } from '@/components/layout/header';
import { TabScreen } from '@/components/layout/tab-screen';
import { ThemedText } from '@/components/ui/themed-text';
import { AppIcon } from '@/components/ui/app-icon';
import { MOCK_USER } from '@/fixtures/mock-data';
import { DesignColors, SemanticColors } from '@/theme/tokens';
import { RoutineCard, type RoutineSummary } from './components/routine-card';

const ROUTINES: readonly RoutineSummary[] = [
  {
    id: 'push-day',
    title: 'Push Day',
    description: 'Focus on chest, shoulders, and triceps with heavy compound movements.',
    icon: 'strength',
    statLabel: 'Exercises',
    statValue: 8,
    schedule: ['M', 'W', 'F'],
    lastCompleted: 'Last: Oct 24, 2023',
  },
  {
    id: 'leg-day',
    title: 'Leg Day',
    description: 'High volume hypertrophy for quads, hamstrings, and calves.',
    icon: 'briefcase',
    statLabel: 'Exercises',
    statValue: 6,
    schedule: ['T'],
    lastCompleted: 'Last: Oct 21, 2023',
  },
  {
    id: 'full-body-power',
    title: 'Full Body',
    description: 'Efficient full body conditioning for busy days.',
    icon: 'body',
    statLabel: 'Exercises',
    statValue: 12,
    schedule: ['F'],
    lastCompleted: 'Last: Never',
  },
  {
    id: 'running-day',
    title: 'Running Day',
    description: '5km tempo run or interval training for cardiovascular endurance.',
    icon: 'running',
    statLabel: 'Intervals',
    statValue: 1,
    schedule: ['W', 'S'],
    lastCompleted: 'Last: Oct 25, 2023',
  },
] as const;

export function RoutineListScreen() {
  return (
    <TabScreen contentContainerStyle={styles.scrollContent} style={styles.screen}>
      <View style={styles.content}>
        <Header
          actionAccessibilityLabel="Sync routines"
          actionIcon="cloud"
          actionIconColor={SemanticColors.actionSoft}
          avatarUrl={MOCK_USER.avatarUrl}
          profileName={MOCK_USER.name}
        />

        <View style={styles.heading}>
          <ThemedText style={styles.eyebrow}>Your Program</ThemedText>
          <ThemedText style={styles.title}>Workout Routines</ThemedText>
        </View>

        <View style={styles.list}>
          {ROUTINES.map((routine) => (
            <RoutineCard key={routine.id} routine={routine} />
          ))}
        </View>

        <View style={styles.fabRow}>
          <Link href="/routines/create" asChild>
            <Pressable
              accessibilityLabel="Create Routine"
              accessibilityRole="button"
              style={({ pressed }) => [styles.fab, pressed && styles.pressed]}>
              <AppIcon color={DesignColors.onPrimaryContainer} name="add" size={22} />
            </Pressable>
          </Link>
        </View>
      </View>
    </TabScreen>
  );
}

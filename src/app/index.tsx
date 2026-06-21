import { StyleSheet, View } from 'react-native';

import {
  AchievementsCard,
  type Achievement,
  RecommendedCard,
  StatCard,
  WorkoutCard,
} from '@/components/dashboard';
import { Header } from '@/components/header';
import { TabScreen } from '@/components/tab-screen';
import { ThemedText } from '@/components/themed-text';
import { MOCK_USER, MOCK_WORKOUTS } from '@/constants/mock-data';
import {
  Fonts,
  MaxContentWidth,
  Palette,
  Spacing,
  Typography,
} from '@/constants/theme';

const mockDashboard = {
  user: MOCK_USER,
  workout: MOCK_WORKOUTS[0],
  stats: {
    streak: { value: '5', suffix: 'days', progress: 0.72 },
    calories: { value: '1,250', suffix: 'kcal', progress: 0.84 },
  },
  achievements: [
    {
      id: 'streak',
      icon: 'trophy',
      title: '7-Day Streak',
      detail: 'Unlocked today',
      tone: 'primary',
    },
    {
      id: 'squat',
      icon: 'strength',
      title: 'Personal Best: Squat',
      detail: '105 kg · Yesterday',
      tone: 'tertiary',
    },
  ] satisfies Achievement[],
  recommended: {
    title: '10-Min Morning Mobility',
    duration: '10:00',
    imageUrl:
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=85',
  },
};

export default function DashboardScreen() {
  return (
    <TabScreen contentContainerStyle={styles.scrollContent}>
      <View style={styles.dashboard}>
        <Header
          avatarUrl={mockDashboard.user.avatarUrl}
          profileName={mockDashboard.user.name}
        />

        <View style={styles.greeting}>
          <ThemedText style={styles.greetingTitle}>Good morning, {mockDashboard.user.name}!</ThemedText>
          <ThemedText style={styles.greetingSubtitle} themeColor="textSecondary">
            Ready to crush it today?
          </ThemedText>
        </View>

        <WorkoutCard {...mockDashboard.workout} />

        <View style={styles.statsRow}>
          <StatCard
            accentColor={Palette.primary[700]}
            icon="flame"
            label="Weekly streak"
            {...mockDashboard.stats.streak}
          />
          <StatCard
            accentColor={Palette.tertiary[500]}
            icon="calories"
            label="Calories"
            {...mockDashboard.stats.calories}
          />
        </View>

        <AchievementsCard achievements={mockDashboard.achievements} />
        <RecommendedCard {...mockDashboard.recommended} />
      </View>
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    alignItems: 'center',
    paddingBottom: Spacing.five,
    paddingHorizontal: Spacing.three,
  },
  dashboard: {
    gap: Spacing.three,
    maxWidth: MaxContentWidth,
    paddingTop: Spacing.two,
    width: '100%',
  },
  greeting: {
    gap: 3,
    paddingVertical: Spacing.one,
  },
  greetingTitle: {
    ...Typography['2xl'],
    fontFamily: Fonts.heading,
  },
  greetingSubtitle: {
    ...Typography.sm,
    fontFamily: Fonts.body,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
});

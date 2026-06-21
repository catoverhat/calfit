import { StyleSheet, View } from 'react-native';

import { Header } from '@/components/header';
import { ActivityHeatmapCard } from '@/components/progress/activity-heatmap-card';
import { GoalBanner } from '@/components/progress/goal-banner';
import { MeasurementsCard } from '@/components/progress/measurements-card';
import { WeightTrendsCard } from '@/components/progress/weight-trends-card';
import { TabScreen } from '@/components/tab-screen';
import { ThemedText } from '@/components/themed-text';
import { MOCK_PROGRESS, MOCK_USER } from '@/constants/mock-data';
import { Fonts, MaxContentWidth, Spacing, Typography } from '@/constants/theme';

export function ProgressScreen() {
  return (
    <TabScreen contentContainerStyle={styles.scrollContent}>
      <View style={styles.content}>
        <Header avatarUrl={MOCK_USER.avatarUrl} profileName={MOCK_USER.name} />

        <View>
          <ThemedText style={styles.pageTitle}>Progress</ThemedText>
          <ThemedText style={styles.subtitle} themeColor="textSecondary">
            Track your gains and crush your goals.
          </ThemedText>
        </View>

        <GoalBanner detail={MOCK_PROGRESS.goal.detail} title={MOCK_PROGRESS.goal.title} />
        <WeightTrendsCard series={MOCK_PROGRESS.weightTrends} />
        <ActivityHeatmapCard {...MOCK_PROGRESS.heatmap} />
        <MeasurementsCard measurements={MOCK_PROGRESS.measurements} />
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
  content: {
    gap: Spacing.three,
    maxWidth: MaxContentWidth,
    paddingTop: Spacing.two,
    width: '100%',
  },
  pageTitle: {
    ...Typography['2xl'],
    fontFamily: Fonts.heading,
  },
  subtitle: {
    ...Typography.sm,
    fontFamily: Fonts.body,
  },
});

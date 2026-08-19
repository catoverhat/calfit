import { styles } from './workout-summary-screen.styles';
import { router, type Href } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Header } from '@/components/layout/header';
import { TabScreen } from '@/components/layout/tab-screen';
import { MOCK_USER } from '@/fixtures/mock-data';
import { SemanticColors } from '@/theme/tokens';
import {
  IntensityDistributionChart,
  PersonalRecordSummary,
  WorkoutNotesSection,
  WorkoutSummaryActions,
  WorkoutSummaryHero,
  WorkoutSummaryStats,
} from './components/workout-summary-sections';

export function WorkoutSummaryScreen() {
  const [notes, setNotes] = useState('');

  const saveWorkout = () => {
    router.replace('/(tabs)' as Href);
  };

  return (
    <TabScreen
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Header
          actionAccessibilityLabel="Sync workout summary"
          actionIcon="cloud"
          actionIconColor={SemanticColors.actionSoft}
          avatarUrl={MOCK_USER.avatarUrl}
          onNotificationsPress={() => router.push('/progress/sync' as Href)}
          profileName={MOCK_USER.name}
        />

        <WorkoutSummaryHero />
        <WorkoutSummaryStats />
        <PersonalRecordSummary />
        <WorkoutNotesSection notes={notes} onNotesChange={setNotes} />
        <WorkoutSummaryActions
          onHistory={() => router.push('/progress/history' as Href)}
          onSave={saveWorkout}
        />
        <IntensityDistributionChart />
      </View>
    </TabScreen>
  );
}

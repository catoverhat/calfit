import { styles } from './today-dashboard-screen.styles';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTodayDashboard } from './use-today-dashboard';
import {
  ProgressSummary,
  TodayHeader,
  TodayRoutineCard,
  TrainingTip,
  WeekSelector,
} from './components/today-dashboard-sections';

export function TodayDashboardScreen() {
  const { data: todayDashboard, error, isLoading, isStarting, startWorkout } = useTodayDashboard();
  const [selectedDate, setSelectedDate] = useState(todayDashboard.selectedDate);

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        style={styles.screen}>
        <View style={styles.content}>
          <TodayHeader
            avatarUrl={todayDashboard.avatarUrl}
            name={todayDashboard.name}
            syncLabel={todayDashboard.syncLabel}
          />

          <View style={styles.greetingBlock}>
            <Text style={styles.dateLabel}>{todayDashboard.dateLabel}</Text>
            <Text style={styles.greeting}>Good morning, {todayDashboard.name}!</Text>
          </View>

          <WeekSelector
            onSelect={setSelectedDate}
            selectedDate={selectedDate}
            weekDays={todayDashboard.weekDays}
          />
          <TodayRoutineCard
            error={error}
            isLoading={isLoading}
            isStarting={isStarting}
            onStart={startWorkout}
            routine={todayDashboard.routine}
          />
          <ProgressSummary progress={todayDashboard.progress} />
          <TrainingTip tip={todayDashboard.tip} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useStyles } from "./today-dashboard-screen.styles";

import {
  ProgressSummary,
  TodayHeader,
  TodayRoutineCard,
  TrainingTip,
} from "./components/today-dashboard-sections";
import { useTodayDashboard } from "./use-today-dashboard";

export function TodayDashboardScreen() {
  const styles = useStyles();
  const {
    data: todayDashboard,
    error,
    isLoading,
    isStarting,
    openPlan,
    openWorkouts,
    startWorkout,
  } = useTodayDashboard();

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        style={styles.screen}
      >
        <View style={styles.content}>
          <TodayHeader
            avatarUrl={todayDashboard.avatarUrl}
            name={todayDashboard.name}
            syncLabel={isLoading ? 'Loading your plan' : error ? 'Plan unavailable' : todayDashboard.syncLabel}
          />

          <View style={styles.greetingBlock}>
            <Text style={styles.dateLabel}>{todayDashboard.dateLabel}</Text>
            <Text style={styles.greeting}>
              {todayDashboard.greeting}, {todayDashboard.name}!
            </Text>
          </View>

          <TodayRoutineCard
            actionLabel={todayDashboard.actionLabel}
            canStart={Boolean(todayDashboard.routine || todayDashboard.activeSessionId)}
            error={error}
            isLoading={isLoading}
            isStarting={isStarting}
            onBrowseWorkouts={openWorkouts}
            onOpenPlan={openPlan}
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

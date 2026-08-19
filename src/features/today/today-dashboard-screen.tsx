import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./today-dashboard-screen.styles";

import {
  ProgressSummary,
  TodayHeader,
  TodayRoutineCard,
  TrainingTip,
} from "./components/today-dashboard-sections";
import { useTodayDashboard } from "./use-today-dashboard";

export function TodayDashboardScreen() {
  const {
    data: todayDashboard,
    error,
    isLoading,
    isStarting,
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
            syncLabel={todayDashboard.syncLabel}
          />

          <View style={styles.greetingBlock}>
            <Text style={styles.dateLabel}>{todayDashboard.dateLabel}</Text>
            <Text style={styles.greeting}>
              Good morning, {todayDashboard.name}!
            </Text>
          </View>

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

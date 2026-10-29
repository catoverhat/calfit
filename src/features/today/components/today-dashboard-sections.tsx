import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { Header } from "@/components/layout/header";
import { AppIcon } from "@/components/ui/app-icon";
import { useAppTheme } from "@/theme/app-theme-provider";
import { useStyles } from "../today-dashboard-screen.styles";
import type { TodayDashboardData } from "../today-dashboard.viewmodel";

export function TodayHeader({
  avatarUrl,
  name,
  syncLabel,
}: Pick<TodayDashboardData, "avatarUrl" | "name" | "syncLabel">) {
  return (
    <Header
      avatarUrl={avatarUrl}
      profileName={name}
      showAction={false}
      statusLabel={syncLabel}
    />
  );
}

export function ProgressSummary({
  progress,
}: {
  progress: TodayDashboardData["progress"];
}) {
  const styles = useStyles();
  const { SemanticColors } = useAppTheme();
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeading}>
        <Text accessibilityRole="header" style={styles.sectionTitle}>
          Your momentum
        </Text>
        <Link href="/progress" asChild>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="View all progress"
          >
            {({ pressed }) => (
              <View style={[styles.sectionAction, pressed && styles.pressed]}>
                <Text style={styles.sectionActionText}>View progress</Text>
                <AppIcon
                  color={SemanticColors.actionSoft}
                  name="chevronRight"
                  size={16}
                />
              </View>
            )}
          </Pressable>
        </Link>
      </View>
      <View style={styles.progressGrid}>
        <Link href="/progress/history" asChild>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${progress.completedWorkouts} completed workouts. View workout history.`}
            style={styles.progressLink}
          >
            {({ pressed }) => (
              <View style={[styles.progressCard, pressed && styles.pressed]}>
                <View style={styles.progressCardTop}>
                  <AppIcon
                    color={SemanticColors.success}
                    name="check"
                    size={20}
                  />
                  <AppIcon
                    color={SemanticColors.textMuted}
                    name="chevronRight"
                    size={16}
                  />
                </View>
                <Text style={styles.progressValue}>
                  {progress.completedWorkouts}
                </Text>
                <View style={styles.metricCopy}>
                  <Text style={styles.progressLabel}>Workouts completed</Text>
                  <Text style={styles.metricHelper}>All time</Text>
                </View>
              </View>
            )}
          </Pressable>
        </Link>
        <View
          accessible
          accessibilityLabel={`Current streak: ${progress.streak}. Consecutive training days.`}
          style={styles.progressStandaloneCard}
        >
          <AppIcon color={SemanticColors.success} name="flame" size={20} />
          <Text style={styles.progressValue}>{progress.streak}</Text>
          <View style={styles.metricCopy}>
            <Text style={styles.progressLabel}>Current streak</Text>
            <Text style={styles.metricHelper}>Consecutive training days</Text>
          </View>
        </View>
      </View>
      <Link href="/progress/measurements" asChild>
        <Pressable
          accessibilityLabel={`Body weight: ${progress.bodyWeight}. ${progress.bodyWeightDelta}. Open measurements.`}
          accessibilityRole="button"
        >
          {({ pressed }) => (
            <View style={[styles.measurementRow, pressed && styles.pressed]}>
              <View style={styles.measurementIcon}>
                <AppIcon
                  color={SemanticColors.textSecondary}
                  name="body"
                  size={20}
                />
              </View>
              <View style={styles.measurementCopy}>
                <Text style={styles.progressLabel}>Body weight</Text>
                <Text style={styles.metricHelper}>
                  {progress.bodyWeightDelta}
                </Text>
              </View>
              <Text style={styles.measurementValue}>{progress.bodyWeight}</Text>
              <AppIcon
                color={SemanticColors.textMuted}
                name="chevronRight"
                size={16}
              />
            </View>
          )}
        </Pressable>
      </Link>
    </View>
  );
}

export function TrainingTip({ tip }: { tip: string }) {
  const styles = useStyles();
  const { SemanticColors } = useAppTheme();
  return (
    <View style={styles.tipCard}>
      <AppIcon color={SemanticColors.info} name="info" size={20} />
      <View style={styles.tipCopy}>
        <Text style={styles.tipTitle}>A little perspective</Text>
        <Text style={styles.tipText}>{tip}</Text>
      </View>
    </View>
  );
}

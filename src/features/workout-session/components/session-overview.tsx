import { Text, View } from "react-native";

import { AppIcon } from "@/components/ui/app-icon";
import { useAppTheme } from "@/theme/app-theme-provider";

import { useStyles } from "../active-workout-session-screen.styles";

export function SessionOverview({
  completedSets,
  elapsed,
  hasSaveErrors,
  isSaving,
  title,
  totalSets,
}: {
  completedSets: number;
  elapsed: string;
  hasSaveErrors: boolean;
  isSaving: boolean;
  title: string;
  totalSets: number;
}) {
  const styles = useStyles();
  const { SemanticColors } = useAppTheme();
  const progress = totalSets > 0 ? completedSets / totalSets : 0;
  const allComplete = totalSets > 0 && completedSets === totalSets;

  return (
    <View style={styles.overviewCard}>
      <View style={styles.sessionHeader}>
        <View style={styles.activePill}>
          <AppIcon
            color={SemanticColors.actionSoft}
            name="strength"
            size={16}
          />
          <Text style={styles.activeText}>Workout session</Text>
        </View>
        <View accessibilityLiveRegion="polite" style={styles.saveStatus}>
          <AppIcon
            color={
              hasSaveErrors ? SemanticColors.danger : SemanticColors.textMuted
            }
            name={hasSaveErrors ? "warning" : isSaving ? "sync" : "save"}
            size={14}
          />
          <Text style={[styles.saveText, hasSaveErrors && styles.errorText]}>
            {hasSaveErrors
              ? "Check set values"
              : isSaving
                ? "Saving..."
                : "Auto-save on"}
          </Text>
        </View>
      </View>

      <Text accessibilityRole="header" style={styles.sessionTitle}>
        {title}
      </Text>

      <View style={styles.sessionStats}>
        <View style={styles.timeBlock}>
          <Text style={styles.smallLabel}>Elapsed time</Text>
          <Text style={styles.timeValue}>{elapsed}</Text>
        </View>
        <View style={styles.setCountBlock}>
          <Text style={styles.smallLabel}>Sets logged</Text>
          <Text
            style={[styles.setCountValue, allComplete && styles.successText]}
          >
            {completedSets}
            <Text style={styles.setCountTotal}> / {totalSets}</Text>
          </Text>
        </View>
      </View>

      <View
        accessibilityLabel="Workout progress"
        accessibilityRole="progressbar"
        accessibilityValue={{
          max: totalSets || 1,
          min: 0,
          now: completedSets,
          text: `${completedSets} of ${totalSets} sets logged`,
        }}
        style={styles.sessionProgressTrack}
      >
        <View
          style={[
            styles.sessionProgressFill,
            allComplete && styles.sessionProgressComplete,
            { width: `${progress * 100}%` },
          ]}
        />
      </View>
      <Text style={styles.sessionHint}>
        {allComplete
          ? "All sets logged. Finish your workout when you are ready."
          : "Adjust your numbers, then tap Log set after each set."}
      </Text>
    </View>
  );
}

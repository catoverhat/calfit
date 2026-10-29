import { Pressable, Text, View } from "react-native";

import { AppIcon } from "@/components/ui/app-icon";
import { useAppTheme } from "@/theme/app-theme-provider";

import { useStyles } from "../active-workout-session-screen.styles";

export function SessionRestCard({
  durationSeconds,
  onAdd,
  onSkip,
  onSubtract,
  seconds,
}: {
  durationSeconds: number;
  onAdd: () => void;
  onSkip: () => void;
  onSubtract: () => void;
  seconds: number;
}) {
  const styles = useStyles();
  const { SemanticColors } = useAppTheme();
  const remaining = durationSeconds > 0 ? Math.min(1, seconds / durationSeconds) : 0;

  return (
    <View style={styles.restCard}>
      <View style={styles.restCountdown}>
        <AppIcon color={SemanticColors.actionSoft} name="timer" size={24} />
        <Text style={styles.smallLabel}>Rest timer</Text>
      </View>
      <Text
        accessibilityLabel={`${seconds} seconds of rest remaining`}
        style={styles.restTime}
      >
        {formatTime(seconds)}
      </Text>
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={styles.sessionProgressTrack}
      >
        <View
          style={[styles.sessionProgressFill, { width: `${remaining * 100}%` }]}
        />
      </View>
      <View style={styles.restActions}>
        <Pressable
          accessibilityLabel="Remove thirty seconds from rest"
          accessibilityRole="button"
          onPress={onSubtract}
          style={({ pressed }) => [
            styles.addRestButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.addRestText}>−30 sec</Text>
        </Pressable>
        <Pressable
          accessibilityLabel="Add thirty seconds to rest"
          accessibilityRole="button"
          onPress={onAdd}
          style={({ pressed }) => [
            styles.addRestButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.addRestText}>+30 sec</Text>
        </Pressable>
        <Pressable
          accessibilityLabel="Skip rest"
          accessibilityRole="button"
          onPress={onSkip}
          style={({ pressed }) => [
            styles.skipRestButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.skipRestText}>Skip</Text>
          <AppIcon color={SemanticColors.actionSoft} name="next" size={16} />
        </Pressable>
      </View>
    </View>
  );
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const remainder = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainder}`;
}

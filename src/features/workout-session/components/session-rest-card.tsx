import { Pressable, Text, View } from "react-native";

import { AppIcon } from "@/components/ui/app-icon";
import { useAppTheme } from "@/theme/app-theme-provider";

import { useStyles } from "../active-workout-session-screen.styles";

export function SessionRestCard({
  onAdd,
  onSkip,
  seconds,
}: {
  onAdd: () => void;
  onSkip: () => void;
  seconds: number;
}) {
  const styles = useStyles();
  const { SemanticColors } = useAppTheme();

  return (
    <View style={styles.restCard}>
      <View style={styles.restCountdown}>
        <AppIcon color={SemanticColors.actionSoft} name="timer" size={24} />
        <View>
          <Text style={styles.smallLabel}>Rest timer</Text>
          <Text
            accessibilityLabel={`${seconds} seconds of rest remaining`}
            style={styles.restTime}
          >
            {formatTime(seconds)}
          </Text>
        </View>
      </View>
      <View style={styles.restActions}>
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
          <Text style={styles.skipRestText}>Skip rest</Text>
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

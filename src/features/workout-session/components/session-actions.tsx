import { useAppTheme } from "@/theme/app-theme-provider";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { AppIcon } from "@/components/ui/app-icon";

import { useStyles } from "../active-workout-session-screen.styles";

export function SessionActions({
  busy,
  disabled,
  onFinish,
}: {
  busy: boolean;
  disabled: boolean;
  onFinish: () => void;
}) {
  const styles = useStyles();
  const { DesignColors } = useAppTheme();
  return (
    <View style={styles.bottomActions}>
      <Pressable
        accessibilityLabel="Finish workout"
        accessibilityRole="button"
        accessibilityState={{ busy, disabled }}
        disabled={disabled}
        onPress={onFinish}
        style={({ pressed }) => [
          styles.finishButton,
          disabled && styles.disabled,
          pressed && !disabled && styles.finishButtonPressed,
        ]}
      >
        {busy ? (
          <ActivityIndicator
            color={DesignColors.onPrimaryContainer}
            size="small"
          />
        ) : (
          <AppIcon
            color={DesignColors.onPrimaryContainer}
            name="check"
            size={18}
          />
        )}
        <Text style={styles.finishButtonText}>
          {busy ? "Saving workout..." : "Finish workout"}
        </Text>
      </Pressable>
    </View>
  );
}

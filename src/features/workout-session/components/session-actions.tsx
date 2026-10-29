import { useAppTheme } from "@/theme/app-theme-provider";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { AppIcon } from "@/components/ui/app-icon";

import { useStyles } from "../active-workout-session-screen.styles";

export function SessionActions({
  busy,
  disabled,
  onDiscard,
  onFinish,
}: {
  busy: boolean;
  disabled: boolean;
  onDiscard: () => void;
  onFinish: () => void;
}) {
  const styles = useStyles();
  const { DesignColors, SemanticColors } = useAppTheme();
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
      <Pressable
        accessibilityHint="Deletes this session and its logged sets."
        accessibilityLabel="Discard workout"
        accessibilityRole="button"
        accessibilityState={{ disabled: busy }}
        disabled={busy}
        onPress={onDiscard}
        style={({ pressed }) => [
          styles.discardButton,
          busy && styles.disabled,
          pressed && styles.pressed,
        ]}
      >
        <AppIcon color={SemanticColors.danger} name="trash" size={16} />
        <Text style={styles.discardText}>Discard workout</Text>
      </Pressable>
    </View>
  );
}

import {
  ActivityIndicator,
  Pressable,
  Text,
  useColorScheme,
  View,
} from "react-native";

import { AppIcon, type AppIconName } from "@/components/ui/app-icon";
import type { ThemePreference } from "@/db";
import {
  useAppearancePreference,
  useAppTheme,
} from "@/theme/app-theme-provider";
import { AppThemes } from "@/theme/palettes";
import { useStyles } from "../profile-setup-screen.styles";
import { ProfileSection } from "./profile-sections";

const options: { value: ThemePreference; label: string; icon: AppIconName }[] =
  [
    { value: "system", label: "System", icon: "device" },
    { value: "light", label: "Light", icon: "sun" },
    { value: "dark", label: "Dark", icon: "moon" },
  ];

export function ProfileAppearanceSection() {
  const styles = useStyles();
  const systemScheme = useColorScheme() === "dark" ? "dark" : "light";
  const { SemanticColors, scheme } = useAppTheme();
  const { preference, setPreference, isSaving, error } =
    useAppearancePreference();

  return (
    <ProfileSection
      title="Appearance"
      description="Follow your device or choose a look."
      icon="device"
    >
      <View
        accessibilityLabel="Appearance"
        accessibilityRole="radiogroup"
        style={styles.appearanceOptions}
      >
        {options.map((option) => {
          const selected = option.value === preference;
          const preview =
            AppThemes[option.value === "system" ? systemScheme : option.value]
              .SemanticColors;
          return (
            <Pressable
              accessibilityLabel={`${option.label} appearance`}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected, disabled: isSaving }}
              disabled={isSaving}
              key={option.value}
              onPress={() => {
                void setPreference(option.value);
              }}
              style={({ pressed }) => [
                styles.appearanceOption,
                selected && styles.appearanceOptionSelected,
                pressed && styles.pressed,
              ]}
            >
              <View
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
                style={[
                  styles.themePreview,
                  {
                    backgroundColor: preview.canvas,
                    borderColor: preview.borderStrong,
                  },
                ]}
              >
                <View
                  style={[
                    styles.previewLine,
                    { backgroundColor: preview.textSecondary },
                  ]}
                />
                <View
                  style={[
                    styles.previewCard,
                    {
                      backgroundColor: preview.card,
                      borderColor: preview.border,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.previewShortLine,
                      { backgroundColor: preview.action },
                    ]}
                  />
                </View>
              </View>
              <View style={styles.appearanceLabelRow}>
                <AppIcon
                  color={
                    selected
                      ? SemanticColors.actionSoft
                      : SemanticColors.textMuted
                  }
                  name={option.icon}
                  size={16}
                />
                <Text style={styles.appearanceLabel}>{option.label}</Text>
              </View>
              {selected ? (
                <View style={styles.choiceCheck}>
                  <AppIcon
                    color={SemanticColors.actionText}
                    name="check"
                    size={12}
                  />
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </View>
      <View accessibilityLiveRegion="polite" style={styles.appearanceStatus}>
        {isSaving ? (
          <ActivityIndicator color={SemanticColors.action} size="small" />
        ) : (
          <AppIcon
            color={error ? SemanticColors.danger : SemanticColors.textMuted}
            name={error ? "warning" : "check"}
            size={14}
          />
        )}
        <Text style={styles.fieldHelper}>
          {isSaving
            ? "Saving appearance..."
            : error
              ? "Your previous appearance is still selected."
              : preference === "system"
                ? `Following your device's ${scheme} appearance.`
                : "Appearance saves automatically."}
        </Text>
      </View>
      {error ? (
        <Text accessibilityRole="alert" style={styles.feedbackError}>
          {error}
        </Text>
      ) : null}
    </ProfileSection>
  );
}

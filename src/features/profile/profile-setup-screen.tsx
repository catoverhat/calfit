import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppIcon } from "@/components/ui/app-icon";
import { useAppLock } from "@/features/auth/app-lock-context";
import { useAppTheme } from "@/theme/app-theme-provider";
import { ProfileAppearanceSection } from "./components/profile-appearance-section";
import { ProfileScreenPreferenceSection } from "./components/profile-screen-preference-section";
import {
  SegmentedControl,
  SetupField,
  UnitCard,
} from "./components/profile-form-controls";
import {
  ProfileHeader,
  ProfileSection,
  ProfileSecuritySection,
} from "./components/profile-sections";
import { useStyles } from "./profile-setup-screen.styles";
import { useProfile } from "./use-profile";

export function ProfileSetupScreen() {
  const styles = useStyles();
  const { SemanticColors } = useAppTheme();
  const { capability, lock } = useAppLock();
  const { width, fontScale } = useWindowDimensions();
  const wideFields = width >= 600 && fontScale < 1.5;
  const {
    changeHeightUnit,
    changeWeightUnit,
    draft,
    error,
    hasChanges,
    hasLoaded,
    isLoading,
    isSaving,
    retry,
    save,
    setField,
    success,
  } = useProfile();
  const disabled = isLoading || isSaving;
  const canSave = hasLoaded && hasChanges && !disabled;

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <ScrollView
        automaticallyAdjustKeyboardInsets
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollContent}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={styles.screen}
      >
        <View style={styles.content}>
          <ProfileHeader name={draft.username} />
          <View style={styles.heroCopy}>
            <Text accessibilityRole="header" style={styles.title}>
              Your profile
            </Text>
            <Text style={styles.subtitle}>
              Personal details and everyday preferences.
            </Text>
          </View>

          {!hasLoaded ? (
            <View
              accessibilityLiveRegion="polite"
              style={[styles.sectionCard, styles.loading]}
            >
              {isLoading ? (
                <ActivityIndicator
                  accessibilityLabel="Loading profile details"
                  color={SemanticColors.action}
                />
              ) : (
                <AppIcon
                  color={SemanticColors.danger}
                  name="warning"
                  size={24}
                />
              )}
              <Text style={styles.unitLabel}>
                {isLoading
                  ? "Loading your details"
                  : "Your details could not be loaded"}
              </Text>
              {error ? (
                <Text accessibilityRole="alert" style={styles.feedbackError}>
                  {error}
                </Text>
              ) : null}
              {!isLoading ? (
                <Pressable
                  accessibilityRole="button"
                  onPress={retry}
                  style={styles.lockButton}
                >
                  <Text style={styles.lockButtonText}>Try again</Text>
                </Pressable>
              ) : null}
            </View>
          ) : (
            <>
              <ProfileSection
                title="Personal details"
                description="Choose how your name appears in Calfit."
                icon="profile"
              >
                <View
                  style={[styles.fieldGrid, wideFields && styles.fieldGridWide]}
                >
                  <View style={styles.fieldCell}>
                    <SetupField
                      autoCapitalize="words"
                      autoComplete="name"
                      disabled={disabled}
                      label="Display name"
                      onChangeText={(value) => setField("username", value)}
                      placeholder="What should we call you?"
                      value={draft.username}
                    />
                  </View>
                  <View style={styles.fieldCell}>
                    <SetupField
                      autoCapitalize="none"
                      disabled={disabled}
                      helper="Use YYYY-MM-DD, for example 1990-05-20."
                      label="Date of birth"
                      maxLength={10}
                      onChangeText={(value) => setField("birthDate", value)}
                      optional
                      placeholder="YYYY-MM-DD"
                      value={draft.birthDate}
                    />
                  </View>
                </View>
              </ProfileSection>

              <ProfileSection
                title="Body measurements"
                description="Set your height and record your latest weight."
                icon="body"
              >
                <View
                  style={[styles.fieldGrid, wideFields && styles.fieldGridWide]}
                >
                  <View style={styles.fieldCell}>
                    <SetupField
                      accessory={
                        <SegmentedControl
                          accessibilityLabel="Height unit"
                          disabled={disabled}
                          onChange={changeHeightUnit}
                          options={[
                            { label: "cm", value: "cm" },
                            { label: "ft", value: "ft" },
                          ]}
                          value={draft.heightUnit}
                        />
                      }
                      disabled={disabled}
                      helper={
                        draft.heightUnit === "ft"
                          ? "Feet.inches: 5.11 means 5 feet 11 inches."
                          : "Your height in centimetres."
                      }
                      keyboardType="decimal-pad"
                      label="Height"
                      onChangeText={(value) => setField("height", value)}
                      optional
                      placeholder={draft.heightUnit === "cm" ? "180" : "5.11"}
                      value={draft.height}
                    />
                  </View>
                  <View style={styles.fieldCell}>
                    <SetupField
                      accessory={
                        <SegmentedControl
                          accessibilityLabel="Weight unit"
                          disabled={disabled}
                          onChange={changeWeightUnit}
                          options={[
                            { label: "kg", value: "kg" },
                            { label: "lb", value: "lb" },
                          ]}
                          value={draft.weightUnit}
                        />
                      }
                      disabled={disabled}
                      helper="A changed weight is added to your measurements."
                      keyboardType="decimal-pad"
                      label="Weight"
                      onChangeText={(value) => setField("weight", value)}
                      optional
                      placeholder={draft.weightUnit === "kg" ? "75" : "165"}
                      value={draft.weight}
                    />
                  </View>
                </View>
              </ProfileSection>

              <ProfileSection
                title="Training units"
                description="Choose how your workout numbers are displayed."
                icon="settings"
              >
                <UnitCard
                  disabled={disabled}
                  helper="For cardio and running"
                  label="Speed"
                  onChange={(value) => setField("speedUnit", value)}
                  options={[
                    { label: "km/h", value: "kmh" },
                    { label: "mph", value: "mph" },
                  ]}
                  value={draft.speedUnit}
                />
                <View style={styles.divider} />
                <UnitCard
                  disabled={disabled}
                  helper="For distance-based exercises"
                  label="Distance"
                  onChange={(value) => setField("distanceUnit", value)}
                  options={[
                    { label: "km", value: "km" },
                    { label: "mi", value: "mi" },
                  ]}
                  value={draft.distanceUnit}
                />
              </ProfileSection>

              <View style={styles.savePanel}>
                {error ? (
                  <Text accessibilityRole="alert" style={styles.feedbackError}>
                    {error}
                  </Text>
                ) : null}
                <View
                  accessibilityLiveRegion="polite"
                  style={styles.saveStatus}
                >
                  <AppIcon
                    color={
                      success
                        ? SemanticColors.success
                        : SemanticColors.textMuted
                    }
                    name={hasChanges ? "edit" : "check"}
                    size={16}
                  />
                  <Text
                    style={[
                      styles.saveStatusText,
                      !!success && styles.feedbackSuccess,
                    ]}
                  >
                    {isSaving
                      ? "Saving your details..."
                      : (success ??
                        (hasChanges
                          ? "You have unsaved changes."
                          : "Your details are up to date."))}
                  </Text>
                </View>
                <Pressable
                  accessibilityLabel={
                    isSaving ? "Saving profile changes" : "Save profile changes"
                  }
                  accessibilityRole="button"
                  accessibilityState={{ busy: isSaving, disabled: !canSave }}
                  disabled={!canSave}
                  onPress={() => {
                    void save();
                  }}
                  style={({ pressed }) => [
                    styles.saveButton,
                    !canSave && styles.saveButtonDisabled,
                    pressed && styles.pressed,
                  ]}
                >
                  {isSaving ? (
                    <ActivityIndicator color={SemanticColors.actionText} />
                  ) : (
                    <AppIcon
                      color={SemanticColors.actionText}
                      name="save"
                      size={18}
                    />
                  )}
                  <Text style={styles.saveButtonText}>
                    {isSaving ? "Saving..." : "Save changes"}
                  </Text>
                </Pressable>
              </View>
            </>
          )}

          <ProfileAppearanceSection />
          <ProfileScreenPreferenceSection />

          <ProfileSecuritySection
            isWebSession={capability.kind === "web"}
            onLock={lock}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

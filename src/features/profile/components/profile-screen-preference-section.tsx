import { Switch, Text, View } from 'react-native';

import { useWorkoutPreferences } from '@/features/workout-session/workout-preferences';
import { useAppTheme } from '@/theme/app-theme-provider';
import { useStyles } from '../profile-setup-screen.styles';
import { ProfileSection } from './profile-sections';

export function ProfileScreenPreferenceSection() {
  const styles = useStyles();
  const { SemanticColors } = useAppTheme();
  const { keepScreenAwake, isLoading, isSaving, error, setKeepScreenAwake } = useWorkoutPreferences();
  return (
    <ProfileSection title="Screen & battery" description="Allow normal screen timeout, or keep your workout visible." icon="device">
      <View style={styles.securityRow}>
        <View style={styles.securityCopy}>
          <Text style={styles.unitLabel}>Keep screen awake during workouts</Text>
          <Text style={styles.fieldHelper}>Only while the active workout screen is open. Turn off to use your device’s screen timeout.</Text>
        </View>
        <Switch
          accessibilityLabel="Keep screen awake during workouts"
          disabled={isLoading || isSaving}
          onValueChange={(enabled) => { void setKeepScreenAwake(enabled); }}
          trackColor={{ false: SemanticColors.borderStrong, true: SemanticColors.action }}
          value={keepScreenAwake}
        />
      </View>
      <Text accessibilityLiveRegion="polite" style={styles.fieldHelper}>
        {isLoading ? 'Loading screen preference...' : isSaving ? 'Saving screen preference...' : 'Saves automatically. Off by default to save battery.'}
      </Text>
      {error ? <Text accessibilityRole="alert" style={styles.feedbackError}>{error}</Text> : null}
    </ProfileSection>
  );
}

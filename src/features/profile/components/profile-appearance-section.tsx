import { ActivityIndicator, Text, View } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import { useAppearancePreference, useAppTheme } from '@/theme/app-theme-provider';
import { useStyles } from '../profile-setup-screen.styles';
import { SegmentedControl } from './profile-form-controls';

export function ProfileAppearanceSection() {
  const styles = useStyles();
  const { SemanticColors } = useAppTheme();
  const { preference, setPreference, isSaving, error } = useAppearancePreference();

  return (
    <View style={styles.appearanceSection}>
      <View style={styles.sectionHeader}>
        <AppIcon color={SemanticColors.actionSoft} name="device" size={18} />
        <Text style={styles.sectionTitle}>Appearance</Text>
      </View>
      <Text style={styles.appearanceHelper}>Follow your device, or choose a theme. Changes save automatically.</Text>
      <SegmentedControl
        disabled={isSaving}
        onChange={(value) => { void setPreference(value); }}
        options={[
          { label: 'System', value: 'system' },
          { label: 'Light', value: 'light' },
          { label: 'Dark', value: 'dark' },
        ]}
        value={preference}
        variant="wide"
      />
      {isSaving ? <ActivityIndicator accessibilityLabel="Saving appearance" color={SemanticColors.action} /> : null}
      {error ? <Text accessibilityRole="alert" style={styles.feedbackError}>{error}</Text> : null}
    </View>
  );
}

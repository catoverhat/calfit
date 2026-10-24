import { useAppTheme } from '@/theme/app-theme-provider';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { AppIcon, type AppIconName } from '@/components/ui/app-icon';

import type {
  AppLockFeedback,
  AppLockStatus,
  AuthenticationKind,
  DeviceAuthenticationCapability,
} from '../app-lock.types';
import { useStyles } from '../login-screen.styles';
import { LightningMark } from './login-icons';

export function LoginBrandSection() {
  const styles = useStyles();
  return (
    <View style={styles.brandBlock}>
      <View style={styles.logoTile}>
        <LightningMark />
      </View>
      <View style={styles.wordmarkRow}>
        <Text style={[styles.wordmarkText, styles.wordmarkLight]}>KINETIC</Text>
        <Text style={[styles.wordmarkText, styles.wordmarkAccent]}>PULSE</Text>
      </View>
      <Text style={styles.tagline}>PRECISION PERFORMANCE</Text>
    </View>
  );
}

export function LoginMessageSection({ compact }: { compact: boolean }) {
  const styles = useStyles();
  return (
    <View style={[styles.messagePanel, compact && styles.messagePanelCompact]}>
      <Text style={[styles.messageText, compact && styles.messageTextCompact]}>
        Plan workouts.{'\n'}
        Track progress.{'\n'}
        <Text style={styles.messageAccent}>Stay consistent.</Text>
      </Text>
    </View>
  );
}

interface LoginActionsSectionProps {
  capability: DeviceAuthenticationCapability;
  feedback: AppLockFeedback | null;
  onUnlock: () => void;
  status: AppLockStatus;
}

export function LoginActionsSection({
  capability,
  feedback,
  onUnlock,
  status,
}: LoginActionsSectionProps) {
  const styles = useStyles();
  const { SemanticColors } = useAppTheme();
  const isBusy = status === 'authenticating' || capability.availability === 'checking';
  const buttonLabel = status === 'authenticating'
    ? 'Authenticating…'
    : capability.label;
  const supportingMessage = feedback?.message ?? capability.description;

  return (
    <View style={styles.actions}>
      <View style={styles.securitySummary}>
        <View style={styles.securityHeading}>
          <AppIcon
            color={SemanticColors.action}
            name={iconForAuthentication(capability.kind)}
            size={20}
          />
          <Text style={styles.securityTitle}>
            {capability.kind === 'web' ? 'Browser Access' : 'Protected Access'}
          </Text>
        </View>
        <Text
          accessibilityLiveRegion="polite"
          style={[
            styles.securityDescription,
            feedback?.tone === 'error' && styles.securityDescriptionError,
          ]}>
          {supportingMessage}
        </Text>
      </View>

      <Pressable
        accessibilityLabel={buttonLabel}
        accessibilityRole="button"
        accessibilityState={{ busy: status === 'authenticating', disabled: isBusy }}
        disabled={isBusy}
        onPress={onUnlock}
        style={({ pressed }) => [
          styles.primaryButton,
          isBusy && styles.primaryButtonDisabled,
          pressed && !isBusy && styles.primaryButtonPressed,
        ]}>
        {isBusy ? (
          <ActivityIndicator color={SemanticColors.canvas} size="small" />
        ) : (
          <AppIcon
            color={SemanticColors.canvas}
            name={iconForAuthentication(capability.kind)}
            size={20}
          />
        )}
        <Text style={styles.primaryButtonText}>{buttonLabel}</Text>
      </Pressable>
    </View>
  );
}

function iconForAuthentication(kind: AuthenticationKind): AppIconName {
  if (kind === 'face') return 'faceScan';
  if (kind === 'fingerprint' || kind === 'biometric') return 'fingerprint';
  if (kind === 'web') return 'open';
  return 'shield';
}

import { Pressable, Text, View } from 'react-native';

import { styles } from '../login-screen.styles';
import { EnvelopeIcon, LightningMark } from './login-icons';

export function LoginBrandSection() {
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
  return (
    <View style={[styles.messagePanel, compact && styles.messagePanelCompact]}>
      <Text style={[styles.messageText, compact && styles.messageTextCompact]}>
        Plan workouts.{'\n'}
        Track progress.{'\n'}
        <Text style={styles.messageAccent}>Stay consistent.</Text>
      </Text>
      <View accessibilityElementsHidden style={styles.dots}>
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
    </View>
  );
}

export function LoginActionsSection({ onEnter }: { onEnter: () => void }) {
  return (
    <>
      <View style={styles.actions}>
        <Pressable
          accessibilityLabel="Sign in with Email"
          accessibilityRole="button"
          onPress={onEnter}
          style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}>
          <EnvelopeIcon />
          <Text style={styles.primaryButtonText}>Sign in with Email</Text>
        </Pressable>
        <Pressable
          accessibilityLabel="Continue with Google"
          accessibilityRole="button"
          onPress={onEnter}
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.secondaryButtonPressed]}>
          <Text style={styles.googleIcon}>G</Text>
          <Text style={styles.secondaryButtonText}>Continue with Google</Text>
        </Pressable>
      </View>
      <View style={styles.createAccountRow}>
        <Text style={styles.createAccountText}>Don&apos;t have an account?</Text>
        <Pressable
          accessibilityLabel="Create a new account"
          accessibilityRole="button"
          hitSlop={8}
          onPress={onEnter}
          style={({ pressed }) => pressed && styles.linkPressed}>
          <Text style={styles.createAccountLink}>Create one</Text>
        </Pressable>
      </View>
    </>
  );
}

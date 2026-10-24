import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import { Header } from '@/components/layout/header';
import { SemanticColors } from '@/theme/tokens';
import { styles } from '../profile-setup-screen.styles';

const launchImage = require('@/assets/images/login-runner-bg.png');

export function ProfileHeader({ name }: { name: string }) {
  return <Header profileIsInteractive={false} profileName={name} showAction={false} statusLabel="Your profile" />;
}

export function ProfileLaunchCard() {
  return (
    <View style={styles.launchCard}>
      <Image
        accessibilityLabel="Runner ready to launch"
        contentFit="cover"
        contentPosition="center"
        source={launchImage}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.launchOverlay} />
      <View style={styles.launchBadge}>
        <View style={styles.launchDot} />
        <Text style={styles.launchText}>READY TO LAUNCH</Text>
      </View>
    </View>
  );
}

interface ProfileSecuritySectionProps {
  isWebSession: boolean;
  onLock: () => void;
}

export function ProfileSecuritySection({ isWebSession, onLock }: ProfileSecuritySectionProps) {
  return (
    <View style={styles.securitySection}>
      <View style={styles.sectionHeader}>
        <AppIcon color={SemanticColors.actionSoft} name="lock" size={18} />
        <Text style={styles.sectionTitle}>App Security</Text>
      </View>
      <View style={styles.securityCard}>
        <View style={styles.securityCopy}>
          <Text style={styles.securityCardTitle}>Local app lock</Text>
          <Text style={styles.securityCardDescription}>
            {isWebSession
              ? 'Lock this browser session now. Continue on Web will be required to return.'
              : 'Lock Calfit now. Device authentication will be required to return.'}
          </Text>
        </View>
        <Pressable
          accessibilityLabel="Lock Calfit"
          accessibilityRole="button"
          onPress={onLock}
          style={({ pressed }) => [styles.lockButton, pressed && styles.lockButtonPressed]}>
          <AppIcon color={SemanticColors.actionSoft} name="lock" size={18} />
          <Text style={styles.lockButtonText}>Lock App</Text>
        </Pressable>
      </View>
    </View>
  );
}

import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import { Palette } from '@/theme/tokens';
import { styles } from '../profile-setup-screen.styles';

const launchImage = require('@/assets/images/login-runner-bg.png');

export function ProfileHeader({ name }: { name: string }) {
  const initials = (name.trim() || 'Local Athlete').slice(0, 2).toUpperCase();
  return (
    <View style={styles.brandBar}>
      <View style={styles.brandLeft}>
        <View accessibilityLabel={`${name || 'Local Athlete'}'s profile initials`} style={styles.avatarFallback}>
          <Text style={styles.avatarInitials}>{initials}</Text>
        </View>
        <Text style={styles.brandName}>Kinetic Pulse</Text>
      </View>
      <View accessibilityElementsHidden style={styles.cloudIcon}>
        <View style={styles.cloudDomeLarge} />
        <View style={styles.cloudDomeSmall} />
        <View style={styles.cloudBase} />
      </View>
    </View>
  );
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
        <AppIcon color={Palette.primary[500]} name="lock" size={18} />
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
          <AppIcon color={Palette.primary[400]} name="lock" size={18} />
          <Text style={styles.lockButtonText}>Lock App</Text>
        </Pressable>
      </View>
    </View>
  );
}

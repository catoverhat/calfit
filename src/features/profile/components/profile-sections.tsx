import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';
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

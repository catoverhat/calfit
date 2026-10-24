import { Image } from 'expo-image';
import { Link } from 'expo-router';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import {
  DesignColors,
  Fonts,
  Radius,
  SemanticColors,
  Space,
  TouchTarget,
  Typography,
} from '@/theme/tokens';

type HeaderProps = {
  actionAccessibilityLabel?: string;
  actionIcon?: AppIconName;
  actionIconColor?: string;
  avatarUrl?: string | null;
  onNotificationsPress?: () => void;
  onProfilePress?: () => void;
  profileName: string;
  profileIsInteractive?: boolean;
  showAction?: boolean;
  statusLabel?: string;
  style?: StyleProp<ViewStyle>;
  title?: string;
};

export function Header({
  actionAccessibilityLabel = 'Open notifications',
  actionIcon = 'bell',
  actionIconColor = SemanticColors.textPrimary,
  avatarUrl,
  onNotificationsPress,
  onProfilePress,
  profileName,
  profileIsInteractive = true,
  showAction = true,
  statusLabel,
  style,
  title = 'Kinetic Pulse',
}: HeaderProps) {
  const initials = (profileName.trim() || 'Local Athlete').slice(0, 2).toUpperCase();
  const avatar = avatarUrl ? (
    <Image contentFit="cover" source={avatarUrl} style={styles.avatar} transition={150} />
  ) : (
    <View style={[styles.avatar, styles.avatarFallback]}>
      <Text style={styles.avatarInitials}>{initials}</Text>
    </View>
  );
  const profileButton = (
    <Pressable
      accessibilityLabel={`Open ${profileName || 'Local Athlete'}'s profile`}
      accessibilityRole="button"
      onPress={onProfilePress}>
      {({ pressed }) => (
        <View style={[styles.sideSlot, pressed && styles.pressed]}>{avatar}</View>
      )}
    </Pressable>
  );

  return (
    <View style={[styles.container, style]}>
      {profileIsInteractive ? (
        onProfilePress ? profileButton : <Link href="/profile" asChild>{profileButton}</Link>
      ) : (
        <View accessibilityLabel={`${profileName || 'Local Athlete'}'s profile`} style={styles.sideSlot}>
          {avatar}
        </View>
      )}
      <View style={styles.brandBlock}>
        <Text style={styles.brand}>{title}</Text>
        {statusLabel ? <Text style={styles.status}>{statusLabel}</Text> : null}
      </View>
      {showAction && onNotificationsPress ? (
        <Pressable
          accessibilityLabel={actionAccessibilityLabel}
          accessibilityRole="button"
          onPress={onNotificationsPress}>
          {({ pressed }) => (
            <View style={[styles.sideSlot, pressed && styles.pressed]}>
              <AppIcon color={actionIconColor} name={actionIcon} size={20} />
            </View>
          )}
        </Pressable>
      ) : <View style={styles.sideSlot} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderBottomColor: SemanticColors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: Space.base,
    paddingBottom: Space.sm,
  },
  sideSlot: {
    alignItems: 'center',
    borderRadius: Radius.md,
    height: TouchTarget.min,
    justifyContent: 'center',
    width: TouchTarget.min,
  },
  avatar: {
    borderColor: SemanticColors.borderStrong,
    borderRadius: Radius.full,
    borderWidth: 1,
    height: 40,
    width: 40,
  },
  avatarFallback: {
    alignItems: 'center',
    backgroundColor: SemanticColors.actionTint,
    justifyContent: 'center',
  },
  avatarInitials: {
    ...Typography.xs,
    color: DesignColors.primary,
    fontFamily: Fonts.bodyBold,
  },
  brandBlock: { flex: 1, gap: Space.xs, minWidth: 0 },
  brand: {
    ...Typography.base,
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.heading,
    textAlign: 'center',
  },
  status: {
    ...Typography.xs,
    color: SemanticColors.textMuted,
    fontFamily: Fonts.body,
    textAlign: 'center',
  },
  pressed: { backgroundColor: SemanticColors.hover, opacity: 0.72 },
});

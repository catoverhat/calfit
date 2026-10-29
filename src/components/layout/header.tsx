import { useAppTheme } from '@/theme/app-theme-provider';
import { createThemedStyles } from '@/theme/create-themed-styles';
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
import { Fonts, Radius, Space, TouchTarget, Typography } from '@/theme/tokens';

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
  actionIconColor,
  avatarUrl,
  onNotificationsPress,
  onProfilePress,
  profileName,
  profileIsInteractive = true,
  showAction = true,
  statusLabel,
  style,
  title = 'Calfit',
}: HeaderProps) {
  const styles = useStyles();
  const { SemanticColors } = useAppTheme();
  const initials = (profileName.trim() || 'Local Athlete').split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
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
      <View style={styles.brandMark}>
        <AppIcon color={SemanticColors.actionSoft} name="strength" size={22} />
      </View>
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
              <AppIcon color={actionIconColor ?? SemanticColors.textPrimary} name={actionIcon} size={20} />
            </View>
          )}
        </Pressable>
      ) : null}
      {profileIsInteractive ? (
        onProfilePress ? profileButton : <Link href="/profile" asChild>{profileButton}</Link>
      ) : (
        <View accessibilityLabel={`${profileName || 'Local Athlete'}'s profile`} style={styles.sideSlot}>
          {avatar}
        </View>
      )}
    </View>
  );
}

const useStyles = createThemedStyles(({ DesignColors, SemanticColors }) => StyleSheet.create({
  container: {
    alignItems: 'center',
    borderBottomColor: SemanticColors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: Space.sm,
    paddingBottom: Space.sm,
  },
  sideSlot: {
    alignItems: 'center',
    borderRadius: Radius.md,
    height: TouchTarget.min,
    justifyContent: 'center',
    width: TouchTarget.min,
  },
  brandMark: {
    alignItems: 'center',
    backgroundColor: SemanticColors.actionTint,
    borderRadius: Radius.md,
    height: 40,
    justifyContent: 'center',
    width: 40,
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
    ...Typography.xl,
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.heading,
  },
  status: {
    ...Typography.xs,
    color: SemanticColors.textMuted,
    fontFamily: Fonts.body,
  },
  pressed: { backgroundColor: SemanticColors.hover, opacity: 0.72 },
}));

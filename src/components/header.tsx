import { Image } from 'expo-image';
import {
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import { Fonts, Palette, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type HeaderProps = {
  actionAccessibilityLabel?: string;
  actionIcon?: AppIconName;
  actionIconColor?: string;
  avatarUrl: string;
  onNotificationsPress?: () => void;
  onProfilePress?: () => void;
  profileName: string;
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
  style,
  title = 'Kinetic Pulse',
}: HeaderProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      <Pressable
        accessibilityLabel={`Open ${profileName}'s profile`}
        accessibilityRole="button"
        hitSlop={8}
        onPress={onProfilePress}
        style={({ pressed }) => pressed && styles.pressed}>
        <Image
          accessibilityLabel={`${profileName}'s profile photo`}
          source={avatarUrl}
          style={[styles.avatar, { borderColor: theme.border }]}
          transition={150}
        />
      </Pressable>
      <ThemedText style={styles.brand}>{title}</ThemedText>
      <Pressable
        accessibilityLabel={actionAccessibilityLabel}
        accessibilityRole="button"
        hitSlop={12}
        onPress={onNotificationsPress}
        style={({ pressed }) => [styles.notificationButton, pressed && styles.pressed]}>
        <AppIcon color={actionIconColor ?? theme.text} name={actionIcon} size={19} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 44,
  },
  avatar: {
    borderCurve: 'continuous',
    borderRadius: 18,
    borderWidth: 1,
    height: 36,
    width: 36,
  },
  brand: {
    ...Typography.sm,
    color: Palette.primary[600],
    flex: 1,
    fontFamily: Fonts.heading,
    textAlign: 'center',
  },
  notificationButton: {
    alignItems: 'center',
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  pressed: {
    opacity: 0.55,
  },
});

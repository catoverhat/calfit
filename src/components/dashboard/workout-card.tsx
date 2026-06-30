import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { AppIcon } from '@/components/ui/app-icon';
import { Fonts, Palette, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type WorkoutCardProps = {
  duration: string;
  imageUrl: string;
  intensity: string;
  title: string;
  onStartPress?: () => void;
};

export function WorkoutCard({
  duration,
  imageUrl,
  intensity,
  title,
  onStartPress,
}: WorkoutCardProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.backgroundElement,
          borderColor: theme.border,
        },
      ]}>
      <View>
        <Image
          accessibilityLabel="Athlete performing today's workout"
          contentPosition="center"
          source={imageUrl}
          style={styles.image}
          transition={200}
        />
        <View style={styles.badge}>
          <AppIcon color={Palette.secondary[900]} name="intensity" size={12} />
          <ThemedText style={styles.badgeText}>Today&apos;s Workout</ThemedText>
        </View>
      </View>

      <View style={styles.content}>
        <ThemedText style={styles.title}>{title}</ThemedText>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <AppIcon color={theme.textSecondary} name="clock" size={14} />
            <ThemedText style={styles.metaText} themeColor="textSecondary">
              {duration}
            </ThemedText>
          </View>
          <View style={styles.metaItem}>
            <AppIcon color={theme.textSecondary} name="intensity" size={13} />
            <ThemedText style={styles.metaText} themeColor="textSecondary">
              {intensity}
            </ThemedText>
          </View>
        </View>

        <Pressable
          accessibilityLabel={`Start ${title}`}
          accessibilityRole="button"
          onPress={onStartPress}
          style={({ pressed }) => [styles.startButton, pressed && styles.pressed]}>
          <ThemedText style={styles.startButtonText}>Start Workout</ThemedText>
          <AppIcon color={Palette.white} name="play" size={13} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderCurve: 'continuous',
    borderRadius: 14,
    borderWidth: 1,
    boxShadow: '0 3px 12px rgba(26, 28, 35, 0.06)',
    overflow: 'hidden',
  },
  image: {
    aspectRatio: 1.78,
    width: '100%',
  },
  badge: {
    alignItems: 'center',
    backgroundColor: Palette.primary[500],
    borderRadius: 6,
    flexDirection: 'row',
    gap: 5,
    left: Spacing.three,
    paddingHorizontal: 9,
    paddingVertical: 6,
    position: 'absolute',
    top: Spacing.three,
  },
  badgeText: {
    ...Typography.xs,
    color: Palette.secondary[900],
    fontFamily: Fonts.bodySemiBold,
  },
  content: {
    gap: 7,
    padding: Spacing.three,
  },
  title: {
    ...Typography.lg,
    fontFamily: Fonts.heading,
  },
  metaRow: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  metaItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  metaText: {
    ...Typography.xs,
    fontFamily: Fonts.body,
  },
  startButton: {
    alignItems: 'center',
    backgroundColor: Palette.primary[700],
    borderCurve: 'continuous',
    borderRadius: 8,
    flexDirection: 'row',
    gap: Spacing.two,
    justifyContent: 'center',
    marginTop: Spacing.two,
    minHeight: 48,
    paddingHorizontal: Spacing.three,
  },
  startButtonText: {
    ...Typography.sm,
    color: Palette.white,
    fontFamily: Fonts.bodyBold,
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }],
  },
});

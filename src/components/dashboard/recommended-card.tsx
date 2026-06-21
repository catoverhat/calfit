import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { AppIcon } from '@/components/ui/app-icon';
import { Fonts, Palette, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type RecommendedCardProps = {
  duration: string;
  imageUrl: string;
  title: string;
  onPress?: () => void;
};

export function RecommendedCard({
  duration,
  imageUrl,
  title,
  onPress,
}: RecommendedCardProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.section,
        {
          backgroundColor: theme.backgroundElement,
          borderColor: theme.border,
        },
      ]}>
      <ThemedText style={styles.sectionTitle}>Recommended</ThemedText>
      <Pressable
        accessibilityLabel={`Play ${title}, ${duration}`}
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [styles.media, pressed && styles.pressed]}>
        <Image
          accessibilityLabel="Person stretching in a bright gym"
          contentPosition="center"
          source={imageUrl}
          style={StyleSheet.absoluteFill}
          transition={200}
        />
        <View style={styles.scrim} />
        <View style={styles.playButton}>
          <AppIcon color={Palette.primary[700]} name="play" size={16} />
        </View>
        <View style={styles.mediaCopy}>
          <View style={styles.durationBadge}>
            <ThemedText style={styles.duration}>{duration}</ThemedText>
          </View>
          <ThemedText style={styles.mediaTitle}>{title}</ThemedText>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    borderCurve: 'continuous',
    borderRadius: 12,
    borderWidth: 1,
    boxShadow: '0 2px 10px rgba(26, 28, 35, 0.04)',
    gap: Spacing.three,
    padding: Spacing.three,
  },
  sectionTitle: {
    ...Typography.lg,
    fontFamily: Fonts.heading,
  },
  media: {
    aspectRatio: 1.75,
    borderCurve: 'continuous',
    borderRadius: 10,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  scrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(13, 14, 18, 0.23)',
  },
  playButton: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  mediaCopy: {
    bottom: 10,
    left: 10,
    position: 'absolute',
    right: 10,
  },
  durationBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  duration: {
    ...Typography.xs,
    color: Palette.secondary[900],
    fontFamily: Fonts.bodySemiBold,
  },
  mediaTitle: {
    ...Typography.sm,
    color: Palette.white,
    fontFamily: Fonts.bodyBold,
    textShadowColor: 'rgba(0, 0, 0, 0.45)',
    textShadowOffset: { height: 1, width: 0 },
    textShadowRadius: 2,
  },
  pressed: {
    opacity: 0.8,
  },
});

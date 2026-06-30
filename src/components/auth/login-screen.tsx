import { Image } from 'expo-image';
import { router } from 'expo-router';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Fonts, Palette, Spacing, Typography } from '@/constants/theme';

const backgroundImage = require('@/assets/images/login-runner-bg.png');

export function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  const isCompact = width < 360;
  const contentWidth = Math.min(width - Spacing.three * 2, 360);

  const enterApp = () => {
    router.replace('/(tabs)/index');
  };

  return (
    <ScrollView
      bounces={false}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={[
        styles.scrollContent,
        {
          minHeight: height,
          paddingBottom: Math.max(insets.bottom + Spacing.three, Spacing.four),
          paddingTop: Math.max(insets.top + Spacing.four, Spacing.five),
        },
      ]}
      showsVerticalScrollIndicator={false}
      style={styles.screen}>
      <View style={styles.stage}>
        <Image
          accessibilityIgnoresInvertColors
          contentFit="cover"
          source={backgroundImage}
          style={StyleSheet.absoluteFill}
          transition={250}
        />
        <View style={[StyleSheet.absoluteFill, styles.photoShade]} />
        <View style={[StyleSheet.absoluteFill, styles.warmShade]} />

        <View style={[styles.content, { width: contentWidth }]}>
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

          <View style={[styles.messagePanel, isCompact && styles.messagePanelCompact]}>
            <Text style={[styles.messageText, isCompact && styles.messageTextCompact]}>
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

          <View style={styles.actions}>
            <Pressable
              accessibilityLabel="Sign in with Email"
              accessibilityRole="button"
              onPress={enterApp}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.primaryButtonPressed,
              ]}>
              <EnvelopeIcon />
              <Text style={styles.primaryButtonText}>Sign in with Email</Text>
            </Pressable>

            <Pressable
              accessibilityLabel="Continue with Google"
              accessibilityRole="button"
              onPress={enterApp}
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.secondaryButtonPressed,
              ]}>
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
              onPress={enterApp}
              style={({ pressed }) => pressed && styles.linkPressed}>
              <Text style={styles.createAccountLink}>Create one</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

function LightningMark() {
  return (
    <View accessibilityElementsHidden style={styles.lightning}>
      <View style={styles.lightningTop} />
      <View style={styles.lightningBottom} />
    </View>
  );
}

function EnvelopeIcon() {
  return (
    <View accessibilityElementsHidden style={styles.envelope}>
      <View style={styles.envelopeFlapLeft} />
      <View style={styles.envelopeFlapRight} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: Palette.secondary[950],
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  stage: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
    minHeight: '100%',
    overflow: 'hidden',
    paddingHorizontal: Spacing.three,
  },
  photoShade: {
    backgroundColor: 'rgba(5, 5, 6, 0.42)',
  },
  warmShade: {
    backgroundColor: 'rgba(67, 17, 5, 0.18)',
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    maxWidth: 360,
    paddingVertical: Spacing.three,
  },
  brandBlock: {
    alignItems: 'center',
    gap: Spacing.one,
  },
  logoTile: {
    alignItems: 'center',
    backgroundColor: 'rgba(17, 19, 21, 0.82)',
    borderColor: Palette.primary[500],
    borderCurve: 'continuous',
    borderRadius: 12,
    borderWidth: 1.5,
    height: 76,
    justifyContent: 'center',
    marginBottom: Spacing.two,
    transform: [{ rotate: '3deg' }],
    width: 76,
  },
  lightning: {
    height: 39,
    transform: [{ rotate: '9deg' }],
    width: 30,
  },
  lightningTop: {
    borderBottomColor: Palette.primary[500],
    borderBottomWidth: 25,
    borderLeftColor: 'transparent',
    borderLeftWidth: 12,
    borderRightColor: 'transparent',
    borderRightWidth: 5,
    height: 0,
    left: 7,
    position: 'absolute',
    top: 0,
    width: 0,
  },
  lightningBottom: {
    borderLeftColor: 'transparent',
    borderLeftWidth: 5,
    borderRightColor: 'transparent',
    borderRightWidth: 12,
    borderTopColor: Palette.primary[500],
    borderTopWidth: 25,
    bottom: 0,
    height: 0,
    left: 7,
    position: 'absolute',
    width: 0,
  },
  wordmarkRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  wordmarkText: {
    ...Typography['2xl'],
    fontFamily: Fonts.heading,
    fontStyle: 'italic',
    lineHeight: 30,
  },
  wordmarkLight: {
    color: Palette.white,
  },
  wordmarkAccent: {
    color: Palette.primary[500],
  },
  tagline: {
    color: Palette.primary[500],
    fontFamily: Fonts.bodyBold,
    fontSize: 10,
    lineHeight: 14,
    textTransform: 'uppercase',
  },
  messagePanel: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: 'rgba(34, 37, 41, 0.9)',
    borderCurve: 'continuous',
    borderRadius: 8,
    boxShadow: '0 16px 26px rgba(0, 0, 0, 0.3)',
    gap: Spacing.two,
    marginTop: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  messagePanelCompact: {
    paddingHorizontal: Spacing.three,
  },
  messageText: {
    ...Typography['2xl'],
    color: Palette.white,
    fontFamily: Fonts.bodyBold,
    lineHeight: 30,
    textAlign: 'center',
  },
  messageTextCompact: {
    fontSize: 22,
    lineHeight: 28,
  },
  messageAccent: {
    color: Palette.primary[500],
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 3,
    height: 6,
    width: 6,
  },
  dotActive: {
    backgroundColor: Palette.primary[500],
  },
  actions: {
    alignSelf: 'stretch',
    gap: Spacing.two,
    marginTop: Spacing.four,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: Palette.primary[500],
    borderCurve: 'continuous',
    borderRadius: 7,
    flexDirection: 'row',
    gap: Spacing.two,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: Spacing.three,
  },
  primaryButtonPressed: {
    backgroundColor: Palette.primary[600],
    transform: [{ scale: 0.99 }],
  },
  primaryButtonText: {
    color: Palette.secondary[950],
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
    lineHeight: 20,
  },
  envelope: {
    borderColor: Palette.secondary[950],
    borderRadius: 1,
    borderWidth: 1.6,
    height: 12,
    overflow: 'hidden',
    width: 16,
  },
  envelopeFlapLeft: {
    backgroundColor: Palette.secondary[950],
    height: 1.4,
    left: 0,
    position: 'absolute',
    top: 4,
    transform: [{ rotate: '32deg' }],
    width: 10,
  },
  envelopeFlapRight: {
    backgroundColor: Palette.secondary[950],
    height: 1.4,
    position: 'absolute',
    right: 0,
    top: 4,
    transform: [{ rotate: '-32deg' }],
    width: 10,
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(17, 19, 21, 0.34)',
    borderColor: 'rgba(255, 255, 255, 0.14)',
    borderCurve: 'continuous',
    borderRadius: 7,
    borderWidth: 1,
    flexDirection: 'row',
    gap: Spacing.two,
    justifyContent: 'center',
    minHeight: 50,
    paddingHorizontal: Spacing.three,
  },
  secondaryButtonPressed: {
    backgroundColor: 'rgba(17, 19, 21, 0.56)',
    transform: [{ scale: 0.99 }],
  },
  googleIcon: {
    color: Palette.white,
    fontFamily: Fonts.bodyBold,
    fontSize: 18,
    lineHeight: 20,
    width: 18,
  },
  secondaryButtonText: {
    color: Palette.white,
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
    lineHeight: 20,
  },
  createAccountRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    justifyContent: 'center',
    marginTop: Spacing.three,
  },
  createAccountText: {
    color: Palette.white,
    fontFamily: Fonts.bodySemiBold,
    fontSize: 12,
    lineHeight: 18,
  },
  createAccountLink: {
    color: Palette.primary[500],
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
    lineHeight: 18,
  },
  linkPressed: {
    opacity: 0.68,
  },
});

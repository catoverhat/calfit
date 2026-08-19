import { styles } from './login-screen.styles';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Spacing } from '@/theme/tokens';
import {
  LoginActionsSection,
  LoginBrandSection,
  LoginMessageSection,
} from './components/login-sections';

const backgroundImage = require('@/assets/images/login-runner-bg.png');

export function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  const isCompact = width < 360;
  const contentWidth = Math.min(width - Spacing.three * 2, 360);

  const enterApp = () => {
    router.replace('/(tabs)');
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
          <LoginBrandSection />
          <LoginMessageSection compact={isCompact} />
          <LoginActionsSection onEnter={enterApp} />
        </View>
      </View>
    </ScrollView>
  );
}

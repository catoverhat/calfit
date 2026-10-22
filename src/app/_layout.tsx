import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { Stack } from 'expo-router/stack';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

import '@/global.css';

import { AnimatedSplashOverlay } from '@/components/layout/animated-splash-overlay';
import { AppLockProvider, useAppLock } from '@/features/auth/app-lock-context';
import { getAppLockRouteAccess } from '@/features/auth/app-lock.viewmodel';
import { useAppFonts } from '@/hooks/use-app-fonts';

export const unstable_settings = {
  initialRouteName: 'login',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded, fontError] = useAppFonts();

  if (fontError) throw fontError;
  if (!fontsLoaded) return null;

  return (
    <AppLockProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <StatusBar style="auto" />
        <AnimatedSplashOverlay />
        <RootNavigator />
      </ThemeProvider>
    </AppLockProvider>
  );
}

function RootNavigator() {
  const { status } = useAppLock();
  const access = getAppLockRouteAccess(status);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={access.canAccessLogin}>
        <Stack.Screen name="login" />
      </Stack.Protected>
      <Stack.Protected guard={access.canAccessProtectedRoutes}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="workout-session/[id]" />
      </Stack.Protected>
    </Stack>
  );
}

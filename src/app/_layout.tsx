import { ThemeProvider } from 'expo-router';
import { Stack } from 'expo-router/stack';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import '@/global.css';

import { AnimatedSplashOverlay } from '@/components/layout/animated-splash-overlay';
import { AppLockProvider, useAppLock } from '@/features/auth/app-lock-context';
import { getAppLockRouteAccess } from '@/features/auth/app-lock.viewmodel';
import { useAppFonts } from '@/hooks/use-app-fonts';
import { AppNavigationTheme } from '@/theme/navigation-theme';

export const unstable_settings = {
  initialRouteName: 'login',
};

export default function RootLayout() {
  useEffect(() => {
    if (!__DEV__ || typeof document === 'undefined' || !window.location.hash.includes('figmacapture=')) return;
    const script = document.createElement('script');
    script.src = 'https://mcp.figma.com/mcp/html-to-design/capture.js';
    script.async = true;
    document.head.appendChild(script);
    return () => script.remove();
  }, []);

  const [fontsLoaded, fontError] = useAppFonts();

  if (fontError) throw fontError;
  if (!fontsLoaded) return null;

  return (
    <AppLockProvider>
      <ThemeProvider value={AppNavigationTheme}>
        <StatusBar style="light" />
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

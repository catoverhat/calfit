import { Stack } from "expo-router/stack";
import * as SplashScreen from "expo-splash-screen";

import "@/global.css";

import { AnimatedSplashOverlay } from "@/components/layout/animated-splash-overlay";
import { AppLockProvider, useAppLock } from "@/features/auth/app-lock-context";
import { getAppLockRouteAccess } from "@/features/auth/app-lock.viewmodel";
import { useAppFonts } from "@/hooks/use-app-fonts";
import { useDevelopmentScreenTimeout } from "@/hooks/use-development-screen-timeout";
import { WorkoutPreferencesProvider } from "@/features/workout-session/workout-preferences";
import { AppThemeProvider, useAppTheme } from "@/theme/app-theme-provider";
import { Fonts } from "@/theme/tokens";

void SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: "login",
};

export default function RootLayout() {
  useDevelopmentScreenTimeout();
  const [fontsLoaded, fontError] = useAppFonts();

  if (fontError) throw fontError;
  if (!fontsLoaded) return null;

  return (
    <AppThemeProvider>
      <WorkoutPreferencesProvider>
        <AppLockProvider>
          <AnimatedSplashOverlay />
          <RootNavigator />
        </AppLockProvider>
      </WorkoutPreferencesProvider>
    </AppThemeProvider>
  );
}

function RootNavigator() {
  const { status } = useAppLock();
  const { SemanticColors } = useAppTheme();
  const access = getAppLockRouteAccess(status);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={access.canAccessLogin}>
        <Stack.Screen name="login" />
      </Stack.Protected>
      <Stack.Protected guard={access.canAccessProtectedRoutes}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="workout-session/[id]"
          options={{
            contentStyle: { backgroundColor: SemanticColors.canvas },
            headerBackButtonDisplayMode: "minimal",
            headerShadowVisible: false,
            headerShown: true,
            headerStyle: { backgroundColor: SemanticColors.canvas },
            headerTintColor: SemanticColors.textPrimary,
            headerTitleStyle: {
              color: SemanticColors.actionSoft,
              fontFamily: Fonts.heading,
            },
            title: "Workout",
          }}
        />
      </Stack.Protected>
    </Stack>
  );
}

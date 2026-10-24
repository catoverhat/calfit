import { useAppTheme } from '@/theme/app-theme-provider';
import { Stack } from 'expo-router/stack';

import { Fonts } from '@/theme/tokens';

export default function ProgressLayout() {
  const { SemanticColors } = useAppTheme();
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: SemanticColors.canvas },
        headerBackButtonDisplayMode: 'minimal',
        headerShadowVisible: false,
        headerStyle: { backgroundColor: SemanticColors.canvas },
        headerTintColor: SemanticColors.textPrimary,
        headerTitleStyle: { color: SemanticColors.actionSoft, fontFamily: Fonts.heading },
      }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="summary" options={{ title: 'Workout Summary' }} />
      <Stack.Screen name="history" options={{ title: 'Workout History' }} />
      <Stack.Screen name="measurements" options={{ title: 'Body Measurements' }} />
      <Stack.Screen name="storage" options={{ title: 'Local Data' }} />
    </Stack>
  );
}

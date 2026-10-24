import { useAppTheme } from '@/theme/app-theme-provider';
import { Stack } from 'expo-router/stack';

import { Fonts } from '@/theme/tokens';

export default function WorkoutDetailLayout() {
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
      <Stack.Screen name="index" options={{ title: 'Workout' }} />
      <Stack.Screen name="edit" options={{ title: 'Edit Workout' }} />
    </Stack>
  );
}

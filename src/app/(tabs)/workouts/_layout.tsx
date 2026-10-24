import { useAppTheme } from '@/theme/app-theme-provider';
import { Stack } from 'expo-router/stack';

import { Fonts } from '@/theme/tokens';

export default function WorkoutsLayout() {
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
      <Stack.Screen name="[id]" options={{ headerShown: false }} />
      <Stack.Screen name="create" options={{ title: 'Create Workout' }} />
      <Stack.Screen name="add-exercise" options={{ title: 'Choose Exercises' }} />
      <Stack.Screen name="exercises" options={{ headerShown: false }} />
    </Stack>
  );
}

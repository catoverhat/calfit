import { Stack } from 'expo-router/stack';

import { Fonts, SemanticColors } from '@/theme/tokens';

export default function WorkoutExercisesLayout() {
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
      <Stack.Screen name="index" options={{ title: 'Manage Exercises' }} />
      <Stack.Screen name="create" options={{ title: 'Create Exercise' }} />
      <Stack.Screen name="[id]" options={{ headerShown: false }} />
    </Stack>
  );
}

import { Stack } from 'expo-router/stack';

import { Fonts, SemanticColors } from '@/theme/tokens';

export default function WorkoutExerciseLayout() {
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
      <Stack.Screen name="edit" options={{ title: 'Edit Exercise' }} />
    </Stack>
  );
}

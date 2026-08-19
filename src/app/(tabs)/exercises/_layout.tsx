import { Stack } from 'expo-router/stack';

import { Fonts, SemanticColors } from '@/constants/theme';

export default function ExercisesLayout() {
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: SemanticColors.canvas },
        headerBackButtonDisplayMode: 'minimal',
        headerShadowVisible: false,
        headerStyle: { backgroundColor: SemanticColors.canvas },
        headerTintColor: SemanticColors.textPrimary,
        headerTitleStyle: {
          color: SemanticColors.actionSoft,
          fontFamily: Fonts.heading,
        },
      }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="create" options={{ title: 'Kinetic Pulse' }} />
      <Stack.Screen name="[id]/edit" options={{ title: 'Kinetic Pulse' }} />
    </Stack>
  );
}

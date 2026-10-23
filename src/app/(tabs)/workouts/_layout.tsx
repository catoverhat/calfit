import { Stack } from 'expo-router/stack';

import { Fonts, SemanticColors } from '@/theme/tokens';

export default function WorkoutsLayout() {
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
      <Stack.Screen name="create" options={{ title: 'Kinetic Pulse' }} />
      <Stack.Screen name="add-exercise" options={{ title: 'Add Exercise' }} />
      <Stack.Screen name="exercises" options={{ headerShown: false }} />
    </Stack>
  );
}

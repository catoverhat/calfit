import { Stack } from 'expo-router/stack';

import { SemanticColors } from '@/theme/tokens';

export default function ProgressLayout() {
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: SemanticColors.canvas },
        headerShown: false,
      }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="summary" />
      <Stack.Screen name="history" />
      <Stack.Screen name="measurements" />
      <Stack.Screen name="sync" />
    </Stack>
  );
}

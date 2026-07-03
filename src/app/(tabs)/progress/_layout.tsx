import { Stack } from 'expo-router/stack';

import { SemanticColors } from '@/constants/theme';

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
    </Stack>
  );
}

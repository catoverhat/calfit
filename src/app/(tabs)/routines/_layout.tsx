import { Stack } from 'expo-router/stack';

import { Fonts, Palette } from '@/constants/theme';

export default function RoutinesLayout() {
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: Palette.secondary[950] },
        headerBackButtonDisplayMode: 'minimal',
        headerShadowVisible: false,
        headerStyle: { backgroundColor: Palette.secondary[950] },
        headerTintColor: Palette.white,
        headerTitleStyle: { color: Palette.primary[400], fontFamily: Fonts.heading },
      }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[id]" options={{ title: 'Routine' }} />
      <Stack.Screen name="create" options={{ title: 'Kinetic Pulse' }} />
      <Stack.Screen name="add-exercise" options={{ title: 'Add Exercise' }} />
      <Stack.Screen name="[id]/edit" options={{ title: 'Kinetic Pulse' }} />
    </Stack>
  );
}

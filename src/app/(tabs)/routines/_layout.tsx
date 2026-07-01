import { Stack } from 'expo-router/stack';

import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function RoutinesLayout() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: theme.background },
        headerBackButtonDisplayMode: 'minimal',
        headerShadowVisible: false,
        headerStyle: { backgroundColor: theme.background },
        headerTintColor: theme.text,
        headerTitleStyle: { fontFamily: Fonts.heading },
      }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[id]" options={{ title: 'Routine' }} />
    </Stack>
  );
}

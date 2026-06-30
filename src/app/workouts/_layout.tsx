import { Stack } from 'expo-router/stack';

import { SessionTimer } from '@/components/workouts/session-timer';
import { Fonts, Palette } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function WorkoutsLayout() {
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
      <Stack.Screen name="[id]" options={{ title: 'Workout' }} />
      <Stack.Screen
        name="[id]/session"
        options={{
          title: 'Kinetic Pulse',
          headerRight: () => <SessionTimer initialSeconds={1455} />,
          headerTitleStyle: { color: Palette.primary[600], fontFamily: Fonts.heading },
        }}
      />
    </Stack>
  );
}

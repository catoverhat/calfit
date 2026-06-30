import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { AppIcon } from '@/components/ui/app-icon';
import { formatSessionDuration } from '@/components/workouts/session-state';
import { Fonts, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type SessionTimerProps = {
  initialSeconds?: number;
};

export function SessionTimer({ initialSeconds = 0 }: SessionTimerProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(initialSeconds);
  const theme = useTheme();

  useEffect(() => {
    const interval = setInterval(() => setElapsedSeconds((value) => value + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View
      accessible
      accessibilityLabel={`Workout duration ${formatSessionDuration(elapsedSeconds)}`}
      style={styles.timer}>
      <AppIcon color={theme.textSecondary} name="stopwatch" size={15} />
      <ThemedText style={styles.time} themeColor="textSecondary">
        {formatSessionDuration(elapsedSeconds)}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  timer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.one,
  },
  time: {
    ...Typography.xs,
    fontFamily: Fonts.bodyMedium,
    fontVariant: ['tabular-nums'],
  },
});

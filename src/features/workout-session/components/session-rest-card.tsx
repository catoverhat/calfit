import { Pressable, Text, View } from 'react-native';

import { styles } from '../active-workout-session-screen.styles';

export function SessionRestCard({ onAdd, onSkip, seconds }: { onAdd: () => void; onSkip: () => void; seconds: number }) {
  return (
    <View style={styles.restCard}>
      <View style={styles.restRing}>
        <Text style={styles.restLabel}>Rest</Text>
        <Text style={styles.restTime}>{formatTime(seconds)}</Text>
      </View>
      <View style={styles.restActions}>
        <Pressable
          accessibilityLabel="Add thirty seconds to rest"
          accessibilityRole="button"
          onPress={onAdd}
          style={({ pressed }) => [styles.addRestButton, pressed && styles.pressed]}>
          <Text style={styles.addRestText}>+30 Sec</Text>
        </Pressable>
        <Pressable
          accessibilityLabel="Skip rest"
          accessibilityRole="button"
          onPress={onSkip}
          style={({ pressed }) => [styles.skipRestButton, pressed && styles.pressed]}>
          <Text style={styles.skipRestText}>Skip Rest</Text>
        </Pressable>
      </View>
    </View>
  );
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
  const remainder = (seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remainder}`;
}

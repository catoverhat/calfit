import { Pressable, Text, View } from 'react-native';

import { styles } from '../active-workout-session-screen.styles';

export function SessionRestCard() {
  return (
    <View style={styles.restCard}>
      <View style={styles.restRing}>
        <Text style={styles.restLabel}>Rest</Text>
        <Text style={styles.restTime}>00:00</Text>
      </View>
      <View style={styles.restActions}>
        <Pressable
          accessibilityLabel="Add thirty seconds to rest"
          accessibilityRole="button"
          style={({ pressed }) => [styles.addRestButton, pressed && styles.pressed]}>
          <Text style={styles.addRestText}>+30 Sec</Text>
        </Pressable>
        <Pressable
          accessibilityLabel="Skip rest"
          accessibilityRole="button"
          style={({ pressed }) => [styles.skipRestButton, pressed && styles.pressed]}>
          <Text style={styles.skipRestText}>Skip Rest</Text>
        </Pressable>
      </View>
    </View>
  );
}

import { Pressable, Text, View } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import { DesignColors } from '@/theme/tokens';
import { styles } from '../active-workout-session-screen.styles';

export function SessionActions({ disabled, onFinish }: { disabled: boolean; onFinish: () => void }) {
  return (
    <View style={styles.bottomActions}>
      <Pressable
        accessibilityLabel="Finish workout"
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={onFinish}
        style={({ pressed }) => [styles.finishButton, disabled && styles.disabled, pressed && !disabled && styles.finishButtonPressed]}>
        <AppIcon color={DesignColors.onPrimaryContainer} name="check" size={18} />
        <Text style={styles.finishButtonText}>{disabled ? 'Finishing...' : 'Finish Workout'}</Text>
      </Pressable>
    </View>
  );
}

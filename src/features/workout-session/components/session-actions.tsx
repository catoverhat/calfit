import { Pressable, Text, View } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import { DesignColors, SemanticColors } from '@/theme/tokens';
import { styles } from '../active-workout-session-screen.styles';

export function SessionActions({ onFinish }: { onFinish: () => void }) {
  return (
    <View style={styles.bottomActions}>
      <Pressable
        accessibilityLabel="Next exercise"
        accessibilityRole="button"
        style={({ pressed }) => [styles.nextButton, pressed && styles.pressed]}>
        <AppIcon color={SemanticColors.action} name="next" size={18} />
        <Text style={styles.nextButtonText}>Next Exercise</Text>
      </Pressable>
      <Pressable
        accessibilityLabel="Finish workout"
        accessibilityRole="button"
        onPress={onFinish}
        style={({ pressed }) => [styles.finishButton, pressed && styles.finishButtonPressed]}>
        <AppIcon color={DesignColors.onPrimaryContainer} name="check" size={18} />
        <Text style={styles.finishButtonText}>Finish Workout</Text>
      </Pressable>
    </View>
  );
}

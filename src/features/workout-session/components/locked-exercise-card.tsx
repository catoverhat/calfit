import { Text, View } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import { SemanticColors } from '@/theme/tokens';
import { styles } from '../active-workout-session-screen.styles';

export function LockedExerciseCard({ meta, name }: { meta: string; name: string }) {
  return (
    <View style={styles.lockedCard}>
      <View>
        <Text style={styles.lockedTitle}>{name}</Text>
        <Text style={styles.lockedMeta}>{meta}</Text>
      </View>
      <AppIcon color={SemanticColors.textMuted} name="lock" size={22} />
    </View>
  );
}

import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import { MOCK_USER } from '@/fixtures/mock-data';
import { SemanticColors } from '@/theme/tokens';

import { styles } from '../active-workout-session-screen.styles';

export function SessionOverview({ title }: { title: string }) {
  return (
    <>
      <View style={styles.sessionHeader}>
        <View style={styles.sessionIdentity}>
          <Image
            accessibilityLabel={`${MOCK_USER.name}'s profile photo`}
            contentFit="cover"
            source={MOCK_USER.avatarUrl}
            style={styles.avatar}
          />
          <View style={styles.titleBlock}>
            <Text numberOfLines={1} style={styles.sessionTitle}>
              {title}
            </Text>
            <Text style={styles.inProgress}>In Progress</Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <View style={styles.offlineStatus}>
            <AppIcon color={SemanticColors.textPrimary} name="offline" size={13} />
            <Text style={styles.offlineText}>Saved Offline</Text>
          </View>
          <Pressable
            accessibilityLabel="Session timer"
            accessibilityRole="button"
            style={({ pressed }) => [styles.timerButton, pressed && styles.pressed]}>
            <AppIcon color={SemanticColors.action} name="timer" size={20} />
          </Pressable>
        </View>
      </View>

      <View style={styles.timeCard}>
        <View>
          <Text style={styles.smallLabel}>Session Time</Text>
          <Text style={styles.timeValue}>14:22</Text>
        </View>
        <View style={styles.activePill}>
          <View style={styles.activeDot} />
          <Text style={styles.activeText}>Active</Text>
        </View>
      </View>
    </>
  );
}

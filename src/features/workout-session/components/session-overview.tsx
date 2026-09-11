import { Text, View } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import { SemanticColors } from '@/theme/tokens';

import { styles } from '../active-workout-session-screen.styles';

export function SessionOverview({ elapsed, isSaving, title }: { elapsed: string; isSaving: boolean; title: string }) {
  return (
    <>
      <View style={styles.sessionHeader}>
        <View style={styles.sessionIdentity}>
          <View style={styles.avatarFallback}><AppIcon color={SemanticColors.textPrimary} name="profile" size={18} /></View>
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
            <Text style={styles.offlineText}>{isSaving ? 'Saving…' : 'Saved Locally'}</Text>
          </View>
          <View style={styles.timerButton}>
            <AppIcon color={SemanticColors.action} name="timer" size={20} />
          </View>
        </View>
      </View>

      <View style={styles.timeCard}>
        <View>
          <Text style={styles.smallLabel}>Session Time</Text>
          <Text style={styles.timeValue}>{elapsed}</Text>
        </View>
        <View style={styles.activePill}>
          <View style={styles.activeDot} />
          <Text style={styles.activeText}>Active</Text>
        </View>
      </View>
    </>
  );
}

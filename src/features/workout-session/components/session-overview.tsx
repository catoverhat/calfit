import { Text, View } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import { SemanticColors } from '@/theme/tokens';

import { styles } from '../active-workout-session-screen.styles';

export function SessionOverview({
  completedSets,
  elapsed,
  isSaving,
  title,
  totalSets,
}: {
  completedSets: number;
  elapsed: string;
  isSaving: boolean;
  title: string;
  totalSets: number;
}) {
  const progress = totalSets > 0 ? completedSets / totalSets : 0;

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

      <View
        accessibilityLabel={`${completedSets} of ${totalSets} sets completed`}
        accessibilityRole="progressbar"
        accessibilityValue={{ max: totalSets, min: 0, now: completedSets }}
        style={styles.sessionProgressCard}>
        <View style={styles.sessionProgressCopy}>
          <Text style={styles.smallLabel}>Workout Progress</Text>
          <Text style={styles.sessionProgressValue}>
            {completedSets} / {totalSets} sets
          </Text>
        </View>
        <View style={styles.sessionProgressTrack}>
          <View style={[styles.sessionProgressFill, { width: `${progress * 100}%` }]} />
        </View>
      </View>
    </>
  );
}

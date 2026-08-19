import { Pressable, Text, View } from 'react-native';

import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import { DesignColors, SemanticColors } from '@/theme/tokens';

import { styles } from '../offline-sync-states-screen.styles';
type SyncTone = 'online' | 'offline' | 'local' | 'pending' | 'failed';

export type SyncStatus = {
  body: string;
  footer?: string;
  icon: AppIconName;
  progress?: number;
  title: string;
  tone: SyncTone;
};

const toneStyles = {
  failed: {
    border: 'rgba(255, 72, 72, 0.42)',
    icon: '#FF9A92',
    marker: '#FF7A70',
    surface: 'rgba(147, 0, 10, 0.12)',
  },
  local: {
    border: 'rgba(255, 95, 31, 0.34)',
    icon: SemanticColors.action,
    marker: SemanticColors.action,
    surface: 'rgba(255, 95, 31, 0.08)',
  },
  offline: {
    border: 'rgba(200, 198, 197, 0.2)',
    icon: DesignColors.secondary,
    marker: DesignColors.secondary,
    surface: DesignColors.surfaceContainerLow,
  },
  online: {
    border: 'rgba(42, 208, 111, 0.32)',
    icon: DesignColors.success,
    marker: DesignColors.success,
    surface: 'rgba(42, 208, 111, 0.08)',
  },
  pending: {
    border: 'rgba(255, 181, 156, 0.34)',
    icon: DesignColors.primaryFixedDim,
    marker: DesignColors.primaryFixedDim,
    surface: 'rgba(255, 181, 156, 0.08)',
  },
} as const;

export function SyncStatusCard({ status }: { status: SyncStatus }) {
  const tone = toneStyles[status.tone];
  const failed = status.tone === 'failed';

  return (
    <View style={[styles.statusCard, { backgroundColor: tone.surface, borderColor: tone.border }]}>
      <View style={styles.statusHeader}>
        <View style={styles.statusTitleRow}>
          <View style={[styles.statusDot, { backgroundColor: tone.marker }]} />
          <Text style={[styles.statusTitle, { color: tone.icon }]}>{status.title}</Text>
        </View>
        <AppIcon color={tone.icon} name={status.icon} size={22} />
      </View>

      <Text style={styles.statusBody}>{status.body}</Text>

      {failed ? (
        <Pressable
          accessibilityLabel="Retry sync"
          accessibilityRole="button"
          style={({ pressed }) => [styles.retryButton, pressed && styles.pressed]}>
          <AppIcon color={DesignColors.onPrimaryContainer} name="sync" size={14} />
          <Text style={styles.retryText}>Retry Sync</Text>
        </Pressable>
      ) : null}

      {status.progress ? (
        <View style={styles.progressBlock}>
          <View style={styles.progressMeta}>
            <Text style={styles.footerText}>{status.footer}</Text>
            <Text style={styles.footerText}>{status.progress}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${status.progress}%` }]} />
          </View>
        </View>
      ) : status.footer ? (
        <View style={styles.footerRow}>
          <AppIcon color={tone.icon} name={status.tone === 'online' ? 'wifi' : 'history'} size={12} />
          <Text style={[styles.footerText, { color: tone.icon }]}>{status.footer}</Text>
        </View>
      ) : null}

      {failed ? (
        <View style={styles.errorBlock}>
          <AppIcon color="#FF9A92" name="warning" size={20} />
          <View style={styles.errorCopy}>
            <Text style={styles.errorTitle}>Error Code:</Text>
            <Text style={styles.errorCode}>403_HANDSHAKE</Text>
            <Text style={styles.errorDetail}>Authentication Timeout</Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}

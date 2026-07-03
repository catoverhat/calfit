import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Header } from '@/components/header';
import { TabScreen } from '@/components/tab-screen';
import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import { MOCK_USER } from '@/constants/mock-data';
import {
  ComponentTokens,
  DesignColors,
  Fonts,
  MaxContentWidth,
  Radius,
  SemanticColors,
  Spacing,
  Typography,
} from '@/constants/theme';

type SyncTone = 'online' | 'offline' | 'local' | 'pending' | 'failed';

type SyncStatus = {
  body: string;
  footer?: string;
  icon: AppIconName;
  progress?: number;
  title: string;
  tone: SyncTone;
};

const syncStatuses = [
  {
    body: 'The device is fully connected to Kinetic Cloud. All biometric data and workout metrics are being streamed and backed up in real-time.',
    footer: 'Latency: 24ms',
    icon: 'cloud',
    title: 'Online',
    tone: 'online',
  },
  {
    body: 'Network connection lost. The application has switched to local sandbox mode. Training data will be stored on-device until a connection is restored.',
    footer: 'Last sync: 3m ago',
    icon: 'wifiOff',
    title: 'Offline',
    tone: 'offline',
  },
  {
    body: 'Changes detected in the local cache. Your workout progress is safely secured on your phone’s hardware. These changes are awaiting transmission.',
    footer: '8 unsynced packets',
    icon: 'device',
    title: 'Local Save',
    tone: 'local',
  },
  {
    body: 'Synchronizing your performance data with the primary server. Do not close the application or disable network services during this process.',
    footer: 'Uploading...',
    icon: 'sync',
    progress: 53,
    title: 'Sync Pending',
    tone: 'pending',
  },
  {
    body: 'A critical interruption occurred during the data handshake. This is often caused by intermittent Wi-Fi or server-side maintenance. Your data remains safe on-device.',
    icon: 'warning',
    title: 'Sync Failed',
    tone: 'failed',
  },
] satisfies SyncStatus[];

const guidelines = [
  {
    body: 'Kinetic Pulse uses a SQLite-based edge database to ensure no workout data is lost, regardless of connectivity.',
    icon: 'database',
    title: 'Edge Persistence',
    tone: 'local',
  },
  {
    body: 'Only changed data blocks (deltas) are transmitted to reduce battery consumption and data usage during intense training.',
    icon: 'intensity',
    title: 'Differential Sync',
    tone: 'info',
  },
] satisfies {
  body: string;
  icon: AppIconName;
  title: string;
  tone: 'info' | 'local';
}[];

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

export function OfflineSyncStatesScreen() {
  return (
    <TabScreen contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Header
          actionAccessibilityLabel="Sync status"
          actionIcon="cloud"
          actionIconColor={SemanticColors.actionSoft}
          avatarUrl={MOCK_USER.avatarUrl}
          profileName={MOCK_USER.name}
        />

        <View style={styles.headingBlock}>
          <Text style={styles.title}>Sync Engine</Text>
          <Text style={styles.subtitle}>
            Status reference for real-time data persistence and offline capabilities.
          </Text>
        </View>

        <View style={styles.statusList}>
          {syncStatuses.map((status) => (
            <SyncStatusCard key={status.title} status={status} />
          ))}
        </View>

        <View style={styles.guidelinesBlock}>
          <Text style={styles.guidelinesTitle}>System Guidelines</Text>
          <View style={styles.guidelinesList}>
            {guidelines.map((guideline) => (
              <View key={guideline.title} style={styles.guidelineRow}>
                <View
                  style={[
                    styles.guidelineIcon,
                    guideline.tone === 'info' ? styles.guidelineIconInfo : styles.guidelineIconLocal,
                  ]}>
                  <AppIcon
                    color={guideline.tone === 'info' ? SemanticColors.info : SemanticColors.action}
                    name={guideline.icon}
                    size={15}
                  />
                </View>
                <View style={styles.guidelineCopy}>
                  <Text style={styles.guidelineTitle}>{guideline.title}</Text>
                  <Text style={styles.guidelineBody}>{guideline.body}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </TabScreen>
  );
}

function SyncStatusCard({ status }: { status: SyncStatus }) {
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

const styles = StyleSheet.create({
  scrollContent: {
    alignItems: 'center',
    flexGrow: 1,
    paddingBottom: 112,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
  },
  content: {
    gap: Spacing.three,
    maxWidth: Math.min(MaxContentWidth, 430),
    width: '100%',
  },
  headingBlock: {
    gap: Spacing.one,
  },
  title: {
    ...Typography['2xl'],
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.heading,
    lineHeight: 31,
  },
  subtitle: {
    color: DesignColors.primaryFixedDim,
    fontFamily: Fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    maxWidth: 330,
  },
  statusList: {
    gap: Spacing.two,
  },
  statusCard: {
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: ComponentTokens.card.borderWidth,
    gap: Spacing.three,
    padding: Spacing.three,
  },
  statusHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.two,
  },
  statusDot: {
    borderRadius: Radius.full,
    height: 10,
    width: 10,
  },
  statusTitle: {
    ...Typography.lg,
    fontFamily: Fonts.heading,
    lineHeight: 24,
  },
  statusBody: {
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 19,
  },
  footerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.one,
  },
  footerText: {
    color: SemanticColors.textSecondary,
    fontFamily: Fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 0.5,
    lineHeight: 14,
    textTransform: 'uppercase',
  },
  retryButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#E2231A',
    borderCurve: 'continuous',
    borderRadius: Radius.sm,
    flexDirection: 'row',
    gap: Spacing.one,
    minHeight: 36,
    paddingHorizontal: Spacing.three,
  },
  retryText: {
    color: DesignColors.onPrimaryContainer,
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 0.5,
    lineHeight: 15,
    textTransform: 'uppercase',
  },
  progressBlock: {
    gap: Spacing.one,
  },
  progressMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressTrack: {
    backgroundColor: DesignColors.surfaceContainerHighest,
    borderRadius: Radius.full,
    height: 5,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: DesignColors.primaryFixedDim,
    borderRadius: Radius.full,
    height: '100%',
  },
  errorBlock: {
    alignItems: 'center',
    backgroundColor: DesignColors.surfaceContainerLowest,
    borderColor: 'rgba(255, 72, 72, 0.28)',
    borderCurve: 'continuous',
    borderRadius: Radius.sm,
    borderWidth: 1,
    flexDirection: 'row',
    gap: Spacing.two,
    padding: Spacing.two,
  },
  errorCopy: {
    flex: 1,
  },
  errorTitle: {
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    lineHeight: 14,
  },
  errorCode: {
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
    letterSpacing: 0.6,
    lineHeight: 16,
  },
  errorDetail: {
    color: SemanticColors.textSecondary,
    fontFamily: Fonts.bodyMedium,
    fontSize: 11,
    lineHeight: 15,
  },
  guidelinesBlock: {
    borderTopColor: SemanticColors.border,
    borderTopWidth: 1,
    gap: Spacing.two,
    paddingTop: Spacing.three,
  },
  guidelinesTitle: {
    ...Typography.lg,
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.heading,
    lineHeight: 24,
  },
  guidelinesList: {
    gap: Spacing.two,
  },
  guidelineRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  guidelineIcon: {
    alignItems: 'center',
    borderCurve: 'continuous',
    borderRadius: Radius.sm,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  guidelineIconInfo: {
    backgroundColor: 'rgba(141, 205, 255, 0.12)',
  },
  guidelineIconLocal: {
    backgroundColor: 'rgba(255, 95, 31, 0.12)',
  },
  guidelineCopy: {
    flex: 1,
    gap: Spacing.half,
  },
  guidelineTitle: {
    color: SemanticColors.textPrimary,
    fontFamily: Fonts.bodyBold,
    fontSize: 13,
    lineHeight: 17,
  },
  guidelineBody: {
    color: SemanticColors.textSecondary,
    fontFamily: Fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 17,
  },
  pressed: {
    opacity: 0.72,
    transform: [{ scale: 0.99 }],
  },
});

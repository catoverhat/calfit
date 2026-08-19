import { styles } from './offline-sync-states-screen.styles';
import { Text, View } from 'react-native';

import { Header } from '@/components/layout/header';
import { TabScreen } from '@/components/layout/tab-screen';
import { MOCK_USER } from '@/fixtures/mock-data';
import { SemanticColors } from '@/theme/tokens';
import { SyncStatusCard, type SyncStatus } from './components/sync-status-card';
import { SyncGuidelines, type SyncGuideline } from './components/sync-guidelines';

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
] satisfies SyncGuideline[];

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

        <SyncGuidelines guidelines={guidelines} />
      </View>
    </TabScreen>
  );
}

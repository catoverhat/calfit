import { useAppTheme } from '@/theme/app-theme-provider';
import { Pressable, Text, View } from 'react-native';

import { TabScreen } from '@/components/layout/tab-screen';
import { AppIcon } from '@/components/ui/app-icon';

import { useStyles } from './local-storage-status-screen.styles';
import { useLocalStorageStatus } from './use-local-storage-status';

export function LocalStorageStatusScreen() {
  const styles = useStyles();
  const { DesignColors, SemanticColors } = useAppTheme();
  const { error, isLoading, ready, retry } = useLocalStorageStatus();
  return <TabScreen contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}><View style={styles.content}><View style={styles.headingBlock}><Text style={styles.title}>Local Data</Text><Text style={styles.subtitle}>Your workout and measurement data is stored in this installation&apos;s SQLite database.</Text></View><View style={[styles.statusCard, ready ? styles.readyCard : styles.errorCard]}><View style={styles.statusHeader}><View style={styles.statusTitleRow}><View style={[styles.statusDot, { backgroundColor: ready ? DesignColors.success : isLoading ? DesignColors.primaryFixedDim : DesignColors.error }]} /><Text style={styles.statusTitle}>{isLoading ? 'Checking storage' : ready ? 'Storage ready' : 'Storage unavailable'}</Text></View><AppIcon color={ready ? DesignColors.success : SemanticColors.actionSoft} name="database" size={22} /></View><Text style={styles.statusBody}>{isLoading ? 'Opening and validating the local database.' : ready ? 'Local reads and writes are available. Data remains on this device or browser unless a future sync service is configured.' : error ?? 'The local database could not be opened.'}</Text>{!ready && !isLoading ? <Pressable accessibilityLabel="Retry local storage" accessibilityRole="button" onPress={retry} style={({ pressed }) => [styles.retryButton, pressed && styles.pressed]}><AppIcon color={DesignColors.onPrimaryContainer} name="sync" size={14} /><Text style={styles.retryText}>Retry</Text></Pressable> : null}</View><View style={styles.guidelinesBlock}><Text style={styles.guidelinesTitle}>Storage behavior</Text><InfoRow icon="device" title="Installation local" body="Native data remains on this device. Web data remains in this browser profile." /><InfoRow icon="offline" title="Works offline" body="Progress features read and write SQLite without requiring a network connection." /><InfoRow icon="cloud" title="Cloud sync not configured" body="No remote backup or synchronization is currently performed." /></View></View></TabScreen>;
}

function InfoRow({ body, icon, title }: { body: string; icon: 'device' | 'offline' | 'cloud'; title: string }) {
  const styles = useStyles();
  const { SemanticColors } = useAppTheme();
  return <View style={styles.guidelineRow}><View style={styles.guidelineIcon}><AppIcon color={SemanticColors.actionSoft} name={icon} size={16} /></View><View style={styles.guidelineCopy}><Text style={styles.guidelineTitle}>{title}</Text><Text style={styles.guidelineBody}>{body}</Text></View></View>;
}

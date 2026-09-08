import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import { DesignColors, SemanticColors } from '@/theme/tokens';
import type { WorkoutSummaryData } from '../progress.viewmodel';
import { styles } from '../workout-summary-screen.styles';

export function WorkoutSummaryHero({ summary }: { summary: WorkoutSummaryData }) {
  const completed = summary.status === 'completed';
  return <View style={styles.heroBlock}><View style={styles.endedPill}><AppIcon color={SemanticColors.action} name={completed ? 'trophy' : 'info'} size={14} /><Text style={styles.endedText}>{summary.statusLabel}</Text></View><Text style={styles.title}>{summary.title}</Text><View style={styles.checkRing}><AppIcon color={SemanticColors.action} name={completed ? 'check' : 'history'} size={26} /></View><Text style={styles.subtitle}>{completed ? 'Workout saved locally.' : 'Current locally saved session state.'}</Text></View>;
}

export function WorkoutSummaryStats({ summary }: { summary: WorkoutSummaryData }) {
  const stats = [
    { icon: 'timer', label: 'Duration', value: summary.duration },
    { icon: 'strength', label: 'Exercises', value: `${summary.exerciseCount}` },
    { icon: 'sets', label: 'Total Sets', value: `${summary.setCount}` },
    { icon: 'volume', label: 'Completed Volume', value: summary.volume },
  ] satisfies { icon: AppIconName; label: string; value: string }[];
  return <View style={styles.statsGrid}>{stats.map((stat) => <View key={stat.label} style={styles.statCard}><AppIcon color={SemanticColors.action} name={stat.icon} size={18} /><View style={styles.statCopy}><Text style={styles.statLabel}>{stat.label}</Text><Text style={styles.statValue}>{stat.value}</Text></View></View>)}</View>;
}

export function WorkoutSummaryActions() {
  return <View style={styles.actions}><SummaryLink href="/(tabs)" icon="check" label="Done" primary /><SummaryLink href="/progress/history" icon="history" label="View History" /></View>;
}

function SummaryLink({ href, icon, label, primary = false }: { href: '/(tabs)' | '/progress/history'; icon: AppIconName; label: string; primary?: boolean }) {
  return <Link href={href} replace={primary} push={!primary} asChild><Pressable accessibilityLabel={label} accessibilityRole="button">{({ pressed }) => <View style={[primary ? styles.saveButton : styles.historyButton, pressed && (primary ? styles.saveButtonPressed : styles.pressed)]}><AppIcon color={primary ? DesignColors.onPrimaryContainer : SemanticColors.action} name={icon} size={17} /><Text style={primary ? styles.saveText : styles.historyText}>{label}</Text></View>}</Pressable></Link>;
}

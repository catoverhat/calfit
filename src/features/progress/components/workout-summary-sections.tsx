import { useAppTheme } from '@/theme/app-theme-provider';
import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { AppIcon, type AppIconName } from '@/components/ui/app-icon';

import type { WorkoutSummaryData } from '../progress.viewmodel';
import { useStyles } from '../workout-summary-screen.styles';

export function WorkoutSummaryHero({ summary }: { summary: WorkoutSummaryData }) {
  const styles = useStyles();
  const { SemanticColors } = useAppTheme();
  const completed = summary.status === 'completed';
  const subtitle = !completed
    ? 'Current locally saved session state.'
    : summary.recordCount > 0
      ? `Workout saved with ${summary.recordCount} new personal ${summary.recordCount === 1 ? 'record' : 'records'}.`
      : 'Workout saved locally.';
  return (
    <View style={styles.heroBlock}>
      <View style={styles.checkRing}>
        <AppIcon color={SemanticColors.action} name={completed ? 'check' : 'history'} size={28} />
      </View>
      <View style={styles.endedPill}>
        <AppIcon color={SemanticColors.actionSoft} name={completed ? 'trophy' : 'info'} size={14} />
        <Text style={styles.endedText}>{summary.statusLabel}</Text>
      </View>
      <Text accessibilityRole="header" style={styles.title}>{summary.title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

export function WorkoutSummaryStats({ summary }: { summary: WorkoutSummaryData }) {
  const styles = useStyles();
  const { SemanticColors } = useAppTheme();
  const stats = [
    { icon: 'timer', label: 'Duration', value: summary.duration },
    { icon: 'sets', label: 'Sets logged', value: `${summary.completedSetCount} / ${summary.setCount}` },
    { icon: 'volume', label: 'Volume', value: summary.volume },
    { icon: 'trophy', label: 'Personal records', value: `${summary.recordCount}` },
  ] satisfies { icon: AppIconName; label: string; value: string }[];
  return (
    <View style={styles.statsGrid}>
      {stats.map((stat) => (
        <View accessible accessibilityLabel={`${stat.label}: ${stat.value}`} key={stat.label} style={styles.statCard}>
          <AppIcon color={SemanticColors.actionSoft} name={stat.icon} size={18} />
          <Text style={styles.statValue}>{stat.value}</Text>
          <Text style={styles.statLabel}>{stat.label}</Text>
        </View>
      ))}
    </View>
  );
}

export function WorkoutSummaryExercises({ summary }: { summary: WorkoutSummaryData }) {
  const styles = useStyles();
  const { ComponentTokens } = useAppTheme();
  return (
    <View style={styles.exerciseCard}>
      <Text accessibilityRole="header" style={styles.sectionTitle}>
        Exercises · {summary.exerciseCount}
      </Text>
      {summary.exercises.map((exercise, index) => (
        <View
          accessible
          accessibilityLabel={`${exercise.name}. ${exercise.sets} logged.${exercise.best ? ` Best set ${exercise.best}.` : ''}${exercise.isRecord ? ' New personal record.' : ''}`}
          key={exercise.id}
          style={[styles.exerciseRow, index > 0 && styles.exerciseRowDivider]}
        >
          <View style={styles.exerciseCopy}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <Text style={styles.exerciseMeta}>{exercise.sets}</Text>
          </View>
          <View style={styles.exerciseResult}>
            {exercise.isRecord ? (
              <View style={[styles.prChip, { backgroundColor: ComponentTokens.chip.prBackground }]}>
                <Text style={[styles.prChipText, { color: ComponentTokens.chip.prText }]}>PR</Text>
              </View>
            ) : null}
            <Text style={styles.exerciseBest}>{exercise.best ?? '—'}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

export function WorkoutSummaryActions() {
  const styles = useStyles();
  return <View style={styles.actions}><SummaryLink href="/(tabs)" icon="check" label="Done" primary /><SummaryLink href="/progress/history" icon="history" label="View history" /></View>;
}

function SummaryLink({ href, icon, label, primary = false }: { href: '/(tabs)' | '/progress/history'; icon: AppIconName; label: string; primary?: boolean }) {
  const styles = useStyles();
  const { SemanticColors } = useAppTheme();
  return <Link href={href} replace={primary} push={!primary} asChild><Pressable accessibilityLabel={label} accessibilityRole="button">{({ pressed }) => <View style={[primary ? styles.saveButton : styles.historyButton, pressed && styles.pressed]}><AppIcon color={primary ? SemanticColors.actionText : SemanticColors.actionSoft} name={icon} size={18} /><Text style={primary ? styles.saveText : styles.historyText}>{label}</Text></View>}</Pressable></Link>;
}

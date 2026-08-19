import { Link } from 'expo-router';
import { Pressable, View } from 'react-native';

import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import { ThemedText } from '@/components/ui/themed-text';
import { SemanticColors } from '@/theme/tokens';

import { styles } from '../routine-list-screen.styles';

export type RoutineSummary = {
  description: string;
  icon: AppIconName;
  id: string;
  lastCompleted: string;
  schedule: readonly string[];
  statLabel: 'Exercises' | 'Intervals';
  statValue: number;
  title: string;
};

export function RoutineCard({ routine }: { routine: RoutineSummary }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardTopRow}>
        <View style={styles.iconTile}>
          <AppIcon color={SemanticColors.action} name={routine.icon} size={19} />
        </View>

        <View style={styles.actionRow}>
          <Link href={{ pathname: '/routines/[id]/edit', params: { id: routine.id } }} asChild>
            <Pressable
              accessibilityLabel={`Edit ${routine.title}`}
              accessibilityRole="button"
              hitSlop={8}
              style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
              <AppIcon color={SemanticColors.actionSoft} name="edit" size={17} />
            </Pressable>
          </Link>

          <Link href={{ pathname: '/routines/[id]', params: { id: routine.id } }} asChild>
            <Pressable
              accessibilityLabel={`Open ${routine.title}`}
              accessibilityRole="button"
              hitSlop={8}
              style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
              <AppIcon color={SemanticColors.actionSoft} name="open" size={17} />
            </Pressable>
          </Link>
        </View>
      </View>

      <View style={styles.cardCopy}>
        <ThemedText style={styles.cardTitle}>{routine.title}</ThemedText>
        <ThemedText style={styles.cardDescription}>{routine.description}</ThemedText>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metricBlock}>
          <ThemedText style={styles.metaLabel}>{routine.statLabel}</ThemedText>
          <ThemedText style={styles.metricValue}>{routine.statValue}</ThemedText>
        </View>

        <View style={styles.metricBlock}>
          <ThemedText style={styles.metaLabel}>Schedule</ThemedText>
          <View style={styles.scheduleRow}>
            {routine.schedule.map((day) => (
              <View key={day} style={styles.scheduleChip}>
                <ThemedText style={styles.scheduleText}>{day}</ThemedText>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.divider} />
      <ThemedText style={styles.lastCompleted}>{routine.lastCompleted}</ThemedText>
    </View>
  );
}

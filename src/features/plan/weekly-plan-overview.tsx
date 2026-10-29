import { View } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import { ThemedText } from '@/components/ui/themed-text';
import { useAppTheme } from '@/theme/app-theme-provider';

import { useStyles } from './weekly-plan-screen.styles';
import type { WorkoutPlanDay } from './weekly-plan.viewmodel';

export function WeeklyPlanOverview({ days }: { days: WorkoutPlanDay[] }) {
  const styles = useStyles();
  const { SemanticColors } = useAppTheme();
  const scheduled = days.filter((day) => day.entryId !== null).length;
  const completed = days.filter((day) => day.state === 'completed').length;
  const rest = days.length - scheduled;

  return (
    <View style={styles.overviewCard}>
      <View style={styles.overviewStats}>
        {[
          { label: 'Scheduled', value: scheduled },
          { label: 'Completed', value: completed },
          { label: 'Rest days', value: rest },
        ].map(({ label, value }) => (
          <View accessible accessibilityLabel={`${value} ${label.toLowerCase()}`} key={label} style={styles.overviewStat}>
            <ThemedText style={[styles.overviewValue, label === 'Completed' && styles.completedValue]}>{value}</ThemedText>
            <ThemedText style={styles.overviewLabel}>{label}</ThemedText>
          </View>
        ))}
      </View>
      <View style={styles.overviewHint}>
        <AppIcon color={SemanticColors.textMuted} name={scheduled === 0 ? 'calendar' : 'info'} size={16} />
        <ThemedText style={styles.overviewHintText}>
          {scheduled === 0
            ? 'Choose a day below to plan a workout. Leave days open for recovery.'
            : 'Plans can change. Move or swap upcoming workouts to fit your week.'}
        </ThemedText>
      </View>
    </View>
  );
}

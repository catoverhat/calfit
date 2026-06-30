import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import { Fonts, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type StatCardProps = {
  accentColor: string;
  icon: AppIconName;
  label: string;
  progress?: number;
  suffix: string;
  value: string;
};

export function StatCard({
  accentColor,
  icon,
  label,
  progress = 0,
  suffix,
  value,
}: StatCardProps) {
  const theme = useTheme();
  const progressWidth = `${Math.min(Math.max(progress, 0), 1) * 100}%` as const;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.backgroundElement,
          borderColor: theme.border,
        },
      ]}>
      <View style={styles.labelRow}>
        <ThemedText style={styles.label} themeColor="textSecondary">
          {label}
        </ThemedText>
        <AppIcon color={accentColor} name={icon} size={17} />
      </View>
      <View style={styles.valueRow}>
        <ThemedText style={styles.value}>{value}</ThemedText>
        <ThemedText style={styles.suffix} themeColor="textSecondary">
          {suffix}
        </ThemedText>
      </View>
      <View style={[styles.track, { backgroundColor: theme.border }]}>
        <View style={[styles.progress, { backgroundColor: accentColor, width: progressWidth }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderCurve: 'continuous',
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    gap: Spacing.two,
    minHeight: 142,
    padding: Spacing.three,
  },
  labelRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: Spacing.two,
    justifyContent: 'space-between',
  },
  label: {
    ...Typography.xs,
    flex: 1,
    fontFamily: Fonts.bodySemiBold,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  valueRow: {
    alignItems: 'baseline',
    flexDirection: 'row',
    flex: 1,
    gap: 3,
  },
  value: {
    ...Typography['3xl'],
    fontFamily: Fonts.heading,
    fontVariant: ['tabular-nums'],
  },
  suffix: {
    ...Typography.xs,
    fontFamily: Fonts.bodySemiBold,
  },
  track: {
    borderRadius: 3,
    height: 6,
    overflow: 'hidden',
  },
  progress: {
    borderRadius: 3,
    height: '100%',
  },
});

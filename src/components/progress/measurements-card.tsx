import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import { Fonts, Palette, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Measurement = {
  change?: string;
  icon: AppIconName;
  id: string;
  label: string;
  value: string;
};

type MeasurementsCardProps = {
  measurements: readonly Measurement[];
};

export function MeasurementsCard({ measurements }: MeasurementsCardProps) {
  const theme = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Measurements</ThemedText>
        <Pressable
          accessibilityLabel="Measurement history is not available yet"
          accessibilityRole="button"
          accessibilityState={{ disabled: true }}
          disabled
          style={styles.disabledAction}>
          <ThemedText style={[styles.history, { color: theme.primary }]}>History</ThemedText>
        </Pressable>
      </View>

      <View style={styles.list}>
        {measurements.map((measurement) => (
          <View
            key={measurement.id}
            style={[styles.measurement, { backgroundColor: theme.background, borderColor: theme.border }]}>
            <View style={[styles.measurementIcon, { backgroundColor: theme.backgroundElement }]}>
              <AppIcon color={theme.textSecondary} name={measurement.icon} size={16} />
            </View>
            <View style={styles.copy}>
              <ThemedText selectable style={styles.label}>{measurement.label}</ThemedText>
              <View style={styles.valueRow}>
                <ThemedText selectable style={styles.value} themeColor="textSecondary">
                  {measurement.value}
                </ThemedText>
                {measurement.change ? (
                  <ThemedText selectable style={styles.change}>{measurement.change}</ThemedText>
                ) : null}
              </View>
            </View>
            <Pressable
              accessibilityLabel={`Editing ${measurement.label} is not available yet`}
              accessibilityRole="button"
              accessibilityState={{ disabled: true }}
              disabled
              style={[styles.editButton, styles.disabledAction, { backgroundColor: theme.border }]}>
              <AppIcon color={theme.textSecondary} name="edit" size={13} />
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderCurve: 'continuous',
    borderRadius: 12,
    borderWidth: 1,
    boxShadow: '0 2px 10px rgba(26, 28, 35, 0.04)',
    gap: Spacing.three,
    padding: Spacing.three,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    ...Typography.lg,
    fontFamily: Fonts.heading,
  },
  history: {
    ...Typography.xs,
    fontFamily: Fonts.bodySemiBold,
  },
  disabledAction: {
    opacity: 0.58,
  },
  list: {
    gap: Spacing.two,
  },
  measurement: {
    alignItems: 'center',
    borderCurve: 'continuous',
    borderRadius: 9,
    borderWidth: 1,
    flexDirection: 'row',
    gap: Spacing.two,
    minHeight: 66,
    padding: Spacing.two,
  },
  measurementIcon: {
    alignItems: 'center',
    borderRadius: 6,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  copy: {
    flex: 1,
  },
  label: {
    ...Typography.sm,
    fontFamily: Fonts.bodySemiBold,
  },
  valueRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.two,
  },
  value: {
    ...Typography.xs,
    fontFamily: Fonts.body,
    fontVariant: ['tabular-nums'],
  },
  change: {
    ...Typography.xs,
    color: Palette.tertiary[600],
    fontFamily: Fonts.bodyMedium,
    fontVariant: ['tabular-nums'],
  },
  editButton: {
    alignItems: 'center',
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
});

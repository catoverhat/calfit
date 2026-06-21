import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Fonts, Palette, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type HeatmapDay = {
  date: string;
  intensity: number;
};

type ActivityHeatmapCardProps = {
  days: readonly HeatmapDay[];
  month: string;
};

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const;

export function ActivityHeatmapCard({ days, month }: ActivityHeatmapCardProps) {
  const theme = useTheme();
  const intensityColors = [
    theme.background,
    Palette.primary[200],
    Palette.primary[400],
    Palette.primary[700],
  ];

  return (
    <View style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
      <ThemedText style={styles.title}>Activity Heatmap</ThemedText>
      <ThemedText selectable style={styles.month} themeColor="textSecondary">
        {month}
      </ThemedText>

      <View style={styles.weekdays}>
        {WEEKDAYS.map((weekday, index) => (
          <ThemedText
            key={`${weekday}-${index}`}
            style={styles.weekday}
            themeColor="textSecondary">
            {weekday}
          </ThemedText>
        ))}
      </View>

      <View accessibilityLabel={`${month} activity heatmap`} style={styles.grid}>
        {days.map((day) => (
          <View
            key={day.date}
            accessible
            accessibilityLabel={`${day.date}, activity intensity ${day.intensity} of 3`}
            style={[
              styles.cell,
              {
                backgroundColor: intensityColors[Math.min(Math.max(day.intensity, 0), 3)],
                borderColor: theme.border,
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.legend}>
        <ThemedText style={styles.legendText} themeColor="textSecondary">Less</ThemedText>
        {intensityColors.map((color, index) => (
          <View
            key={color}
            style={[styles.legendCell, { backgroundColor: color, borderColor: theme.border }]}
          />
        ))}
        <ThemedText style={styles.legendText} themeColor="textSecondary">More</ThemedText>
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
    padding: Spacing.three,
  },
  title: {
    ...Typography.lg,
    fontFamily: Fonts.heading,
  },
  month: {
    ...Typography.sm,
    fontFamily: Fonts.body,
    paddingBottom: Spacing.three,
  },
  weekdays: {
    flexDirection: 'row',
    gap: Spacing.one,
    paddingBottom: Spacing.one,
  },
  weekday: {
    ...Typography.xs,
    flex: 1,
    fontFamily: Fonts.bodyMedium,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one,
  },
  cell: {
    aspectRatio: 1,
    borderCurve: 'continuous',
    borderRadius: 2,
    borderWidth: 1,
    flexBasis: '12%',
    flexGrow: 1,
    maxWidth: '13.2%',
  },
  legend: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.one,
    justifyContent: 'flex-end',
    paddingTop: Spacing.three,
  },
  legendCell: {
    borderRadius: 1,
    borderWidth: 1,
    height: 10,
    width: 10,
  },
  legendText: {
    ...Typography.xs,
    fontFamily: Fonts.body,
  },
});

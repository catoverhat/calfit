import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient,
  Line,
  Path,
  Stop,
  Text as SvgText,
} from 'react-native-svg';

import { createSmoothPath, getChartPoints } from '@/components/progress/chart-utils';
import { ThemedText } from '@/components/themed-text';
import type { WeightTimeframe } from '@/constants/mock-data';
import { Fonts, Palette, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type WeightSeries = {
  axisLabels: readonly string[];
  values: readonly number[];
};

type WeightTrendsCardProps = {
  series: Record<WeightTimeframe, WeightSeries>;
};

const TIMEFRAMES: WeightTimeframe[] = ['7W', '1M', '3M'];
const CHART = { height: 140, left: 34, top: 12, width: 286 } as const;
const Y_AXIS = [185, 180, 175, 170] as const;

export function WeightTrendsCard({ series }: WeightTrendsCardProps) {
  const [timeframe, setTimeframe] = useState<WeightTimeframe>('7W');
  const theme = useTheme();
  const selectedSeries = series[timeframe];
  const points = getChartPoints(selectedSeries.values, {
    height: CHART.height,
    max: 185,
    min: 160,
    width: CHART.width,
  }).map((point) => ({ x: point.x + CHART.left, y: point.y + CHART.top }));
  const linePath = createSmoothPath(points);
  const firstPoint = points[0];
  const lastPoint = points.at(-1);
  const baseline = CHART.top + CHART.height;
  const areaPath = firstPoint && lastPoint
    ? `${linePath} L ${lastPoint.x} ${baseline} L ${firstPoint.x} ${baseline} Z`
    : '';

  return (
    <View style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Weight Trends</ThemedText>
        <View accessibilityRole="tablist" style={styles.filters}>
          {TIMEFRAMES.map((option) => {
            const selected = option === timeframe;

            return (
              <Pressable
                key={option}
                accessibilityRole="tab"
                accessibilityState={{ selected }}
                onPress={() => setTimeframe(option)}
                style={[
                  styles.filter,
                  { backgroundColor: selected ? theme.backgroundSelected : theme.background },
                ]}>
                <ThemedText
                  style={[styles.filterText, selected && { color: theme.primary }]}>
                  {option}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View
        accessible
        accessibilityLabel={`${timeframe} weight trend ending at ${lastPoint ? selectedSeries.values.at(-1) : 0} pounds`}
        accessibilityRole="image">
        <Svg height={190} viewBox="0 0 332 190" width="100%">
          <Defs>
            <LinearGradient id="weightArea" x1="0" x2="0" y1="0" y2="1">
              <Stop offset="0" stopColor={theme.primary} stopOpacity={0.2} />
              <Stop offset="1" stopColor={theme.primary} stopOpacity={0.02} />
            </LinearGradient>
          </Defs>

          {Y_AXIS.map((value) => {
            const y = CHART.top + ((185 - value) / 25) * CHART.height;

            return (
              <G key={value}>
                <Line
                  stroke={theme.border}
                  strokeWidth={1}
                  x1={CHART.left}
                  x2={CHART.left + CHART.width}
                  y1={y}
                  y2={y}
                />
                <SvgText
                  fill={theme.textSecondary}
                  fontFamily={Fonts.body}
                  fontSize={8}
                  x={0}
                  y={y + 3}>
                  {value} lbs
                </SvgText>
              </G>
            );
          })}

          <Path d={areaPath} fill="url(#weightArea)" />
          <Path d={linePath} fill="none" stroke={Palette.primary[700]} strokeWidth={4} />
          {lastPoint ? (
            <Circle
              cx={lastPoint.x}
              cy={lastPoint.y}
              fill={theme.backgroundElement}
              r={6}
              stroke={Palette.primary[700]}
              strokeWidth={3}
            />
          ) : null}

          {selectedSeries.axisLabels.map((label, index) => (
            <SvgText
              key={label}
              fill={theme.textSecondary}
              fontFamily={Fonts.body}
              fontSize={8}
              textAnchor={index === 0 ? 'start' : index === selectedSeries.axisLabels.length - 1 ? 'end' : 'middle'}
              x={CHART.left + (index / (selectedSeries.axisLabels.length - 1)) * CHART.width}
              y={181}>
              {label}
            </SvgText>
          ))}
        </Svg>
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
    gap: Spacing.two,
    padding: Spacing.three,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.two,
    justifyContent: 'space-between',
  },
  title: {
    ...Typography.lg,
    flex: 1,
    fontFamily: Fonts.heading,
  },
  filters: {
    flexDirection: 'row',
    gap: Spacing.one,
  },
  filter: {
    alignItems: 'center',
    borderRadius: 14,
    justifyContent: 'center',
    minHeight: 28,
    minWidth: 38,
    paddingHorizontal: Spacing.two,
  },
  filterText: {
    ...Typography.xs,
    fontFamily: Fonts.bodySemiBold,
  },
});

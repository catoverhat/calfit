import { useState } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Radius, SemanticColors } from '@/theme/tokens';
import { layoutTrendSegment, type LineSegment } from '../trend-chart';

type LinePlotProps = {
  accessibilityLabel?: string;
  segments: readonly LineSegment[];
  style?: StyleProp<ViewStyle>;
};

export function LinePlot({ accessibilityLabel, segments, style }: LinePlotProps) {
  const [size, setSize] = useState({ height: 0, width: 0 });
  const points = segments.length ? [
    { x: segments[0].x1, y: segments[0].y1 },
    ...segments.map((segment) => ({ x: segment.x2, y: segment.y2 })),
  ] : [];

  return (
    <View
      accessible={Boolean(accessibilityLabel)}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="image"
      onLayout={({ nativeEvent: { layout } }) => setSize({ width: layout.width, height: layout.height })}
      style={[styles.plot, style]}>
      {[0.1, 0.5, 0.9].map((position) => (
        <View key={position} style={[styles.gridLine, { top: `${position * 100}%` }]} />
      ))}
      {size.width > 0 && segments.map((segment, index) => {
        const geometry = layoutTrendSegment(segment, size.width, size.height);
        return (
          <View
            key={index}
            style={[
              styles.segment,
              {
                left: geometry.left,
                top: geometry.top,
                transform: [{ rotate: geometry.rotate }],
                width: geometry.width,
              },
            ]}
          />
        );
      })}
      {size.width > 0 && points.map((point, index) => (
        <View key={index} style={[styles.point, { left: point.x * size.width - 3, top: point.y * size.height - 3 }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  plot: { minHeight: 96, overflow: 'hidden', position: 'relative' },
  gridLine: { backgroundColor: SemanticColors.border, height: 1, left: 0, position: 'absolute', right: 0 },
  segment: {
    backgroundColor: SemanticColors.action,
    borderRadius: Radius.full,
    height: 2,
    position: 'absolute',
  },
  point: { backgroundColor: SemanticColors.action, borderRadius: Radius.full, height: 6, position: 'absolute', width: 6 },
});

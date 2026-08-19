import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Radius, SemanticColors } from '@/theme/tokens';

export type LineSegment = {
  left: `${number}%`;
  rotate: `${number}deg`;
  top: `${number}%`;
  width: number;
};

type LinePlotProps = {
  segments: readonly LineSegment[];
  style?: StyleProp<ViewStyle>;
};

export function LinePlot({ segments, style }: LinePlotProps) {
  return (
    <View style={[styles.plot, style]}>
      {segments.map((segment, index) => (
        <View
          key={`${segment.left}-${index}`}
          style={[
            styles.segment,
            {
              left: segment.left,
              top: segment.top,
              transform: [{ rotate: segment.rotate }],
              width: segment.width,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  plot: {
    position: 'relative',
  },
  segment: {
    backgroundColor: SemanticColors.action,
    borderRadius: Radius.full,
    height: 2,
    position: 'absolute',
  },
});

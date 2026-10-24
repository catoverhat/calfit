export type LineSegment = {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
};

/** Normalized points keep every segment connected as the chart resizes. */
export function createTrendSegments(values: readonly number[]): LineSegment[] {
  if (values.length < 2) return [];

  const min = Math.min(...values);
  const range = Math.max(...values) - min;
  const y = (value: number) => range === 0 ? 0.5 : 0.9 - ((value - min) / range) * 0.8;
  const x = (index: number) => 0.04 + (index / (values.length - 1)) * 0.92;

  return values.slice(0, -1).map((value, index) => ({
    x1: x(index),
    x2: x(index + 1),
    y1: y(value),
    y2: y(values[index + 1]),
  }));
}

export function layoutTrendSegment(segment: LineSegment, width: number, height: number) {
  const dx = (segment.x2 - segment.x1) * width;
  const dy = (segment.y2 - segment.y1) * height;
  const length = Math.hypot(dx, dy);

  return {
    left: ((segment.x1 + segment.x2) / 2) * width - length / 2,
    top: ((segment.y1 + segment.y2) / 2) * height - 1,
    width: length,
    rotate: `${Math.atan2(dy, dx) * 180 / Math.PI}deg` as `${number}deg`,
  };
}

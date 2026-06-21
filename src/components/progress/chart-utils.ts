export type ChartPoint = {
  x: number;
  y: number;
};

type ChartBounds = {
  height: number;
  max: number;
  min: number;
  width: number;
};

export function getChartPoints(
  values: readonly number[],
  { height, max, min, width }: ChartBounds,
): ChartPoint[] {
  if (values.length === 0) return [];

  const range = Math.max(max - min, 1);
  const lastIndex = Math.max(values.length - 1, 1);

  return values.map((value, index) => ({
    x: (index / lastIndex) * width,
    y: height - ((Math.min(Math.max(value, min), max) - min) / range) * height,
  }));
}

export function createSmoothPath(points: readonly ChartPoint[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  return points.slice(1).reduce((path, point, index) => {
    const previous = points[index];
    const midpointX = (previous.x + point.x) / 2;

    return `${path} C ${midpointX} ${previous.y}, ${midpointX} ${point.y}, ${point.x} ${point.y}`;
  }, `M ${points[0].x} ${points[0].y}`);
}

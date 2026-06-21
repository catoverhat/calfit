/// <reference types="jest" />

import { createSmoothPath, getChartPoints } from './chart-utils';

describe('progress chart utilities', () => {
  it('maps values into the chart bounds', () => {
    expect(
      getChartPoints([170, 175, 180], { height: 100, max: 180, min: 170, width: 200 }),
    ).toEqual([
      { x: 0, y: 100 },
      { x: 100, y: 50 },
      { x: 200, y: 0 },
    ]);
  });

  it('creates a smooth path that reaches the final point', () => {
    const path = createSmoothPath([
      { x: 0, y: 100 },
      { x: 50, y: 75 },
      { x: 100, y: 25 },
    ]);

    expect(path).toBe('M 0 100 C 25 100, 25 75, 50 75 C 75 75, 75 25, 100 25');
  });
});

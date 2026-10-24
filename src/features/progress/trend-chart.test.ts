/// <reference types="jest" />

import { createTrendSegments, layoutTrendSegment } from './trend-chart';

describe('responsive trend charts', () => {
  it('requires two values and draws constant measurements as a centered line', () => {
    expect(createTrendSegments([])).toEqual([]);
    expect(createTrendSegments([80])).toEqual([]);
    const [segment] = createTrendSegments([80, 80]);
    expect(segment).toMatchObject({ y1: 0.5, y2: 0.5 });
    expect(segment.x1).toBeCloseTo(0.04);
    expect(segment.x2).toBeCloseTo(0.96);
  });

  it('connects every measurement and preserves the direction of change', () => {
    const segments = createTrendSegments([80, 100, 90]);
    expect(segments).toHaveLength(2);
    expect(segments[0].y1).toBeCloseTo(0.9);
    expect(segments[0].y2).toBeCloseTo(0.1);
    expect(segments[1].y2).toBeCloseTo(0.5);
    expect(segments[0].x2).toBe(segments[1].x1);
    expect(segments[0].y2).toBe(segments[1].y1);
  });

  it.each([240, 640])('renders a steep line through both endpoints at a %ipx width', (width) => {
    const segment = createTrendSegments([0, 100])[0];
    const geometry = layoutTrendSegment(segment, width, 128);
    const radians = parseFloat(geometry.rotate) * Math.PI / 180;
    const centerX = geometry.left + geometry.width / 2;
    const centerY = geometry.top + 1;
    const halfX = Math.cos(radians) * geometry.width / 2;
    const halfY = Math.sin(radians) * geometry.width / 2;
    expect(centerX - halfX).toBeCloseTo(width * 0.04);
    expect(centerY - halfY).toBeCloseTo(115.2);
    expect(centerX + halfX).toBeCloseTo(width * 0.96);
    expect(centerY + halfY).toBeCloseTo(12.8);
  });
});

/// <reference types="jest" />

import {
  distanceFromCanonical,
  distanceToCanonical,
  heightFromCanonical,
  heightToCanonical,
  normalizeDistanceUnit,
  speedFromCanonical,
  speedToCanonical,
  weightFromCanonical,
  weightToCanonical,
} from '@/db';

describe('measurement units', () => {
  it('round-trips canonical values through imperial display units', () => {
    expect(weightToCanonical(weightFromCanonical(80, 'lb'), 'lb')).toBeCloseTo(80);
    expect(heightToCanonical(heightFromCanonical(180, 'ft'), 'ft')).toBeCloseTo(180);
    expect(speedToCanonical(speedFromCanonical(12, 'mph'), 'mph')).toBeCloseTo(12);
    expect(distanceToCanonical(distanceFromCanonical(5000, 'mi'), 'mi')).toBeCloseTo(5000);
  });

  it('uses supported distance display units', () => {
    expect(normalizeDistanceUnit('km')).toBe('km');
    expect(normalizeDistanceUnit('mi')).toBe('mi');
    expect(distanceFromCanonical(5000, 'km')).toBe(5);
  });
});

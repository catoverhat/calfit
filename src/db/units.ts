export type HeightUnit = 'cm' | 'ft';
export type WeightUnit = 'kg' | 'lb';
export type SpeedUnit = 'kmh' | 'mph';
export type DistanceUnit = 'km' | 'mi';

const KILOGRAMS_PER_POUND = 0.45359237;
const CENTIMETRES_PER_FOOT = 30.48;
const KILOMETRES_PER_MILE = 1.609344;
const METRES_PER_MILE = 1609.344;

export function normalizeHeightUnit(value: string): HeightUnit {
  return value === 'ft' ? 'ft' : 'cm';
}

export function normalizeWeightUnit(value: string): WeightUnit {
  return value === 'lb' ? 'lb' : 'kg';
}

export function normalizeSpeedUnit(value: string): SpeedUnit {
  return value === 'mph' ? 'mph' : 'kmh';
}

export function normalizeDistanceUnit(value: string): DistanceUnit {
  return value === 'mi' ? 'mi' : 'km';
}

export function weightFromCanonical(valueKg: number, unit: WeightUnit): number {
  return unit === 'lb' ? valueKg / KILOGRAMS_PER_POUND : valueKg;
}

/**
 * Body mass index: weight (kg) / height (m)², rounded to one decimal.
 * Quetelet's index, named BMI by Keys et al. (1972); the formula WHO uses.
 */
export function calculateBmi(weightKg: number | null, heightCm: number | null): number | null {
  if (!weightKg || !heightCm || weightKg <= 0 || heightCm <= 0) return null;
  return Math.round((weightKg / (heightCm / 100) ** 2) * 10) / 10;
}

export function weightToCanonical(value: number, unit: WeightUnit): number {
  return unit === 'lb' ? value * KILOGRAMS_PER_POUND : value;
}

export function heightFromCanonical(valueCm: number, unit: HeightUnit): number {
  return unit === 'ft' ? valueCm / CENTIMETRES_PER_FOOT : valueCm;
}

export function heightToCanonical(value: number, unit: HeightUnit): number {
  return unit === 'ft' ? value * CENTIMETRES_PER_FOOT : value;
}

export function speedFromCanonical(valueKmh: number, unit: SpeedUnit): number {
  return unit === 'mph' ? valueKmh / KILOMETRES_PER_MILE : valueKmh;
}

export function speedToCanonical(value: number, unit: SpeedUnit): number {
  return unit === 'mph' ? value * KILOMETRES_PER_MILE : value;
}

export function distanceFromCanonical(valueMetres: number, unit: DistanceUnit): number {
  return unit === 'mi' ? valueMetres / METRES_PER_MILE : valueMetres / 1000;
}

export function distanceToCanonical(value: number, unit: DistanceUnit): number {
  return unit === 'mi' ? value * METRES_PER_MILE : value * 1000;
}

export function formatUnitNumber(value: number, maximumFractionDigits = 1): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits }).format(value);
}


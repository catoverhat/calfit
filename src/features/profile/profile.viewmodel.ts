import {
  weightToCanonical,
  type DistanceUnit,
  type HeightUnit,
  type SpeedUnit,
  type WeightUnit,
} from '@/db';

export interface ProfileDraft {
  birthDate: string;
  distanceUnit: DistanceUnit;
  height: string;
  heightUnit: HeightUnit;
  speedUnit: SpeedUnit;
  username: string;
  weight: string;
  weightUnit: WeightUnit;
}

export type ProfileSaveValues = {
  currentWeightKg: number | null;
  dob: string | null;
  distanceUnit: DistanceUnit;
  heightCm: number | null;
  heightUnit: HeightUnit;
  speedUnit: SpeedUnit;
  username: string;
  weightUnit: WeightUnit;
};

export function validateProfileDraft(
  draft: ProfileDraft
): { error: string; values: null } | { error: null; values: ProfileSaveValues } {
  const username = draft.username.trim();
  if (!username) return { error: 'Username is required.', values: null };

  const dob = draft.birthDate.trim() || null;
  if (dob && !isValidPastDate(dob)) {
    return { error: 'Date of birth must be a valid YYYY-MM-DD date in the past.', values: null };
  }

  const heightCm = parseHeightToCanonical(draft.height, draft.heightUnit);
  const weight = parseOptionalPositive(draft.weight);
  if (heightCm === undefined) return { error: draft.heightUnit === 'ft' ? 'Height must use feet.inches with inches from 0 to 11.' : 'Height must be a positive number.', values: null };
  if (weight === undefined) return { error: 'Current weight must be a positive number.', values: null };

  return {
    error: null,
    values: {
      currentWeightKg: weight === null ? null : weightToCanonical(weight, draft.weightUnit),
      dob,
      distanceUnit: draft.distanceUnit,
      heightCm,
      heightUnit: draft.heightUnit,
      speedUnit: draft.speedUnit,
      username,
      weightUnit: draft.weightUnit,
    },
  };
}

export function formatHeightInput(valueCm: number, unit: HeightUnit): string {
  if (unit === 'cm') return editable(valueCm);
  const totalInches = Math.round(valueCm / 2.54);
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  return inches === 0 ? String(feet) : `${feet}.${String(inches).padStart(2, '0')}`;
}

export function parseHeightToCanonical(value: string, unit: HeightUnit): number | null | undefined {
  if (!value.trim()) return null;
  if (unit === 'cm') return parseOptionalPositive(value);
  const match = value.trim().match(/^(\d+)(?:[.' ](\d{1,2}))?$/);
  if (!match) return undefined;
  const feet = Number(match[1]);
  const inches = Number(match[2] ?? 0);
  if (feet <= 0 || inches > 11) return undefined;
  return (feet * 12 + inches) * 2.54;
}

function parseOptionalPositive(value: string): number | null | undefined {
  if (!value.trim()) return null;
  const parsed = Number(value.replace(',', '.'));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function editable(value: number): string {
  return String(Math.round(value * 100) / 100);
}

function isValidPastDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return false;
  const [year, month, day] = value.split('-').map(Number);
  if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

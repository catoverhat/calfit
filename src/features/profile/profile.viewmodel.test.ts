/// <reference types="jest" />

import { validateProfileDraft } from './profile.viewmodel';

describe('profile validation', () => {
  it('converts display measurements to canonical values', () => {
    const result = validateProfileDraft({
      birthDate: '1990-05-20', distanceUnit: 'mi', height: '6', heightUnit: 'ft',
      speedUnit: 'mph', username: 'Daniel', weight: '220.462', weightUnit: 'lb',
    });
    expect(result.values).toEqual(expect.objectContaining({
      dob: '1990-05-20', heightCm: 182.88, username: 'Daniel',
    }));
    expect(result.values?.currentWeightKg).toBeCloseTo(100, 2);
  });

  it('rejects invalid optional values and an empty username', () => {
    expect(validateProfileDraft({ birthDate: '', distanceUnit: 'km', height: '', heightUnit: 'cm', speedUnit: 'kmh', username: ' ', weight: '', weightUnit: 'kg' }).error).toBe('Display name is required.');
    expect(validateProfileDraft({ birthDate: '2026-99-99', distanceUnit: 'km', height: '', heightUnit: 'cm', speedUnit: 'kmh', username: 'Athlete', weight: '', weightUnit: 'kg' }).values).toBeNull();
  });
});

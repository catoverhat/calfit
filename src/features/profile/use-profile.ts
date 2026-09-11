import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import {
  getLatestBodyMeasurement,
  getLocalUserProfile,
  initializeLocalDatabase,
  normalizeDistanceUnit,
  normalizeHeightUnit,
  normalizeSpeedUnit,
  normalizeWeightUnit,
  saveLocalProfile,
  weightFromCanonical,
  type HeightUnit,
  type WeightUnit,
} from '@/db';
import { formatHeightInput, parseHeightToCanonical, validateProfileDraft, type ProfileDraft } from './profile.viewmodel';

const emptyDraft: ProfileDraft = {
  birthDate: '',
  distanceUnit: 'km',
  height: '',
  heightUnit: 'cm',
  speedUnit: 'kmh',
  username: '',
  weight: '',
  weightUnit: 'kg',
};

export function useProfile() {
  const [draft, setDraft] = useState(emptyDraft);
  const [latestWeightKg, setLatestWeightKg] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      async function load() {
        setIsLoading(true);
        setError(null);
        try {
          const db = await initializeLocalDatabase();
          const [user, measurement] = await Promise.all([
            getLocalUserProfile(db),
            getLatestBodyMeasurement(db),
          ]);
          if (!active) return;
          const heightUnit = normalizeHeightUnit(user.height_unit);
          const weightUnit = normalizeWeightUnit(user.weight_unit);
          setLatestWeightKg(measurement?.weight ?? null);
          setDraft({
            birthDate: user.dob ?? '',
            distanceUnit: normalizeDistanceUnit(user.distance_unit),
            height: user.height === null ? '' : formatHeightInput(user.height, heightUnit),
            heightUnit,
            speedUnit: normalizeSpeedUnit(user.speed_unit),
            username: user.username,
            weight: measurement?.weight === null || measurement?.weight === undefined
              ? ''
              : editable(weightFromCanonical(measurement.weight, weightUnit)),
            weightUnit,
          });
        } catch (loadError) {
          if (active) setError(loadError instanceof Error ? loadError.message : 'Profile could not be loaded.');
        } finally {
          if (active) setIsLoading(false);
        }
      }
      void load();
      return () => {
        active = false;
      };
    }, [])
  );

  const setField = useCallback(<K extends keyof ProfileDraft>(field: K, value: ProfileDraft[K]) => {
    setSuccess(null);
    setDraft((current) => ({ ...current, [field]: value }));
  }, []);

  const changeHeightUnit = useCallback((unit: HeightUnit) => {
    setSuccess(null);
    setDraft((current) => ({
      ...current,
      height: convertHeightInput(current.height, current.heightUnit, unit),
      heightUnit: unit,
    }));
  }, []);

  const changeWeightUnit = useCallback((unit: WeightUnit) => {
    setSuccess(null);
    setDraft((current) => ({
      ...current,
      weight: convertInput(current.weight, current.weightUnit, unit, weightFromCanonical),
      weightUnit: unit,
    }));
  }, []);

  const save = useCallback(async () => {
    const validated = validateProfileDraft(draft);
    if (!validated.values) {
      setError(validated.error);
      return;
    }
    setError(null);
    setSuccess(null);
    setIsSaving(true);
    try {
      const nextWeight = validated.values.currentWeightKg;
      const weightChanged = nextWeight !== null &&
        (latestWeightKg === null || Math.abs(nextWeight - latestWeightKg) > 0.005);
      const db = await initializeLocalDatabase();
      await saveLocalProfile(db, {
        ...validated.values,
        currentWeightKg: weightChanged ? nextWeight : undefined,
      });
      if (weightChanged) setLatestWeightKg(nextWeight);
      setSuccess('Profile saved locally.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Profile could not be saved.');
    } finally {
      setIsSaving(false);
    }
  }, [draft, latestWeightKg]);

  return { changeHeightUnit, changeWeightUnit, draft, error, isLoading, isSaving, save, setField, success };
}

function editable(value: number): string {
  return String(Math.round(value * 100) / 100);
}

function convertInput<T extends string>(
  raw: string,
  from: T,
  to: T,
  fromCanonical: (value: number, unit: T) => number
): string {
  const value = Number(raw.replace(',', '.'));
  if (!Number.isFinite(value) || value <= 0 || from === to) return raw;
  let canonical = value;
  if (from === 'lb') canonical = value * 0.45359237;
  else if (from === 'ft') canonical = value * 30.48;
  return editable(fromCanonical(canonical, to));
}

function convertHeightInput(raw: string, from: HeightUnit, to: HeightUnit): string {
  if (from === to || !raw.trim()) return raw;
  const canonical = parseHeightToCanonical(raw, from);
  return canonical === null || canonical === undefined ? raw : formatHeightInput(canonical, to);
}

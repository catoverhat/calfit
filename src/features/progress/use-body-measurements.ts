import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { createBodyMeasurement, getLocalUserProfile, getRecentBodyMeasurements, initializeLocalDatabase, normalizeWeightUnit, weightFromCanonical } from '@/db';
import { createMeasurementTrendSegments, createMeasurementViewItems, validateMeasurementValues, type MeasurementViewItem } from './progress.viewmodel';
import type { LineSegment } from './trend-chart';

type Input = { bmi: string; bodyFat: string; date: string; weight: string };
type State = { error: string | null; history: MeasurementViewItem[]; isLoading: boolean; isSaving: boolean; latestWeight: string; profileName: string; trendSegments: LineSegment[]; weightUnit: string };

export function useBodyMeasurements(): State & { addMeasurement: (input: Input) => Promise<boolean> } {
  const [reloadKey, setReloadKey] = useState(0);
  const [state, setState] = useState<State>({ error: null, history: [], isLoading: true, isSaving: false, latestWeight: '—', profileName: 'Local Athlete', trendSegments: [], weightUnit: 'kg' });
  useFocusEffect(useCallback(() => {
    void reloadKey;
    let active = true;
    async function load() {
      setState((current) => ({ ...current, error: null, isLoading: true }));
      try {
        const db = await initializeLocalDatabase();
        const [user, measurements] = await Promise.all([getLocalUserProfile(db), getRecentBodyMeasurements(db, undefined, 30)]);
        const weightUnit = normalizeWeightUnit(user.weight_unit);
        if (active) setState({
          error: null,
          history: createMeasurementViewItems(measurements, user.weight_unit),
          isLoading: false,
          isSaving: false,
          latestWeight: measurements[0]?.weight === null || measurements[0]?.weight === undefined ? '—' : `${Math.round(weightFromCanonical(measurements[0].weight, weightUnit) * 10) / 10}`,
          profileName: user.username,
          trendSegments: createMeasurementTrendSegments(measurements, weightUnit),
          weightUnit,
        });
      } catch (error) {
        if (active) setState((current) => ({ ...current, error: error instanceof Error ? error.message : 'Measurements could not be loaded.', isLoading: false, isSaving: false }));
      }
    }
    load();
    return () => { active = false; };
  }, [reloadKey]));

  const addMeasurement = useCallback(async (input: Input) => {
    const validated = validateMeasurementValues(input, state.weightUnit);
    if (!validated.values) {
      setState((current) => ({ ...current, error: validated.error }));
      return false;
    }
    setState((current) => ({ ...current, error: null, isSaving: true }));
    try {
      const db = await initializeLocalDatabase();
      await createBodyMeasurement(db, validated.values);
      setReloadKey((value) => value + 1);
      return true;
    } catch (error) {
      setState((current) => ({ ...current, error: error instanceof Error ? error.message : 'Measurement could not be saved.', isSaving: false }));
      return false;
    }
  }, [state.weightUnit]);

  return { ...state, addMeasurement };
}

import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';

import {
  createRoutine,
  distanceToCanonical,
  getLocalUserProfile,
  getRoutineDetail,
  initializeLocalDatabase,
  normalizeDistanceUnit,
  normalizeSpeedUnit,
  normalizeWeightUnit,
  speedToCanonical,
  updateRoutine,
  weightToCanonical,
  type CreateRoutineExerciseInput,
} from '@/db';
import { useRoutineDraft, type RoutineDraft, type RoutineUnits } from './routine-draft-context';

export function useRoutineEditor({ mode, routineId }: { mode: 'create' | 'edit'; routineId?: string }) {
  const draftState = useRoutineDraft();
  const draftStateRef = useRef(draftState);
  const [isLoading, setIsLoading] = useState(mode === 'edit');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [units, setUnits] = useState<RoutineUnits>({ distanceUnit: 'km', speedUnit: 'kmh', weightUnit: 'kg' });

  useEffect(() => {
    draftStateRef.current = draftState;
  }, [draftState]);

  useEffect(() => {
    let active = true;
    async function initialize() {
      const currentDraftState = draftStateRef.current;
      setError(null);
      if (!routineId) {
        if (mode === 'edit') {
          setError('Routine id is missing.');
          setIsLoading(false);
          return;
        }
      }
      setIsLoading(true);
      try {
        const db = await initializeLocalDatabase();
        const user = await getLocalUserProfile(db);
        const nextUnits = {
          distanceUnit: normalizeDistanceUnit(user.distance_unit),
          speedUnit: normalizeSpeedUnit(user.speed_unit),
          weightUnit: normalizeWeightUnit(user.weight_unit),
        };
        setUnits(nextUnits);
        if (mode === 'create') {
          currentDraftState.initializeCreate();
          return;
        }
        if (currentDraftState.draft?.sourceKey === `edit:${routineId}`) return;
        const routine = await getRoutineDetail(db, routineId as string);
        if (!routine) throw new Error('Routine could not be found.');
        if (active) currentDraftState.initializeEdit(routine, nextUnits);
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'Routine could not be loaded.');
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }
    initialize();
    return () => {
      active = false;
    };
  }, [mode, routineId]);

  const save = useCallback(async () => {
    const draft = draftState.draft;
    if (!draft || isSaving) return;
    const validationError = validateRoutineDraft(draft);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setIsSaving(true);
    try {
      const db = await initializeLocalDatabase();
      const input = {
        name: draft.name.trim(),
        description: draft.description.trim() || null,
        active: draft.active,
        exercises: mapDraftExercises(draft, units),
        scheduleDays: draft.scheduleDays,
      };
      if (mode === 'edit') {
        if (!routineId) throw new Error('Routine id is missing.');
        await updateRoutine(db, { routineId, ...input });
      } else {
        await createRoutine(db, input);
      }
      draftState.clearDraft();
      router.replace('/routines');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Routine could not be saved.');
      setIsSaving(false);
    }
  }, [draftState, isSaving, mode, routineId, units]);

  return { ...draftState, error, isLoading, isSaving, save, units };
}

export function validateRoutineDraft(draft: RoutineDraft): string | null {
  if (!draft.name.trim()) return 'Routine name is required.';
  if (draft.exercises.length === 0) return 'Add at least one exercise.';
  if (draft.exercises.some((exercise) => exercise.targets.length === 0)) {
    return 'Every exercise needs at least one target set.';
  }
  return null;
}

function mapDraftExercises(draft: RoutineDraft, units: RoutineUnits): CreateRoutineExerciseInput[] {
  return draft.exercises.map((exercise) => ({
    exerciseId: exercise.exerciseId,
    targets: exercise.targets.map((target, index) => ({
      setNumber: index + 1,
      targetReps: parseOptionalNumber(target.reps),
      targetWeight: convertOptional(target.weight, (value) => weightToCanonical(value, units.weightUnit)),
      targetSpeed: convertOptional(target.speed, (value) => speedToCanonical(value, units.speedUnit)),
      targetDurationSeconds: parseOptionalNumber(target.duration),
      targetDistance: convertOptional(target.distance, (value) => distanceToCanonical(value, units.distanceUnit)),
      restTimeSeconds: parseOptionalNumber(target.rest),
    })),
  }));
}

function convertOptional(value: string, convert: (parsed: number) => number): number | null {
  const parsed = parseOptionalNumber(value);
  return parsed === null ? null : convert(parsed);
}

function parseOptionalNumber(value: string): number | null {
  if (!value.trim()) return null;
  const parsed = Number(value.replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : null;
}

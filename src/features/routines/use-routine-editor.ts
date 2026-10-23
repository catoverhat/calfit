import { router, type Href } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Platform } from 'react-native';

import {
  assignWorkoutToDate,
  createRoutine,
  distanceToCanonical,
  getLocalUserProfile,
  getRoutineDetail,
  getWorkoutPlanEntries,
  initializeLocalDatabase,
  normalizeDistanceUnit,
  normalizeSpeedUnit,
  normalizeWeightUnit,
  removeFutureWorkoutPlanEntriesForRoutine,
  speedToCanonical,
  updateRoutine,
  weightToCanonical,
  type CreateRoutineExerciseInput,
} from '@/db';
import { useRoutineDraft, type RoutineDraft, type RoutineUnits } from './routine-draft-context';

export function useRoutineEditor({ mode, plannedDate, routineId }: { mode: 'create' | 'edit'; plannedDate?: string; routineId?: string }) {
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
          setError('Workout id is missing.');
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
        if (!routine) throw new Error('Workout could not be found.');
        if (active) currentDraftState.initializeEdit(routine, nextUnits);
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'Workout could not be loaded.');
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
      };
      if (mode === 'edit') {
        if (!routineId) throw new Error('Workout id is missing.');
        const current = await getRoutineDetail(db, routineId);
        if (!current) throw new Error('Workout could not be found.');
        if (current.active === 1 && !draft.active) {
          const today = localDateKey(new Date());
          const future = (await getWorkoutPlanEntries(db, today, '9999-12-31')).filter(
            (entry) => entry.routine_id_fk === routineId
          );
          if (future.length > 0) {
            const confirmed = await confirmDeactivate(future.length);
            if (!confirmed) {
              setIsSaving(false);
              return;
            }
            await removeFutureWorkoutPlanEntriesForRoutine(db, { routineId, today });
          }
        }
        await updateRoutine(db, { routineId, ...input });
      } else {
        const created = await createRoutine(db, input);
        if (plannedDate) {
          await assignWorkoutToDate(db, {
            plannedDate,
            routineId: created.routine_id,
          });
        }
      }
      draftState.clearDraft();
      router.replace(
        (plannedDate ? { pathname: '/plan', params: { date: plannedDate } } : '/workouts') as Href
      );
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Workout could not be saved.');
      setIsSaving(false);
    }
  }, [draftState, isSaving, mode, plannedDate, routineId, units]);

  return { ...draftState, error, isLoading, isSaving, save, units };
}

export function validateRoutineDraft(draft: RoutineDraft): string | null {
  if (!draft.name.trim()) return 'Workout name is required.';
  if (draft.exercises.length === 0) return 'Add at least one exercise.';
  if (draft.exercises.some((exercise) => exercise.targets.length === 0)) {
    return 'Every exercise needs at least one target set.';
  }
  return null;
}

function confirmDeactivate(futureAssignments: number): Promise<boolean> {
  const message = `${futureAssignments} future plan assignment${futureAssignments === 1 ? '' : 's'} will be removed. Historical entries stay intact.`;
  if (Platform.OS === 'web') {
    return Promise.resolve(globalThis.confirm(`Deactivate workout?\n\n${message}`));
  }
  return new Promise((resolve) => {
    Alert.alert(
      'Deactivate workout?',
      message,
      [
        { onPress: () => resolve(false), style: 'cancel', text: 'Keep active' },
        { onPress: () => resolve(true), style: 'destructive', text: 'Deactivate' },
      ]
    );
  });
}

function localDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}`;
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

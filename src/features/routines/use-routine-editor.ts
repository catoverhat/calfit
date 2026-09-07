import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

import {
  createRoutine,
  getRoutineDetail,
  initializeLocalDatabase,
  updateRoutine,
  type CreateRoutineExerciseInput,
} from '@/db';
import { useRoutineDraft, type RoutineDraft } from './routine-draft-context';

export function useRoutineEditor({ mode, routineId }: { mode: 'create' | 'edit'; routineId?: string }) {
  const draftState = useRoutineDraft();
  const [isLoading, setIsLoading] = useState(mode === 'edit');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function initialize() {
      setError(null);
      if (mode === 'create') {
        draftState.initializeCreate();
        setIsLoading(false);
        return;
      }
      if (!routineId) {
        setError('Routine id is missing.');
        setIsLoading(false);
        return;
      }
      if (draftState.draft?.sourceKey === `edit:${routineId}`) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const db = await initializeLocalDatabase();
        const routine = await getRoutineDetail(db, routineId);
        if (!routine) throw new Error('Routine could not be found.');
        if (active) draftState.initializeEdit(routine);
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
  }, [draftState, mode, routineId]);

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
        exercises: mapDraftExercises(draft),
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
  }, [draftState, isSaving, mode, routineId]);

  return { ...draftState, error, isLoading, isSaving, save };
}

export function validateRoutineDraft(draft: RoutineDraft): string | null {
  if (!draft.name.trim()) return 'Routine name is required.';
  if (draft.exercises.length === 0) return 'Add at least one exercise.';
  if (draft.exercises.some((exercise) => exercise.targets.length === 0)) {
    return 'Every exercise needs at least one target set.';
  }
  return null;
}

function mapDraftExercises(draft: RoutineDraft): CreateRoutineExerciseInput[] {
  return draft.exercises.map((exercise) => ({
    exerciseId: exercise.exerciseId,
    targets: exercise.targets.map((target, index) => ({
      setNumber: index + 1,
      targetReps: parseOptionalNumber(target.reps),
      targetWeight: parseOptionalNumber(target.weight),
      targetSpeed: parseOptionalNumber(target.speed),
      targetDurationSeconds: parseOptionalNumber(target.duration),
      targetDistance: parseOptionalNumber(target.distance),
      restTimeSeconds: parseOptionalNumber(target.rest),
    })),
  }));
}

function parseOptionalNumber(value: string): number | null {
  if (!value.trim()) return null;
  const parsed = Number(value.replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : null;
}

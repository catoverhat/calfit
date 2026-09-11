import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  distanceToCanonical,
  initializeLocalDatabase,
  logWorkoutSet,
  speedToCanonical,
  weightToCanonical,
  type LogWorkoutSetInput,
} from '@/db';
import type {
  WorkoutMetricField,
  WorkoutSessionSetViewModel,
  WorkoutSessionViewModel,
} from './workout-session.viewmodel';

const SAVE_DELAY_MS = 350;

export function useActiveWorkout(workout: WorkoutSessionViewModel) {
  const initialSets = useMemo(() => flattenSets(workout), [workout]);
  const [sets, setSets] = useState<Record<string, WorkoutSessionSetViewModel>>(initialSets);
  const setsRef = useRef(sets);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const [saveErrors, setSaveErrors] = useState<Record<string, string>>({});
  const [savingIds, setSavingIds] = useState<Set<string>>(() => new Set());
  const [expandedExerciseId, setExpandedExerciseId] = useState(() => firstIncompleteExercise(workout, initialSets));
  const [infoExerciseId, setInfoExerciseId] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());
  const [restDeadline, setRestDeadline] = useState<number | null>(() => restoredRestDeadline(initialSets));

  useEffect(() => {
    setsRef.current = sets;
  }, [sets]);

  useEffect(() => {
    setSets(initialSets);
    setsRef.current = initialSets;
    setExpandedExerciseId(firstIncompleteExercise(workout, initialSets));
    setRestDeadline(restoredRestDeadline(initialSets));
  }, [initialSets, workout]);

  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => () => {
    timers.current.forEach(clearTimeout);
    timers.current.clear();
  }, []);

  const updateField = (setId: string, field: WorkoutMetricField, value: string) => {
    setsRef.current = {
      ...setsRef.current,
      [setId]: { ...setsRef.current[setId], [field]: value },
    };
    setSets((current) => ({ ...current, [setId]: { ...current[setId], [field]: value } }));
    setSaveErrors((current) => omitKey(current, setId));
    const existing = timers.current.get(setId);
    if (existing) clearTimeout(existing);
    timers.current.set(setId, setTimeout(() => {
      timers.current.delete(setId);
      void persistSet(setId);
    }, SAVE_DELAY_MS));
  };

  const persistSet = useCallback(async (setId: string, completed?: boolean): Promise<boolean> => {
    const set = setsRef.current[setId];
    if (!set) return false;
    const parsed = parseSet(set, workout);
    if (!parsed.values) {
      setSaveErrors((current) => ({ ...current, [setId]: parsed.error }));
      return false;
    }
    setSavingIds((current) => new Set(current).add(setId));
    try {
      const db = await initializeLocalDatabase();
      const completedAt = completed === true ? new Date().toISOString() : completed === false ? null : undefined;
      await logWorkoutSet(db, setId, { ...parsed.values, completed, completedAt });
      setSaveErrors((current) => omitKey(current, setId));
      if (completed !== undefined) {
        const nextCompletedAt = completed ? completedAt ?? set.completedAt : null;
        setsRef.current = {
          ...setsRef.current,
          [setId]: {
            ...setsRef.current[setId],
            completed,
            completedAt: nextCompletedAt,
          },
        };
        setSets((current) => ({
          ...current,
          [setId]: {
            ...current[setId],
            completed,
            completedAt: nextCompletedAt,
          },
        }));
        if (completed && set.restTimeSeconds > 0) {
          setRestDeadline(Date.now() + set.restTimeSeconds * 1000);
        }
      }
      return true;
    } catch (error) {
      setSaveErrors((current) => ({
        ...current,
        [setId]: error instanceof Error ? error.message : 'Set could not be saved.',
      }));
      return false;
    } finally {
      setSavingIds((current) => {
        const next = new Set(current);
        next.delete(setId);
        return next;
      });
    }
  }, [workout]);

  const blurField = useCallback((setId: string) => {
    const existing = timers.current.get(setId);
    if (existing) clearTimeout(existing);
    timers.current.delete(setId);
    void persistSet(setId);
  }, [persistSet]);

  const toggleSet = useCallback(async (setId: string) => {
    const existing = timers.current.get(setId);
    if (existing) clearTimeout(existing);
    timers.current.delete(setId);
    const set = setsRef.current[setId];
    if (!set) return;
    const nextCompleted = !set.completed;
    setSets((current) => ({ ...current, [setId]: { ...current[setId], completed: nextCompleted } }));
    setsRef.current = { ...setsRef.current, [setId]: { ...set, completed: nextCompleted } };
    const saved = await persistSet(setId, nextCompleted);
    if (!saved) {
      setSets((current) => ({ ...current, [setId]: { ...current[setId], completed: set.completed } }));
      setsRef.current = { ...setsRef.current, [setId]: set };
    }
  }, [persistSet]);

  const flush = useCallback(async (): Promise<boolean> => {
    timers.current.forEach(clearTimeout);
    timers.current.clear();
    const results = await Promise.all(Object.keys(setsRef.current).map((id) => persistSet(id)));
    return results.every(Boolean);
  }, [persistSet]);

  const skipRest = useCallback(() => {
    setRestDeadline(null);
    setExpandedExerciseId(nextIncompleteExercise(workout, setsRef.current, expandedExerciseId));
  }, [expandedExerciseId, workout]);

  const restSeconds = restDeadline === null ? 0 : Math.max(0, Math.ceil((restDeadline - now) / 1000));
  useEffect(() => {
    if (restDeadline !== null && restSeconds === 0) skipRest();
  }, [restDeadline, restSeconds, skipRest]);

  const elapsedSeconds = workout.startedAt
    ? Math.max(0, Math.floor((now - new Date(workout.startedAt).getTime()) / 1000))
    : 0;
  const incompleteCount = Object.values(sets).filter((set) => !set.completed).length;

  return {
    addRest: () => setRestDeadline((current) => (current ?? Date.now()) + 30_000),
    blurField,
    elapsedSeconds,
    expandedExerciseId,
    flush,
    incompleteCount,
    infoExerciseId,
    isSaving: savingIds.size > 0,
    restSeconds,
    saveErrors,
    setExpandedExerciseId,
    sets,
    skipRest,
    toggleInfo: (id: string) => setInfoExerciseId((current) => current === id ? null : id),
    toggleSet,
    updateField,
  };
}

function flattenSets(workout: WorkoutSessionViewModel): Record<string, WorkoutSessionSetViewModel> {
  return Object.fromEntries(workout.exercises.flatMap((exercise) => exercise.sets.map((set) => [set.id, set])));
}

function parseSet(
  set: WorkoutSessionSetViewModel,
  workout: WorkoutSessionViewModel
): { error: string; values: null } | { error: null; values: LogWorkoutSetInput } {
  const parsed = {
    reps: parseMetric(set.reps, true),
    weight: parseMetric(set.weight),
    speed: parseMetric(set.speed),
    duration: parseMetric(set.duration, true),
    distance: parseMetric(set.distance),
  };
  if (Object.values(parsed).some((value) => value === undefined)) {
    return { error: 'Set values must be positive numbers.', values: null };
  }
  const reps = parsed.reps as number | null;
  const weight = parsed.weight as number | null;
  const speed = parsed.speed as number | null;
  const duration = parsed.duration as number | null;
  const distance = parsed.distance as number | null;
  const hasValue = set.fields.some((field) => parsed[field] !== null);
  if (set.completed && !hasValue) return { error: 'Enter at least one value before completing this set.', values: null };
  return {
    error: null,
    values: {
      distance: distance === null ? null : distanceToCanonical(distance, workout.distanceUnit),
      durationSeconds: duration,
      reps,
      speed: speed === null ? null : speedToCanonical(speed, workout.speedUnit),
      weight: weight === null ? null : weightToCanonical(weight, workout.weightUnit),
    },
  };
}

function parseMetric(value: string, integer = false): number | null | undefined {
  if (!value.trim()) return null;
  const parsed = Number(value.replace(',', '.'));
  if (!Number.isFinite(parsed) || parsed <= 0 || (integer && !Number.isInteger(parsed))) return undefined;
  return parsed;
}

function restoredRestDeadline(sets: Record<string, WorkoutSessionSetViewModel>): number | null {
  const latest = Object.values(sets)
    .filter((set) => set.completed && set.completedAt)
    .sort((left, right) => String(right.completedAt).localeCompare(String(left.completedAt)))[0];
  if (!latest?.completedAt || latest.restTimeSeconds <= 0) return null;
  const deadline = new Date(latest.completedAt).getTime() + latest.restTimeSeconds * 1000;
  return deadline > Date.now() ? deadline : null;
}

function firstIncompleteExercise(
  workout: WorkoutSessionViewModel,
  sets: Record<string, WorkoutSessionSetViewModel>
): string {
  return workout.exercises.find((exercise) => exercise.sets.some((set) => !sets[set.id].completed))?.id
    ?? workout.exercises[0]?.id
    ?? '';
}

function nextIncompleteExercise(
  workout: WorkoutSessionViewModel,
  sets: Record<string, WorkoutSessionSetViewModel>,
  currentId: string
): string {
  const current = workout.exercises.find((exercise) => exercise.id === currentId);
  if (current?.sets.some((set) => !sets[set.id].completed)) return currentId;
  const currentIndex = workout.exercises.findIndex((exercise) => exercise.id === currentId);
  const ordered = [...workout.exercises.slice(currentIndex + 1), ...workout.exercises.slice(0, currentIndex + 1)];
  return ordered.find((exercise) => exercise.sets.some((set) => !sets[set.id].completed))?.id ?? currentId;
}

function omitKey<T>(record: Record<string, T>, key: string): Record<string, T> {
  const next = { ...record };
  delete next[key];
  return next;
}

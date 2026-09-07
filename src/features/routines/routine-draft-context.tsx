import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import type { ExerciseCatalogRow, RoutineDetail } from '@/db';

export interface RoutineTargetDraft {
  id: string;
  reps: string;
  weight: string;
  speed: string;
  duration: string;
  distance: string;
  rest: string;
}

export interface RoutineExerciseDraft {
  id: string;
  exerciseId: string;
  imageUrl: string | null;
  name: string;
  targets: RoutineTargetDraft[];
}

export interface RoutineDraft {
  active: boolean;
  description: string;
  exercises: RoutineExerciseDraft[];
  name: string;
  routineId?: string;
  scheduleDays: number[];
  sourceKey: string;
}

interface RoutineDraftContextValue {
  draft: RoutineDraft | null;
  clearDraft: () => void;
  initializeCreate: () => void;
  initializeEdit: (routine: RoutineDetail) => void;
  moveExercise: (id: string, direction: -1 | 1) => void;
  removeExercise: (id: string) => void;
  removeTarget: (exerciseId: string, targetId: string) => void;
  setDraftField: <Key extends 'active' | 'description' | 'name' | 'scheduleDays'>(
    key: Key,
    value: RoutineDraft[Key]
  ) => void;
  setSelectedExercises: (exercises: ExerciseCatalogRow[]) => void;
  updateTarget: (
    exerciseId: string,
    targetId: string,
    field: keyof Omit<RoutineTargetDraft, 'id'>,
    value: string
  ) => void;
  addTarget: (exerciseId: string) => void;
}

const RoutineDraftContext = createContext<RoutineDraftContextValue | null>(null);

export function RoutineDraftProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<RoutineDraft | null>(null);

  const value = useMemo<RoutineDraftContextValue>(
    () => ({
      draft,
      clearDraft: () => setDraft(null),
      initializeCreate: () =>
        setDraft((current) =>
          current?.sourceKey === 'create'
            ? current
            : {
                active: true,
                description: '',
                exercises: [],
                name: '',
                scheduleDays: [],
                sourceKey: 'create',
              }
        ),
      initializeEdit: (routine) =>
        setDraft((current) =>
          current?.sourceKey === `edit:${routine.routine_id}`
            ? current
            : mapRoutineToDraft(routine)
        ),
      setDraftField: (key, fieldValue) =>
        setDraft((current) => (current ? { ...current, [key]: fieldValue } : current)),
      setSelectedExercises: (selected) =>
        setDraft((current) => {
          if (!current) return current;
          const selectedIds = new Set(selected.map((exercise) => exercise.exercise_id));
          const retained = current.exercises.filter((exercise) => selectedIds.has(exercise.exerciseId));
          const retainedIds = new Set(retained.map((exercise) => exercise.exerciseId));
          const additions = selected
            .filter((exercise) => !retainedIds.has(exercise.exercise_id))
            .map(mapCatalogExerciseToDraft);
          return { ...current, exercises: [...retained, ...additions] };
        }),
      removeExercise: (id) =>
        setDraft((current) =>
          current
            ? { ...current, exercises: current.exercises.filter((exercise) => exercise.id !== id) }
            : current
        ),
      moveExercise: (id, direction) =>
        setDraft((current) => {
          if (!current) return current;
          const index = current.exercises.findIndex((exercise) => exercise.id === id);
          const nextIndex = index + direction;
          if (index < 0 || nextIndex < 0 || nextIndex >= current.exercises.length) return current;
          const exercises = [...current.exercises];
          [exercises[index], exercises[nextIndex]] = [exercises[nextIndex], exercises[index]];
          return { ...current, exercises };
        }),
      addTarget: (exerciseId) =>
        setDraft((current) =>
          current
            ? {
                ...current,
                exercises: current.exercises.map((exercise) =>
                  exercise.id === exerciseId
                    ? { ...exercise, targets: [...exercise.targets, createTargetDraft()] }
                    : exercise
                ),
              }
            : current
        ),
      removeTarget: (exerciseId, targetId) =>
        setDraft((current) =>
          current
            ? {
                ...current,
                exercises: current.exercises.map((exercise) =>
                  exercise.id === exerciseId
                    ? {
                        ...exercise,
                        targets: exercise.targets.filter((target) => target.id !== targetId),
                      }
                    : exercise
                ),
              }
            : current
        ),
      updateTarget: (exerciseId, targetId, field, targetValue) =>
        setDraft((current) =>
          current
            ? {
                ...current,
                exercises: current.exercises.map((exercise) =>
                  exercise.id === exerciseId
                    ? {
                        ...exercise,
                        targets: exercise.targets.map((target) =>
                          target.id === targetId ? { ...target, [field]: targetValue } : target
                        ),
                      }
                    : exercise
                ),
              }
            : current
        ),
    }),
    [draft]
  );

  return <RoutineDraftContext.Provider value={value}>{children}</RoutineDraftContext.Provider>;
}

export function useRoutineDraft(): RoutineDraftContextValue {
  const value = useContext(RoutineDraftContext);
  if (!value) throw new Error('useRoutineDraft must be used inside RoutineDraftProvider.');
  return value;
}

function mapRoutineToDraft(routine: RoutineDetail): RoutineDraft {
  return {
    active: routine.active === 1,
    description: routine.description ?? '',
    exercises: routine.exercises.map((exercise) => ({
      id: exercise.routine_exercise_id,
      exerciseId: exercise.exercise_id_fk,
      imageUrl: exercise.exercise.image_url,
      name: exercise.exercise.name,
      targets: exercise.targets.map((target) => ({
        id: target.routine_exercise_target_id,
        reps: toDraftValue(target.target_reps),
        weight: toDraftValue(target.target_weight),
        speed: toDraftValue(target.target_speed),
        duration: toDraftValue(target.target_duration_seconds),
        distance: toDraftValue(target.target_distance),
        rest: toDraftValue(target.rest_time_seconds),
      })),
    })),
    name: routine.name,
    routineId: routine.routine_id,
    scheduleDays: routine.schedules.map((schedule) => schedule.day_of_week),
    sourceKey: `edit:${routine.routine_id}`,
  };
}

function mapCatalogExerciseToDraft(exercise: ExerciseCatalogRow): RoutineExerciseDraft {
  return {
    id: `draft-${exercise.exercise_id}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    exerciseId: exercise.exercise_id,
    imageUrl: exercise.image_url,
    name: exercise.name,
    targets: [createTargetDraft()],
  };
}

function createTargetDraft(): RoutineTargetDraft {
  return {
    id: `target-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    reps: '10',
    weight: '',
    speed: '',
    duration: '',
    distance: '',
    rest: '90',
  };
}

function toDraftValue(value: number | null): string {
  return value === null ? '' : String(value);
}

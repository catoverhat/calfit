import { router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

import {
  assignWorkoutToDate,
  copyWorkoutPlanWeek,
  getLegacyWorkoutPlanDays,
  getLocalUserProfile,
  getRoutineSummaries,
  getWorkoutPlanEntries,
  getWorkoutPlanSettings,
  importLegacyWorkoutPlan,
  initializeLocalDatabase,
  markLegacyWorkoutPlanImportHandled,
  moveWorkoutPlanEntry,
  removeWorkoutPlanEntry,
  replaceAndMoveWorkoutPlanEntry,
  seedDemoRoutinesIfEmpty,
  startOrResumeWorkoutFromPlanEntry,
  undoWorkoutPlanChange,
  type LegacyWorkoutPlanDay,
  type WorkoutPlanEntryDetail,
  type WorkoutPlanUndo,
} from '@/db';
import {
  addDaysToDateKey,
  getIsoWeek,
  getIsoWeekDateKeys,
  getIsoWeeksInYear,
  getIsoYearDateRange,
  parseLocalDateKey,
  toLocalDateKey,
} from './plan-calendar';
import {
  createWorkoutPlanWeek,
  mapWorkoutDefinitions,
  type WorkoutDefinition,
  type WorkoutPlanWeek,
} from './weekly-plan.viewmodel';

interface PlanState {
  entries: WorkoutPlanEntryDetail[];
  error: string | null;
  isLoading: boolean;
  isSaving: boolean;
  legacyDays: LegacyWorkoutPlanDay[];
  legacyImportPending: boolean;
  notice: string | null;
  profileName: string;
  undo: WorkoutPlanUndo | null;
  workouts: WorkoutDefinition[];
}

export function useWeeklyPlan(initialDate?: string) {
  const initial = useMemo(() => safeInitialDate(initialDate), [initialDate]);
  const initialIsoWeek = useMemo(() => getIsoWeek(initial), [initial]);
  const [year, setYear] = useState(initialIsoWeek.year);
  const [week, setWeek] = useState(initialIsoWeek.week);
  const [reloadKey, setReloadKey] = useState(0);
  const [state, setState] = useState<PlanState>({
    entries: [],
    error: null,
    isLoading: true,
    isSaving: false,
    legacyDays: [],
    legacyImportPending: false,
    notice: null,
    profileName: 'Local Athlete',
    undo: null,
    workouts: [],
  });

  const today = toLocalDateKey(new Date());
  const dates = useMemo(() => getIsoWeekDateKeys(year, week), [week, year]);
  const currentIsoWeek = getIsoWeek(new Date());
  const weekModel: WorkoutPlanWeek = useMemo(
    () => createWorkoutPlanWeek(state.entries, year, week),
    [state.entries, week, year]
  );

  useFocusEffect(
    useCallback(() => {
      let active = true;
      async function load() {
        setState((current) => ({
          ...current,
          entries: reloadKey > 0 ? current.entries : [],
          error: null,
          isLoading: true,
        }));
        try {
          const db = await initializeLocalDatabase();
          await seedDemoRoutinesIfEmpty(db);
          const range = getIsoYearDateRange(year);
          const [entries, routines, user, settings] = await Promise.all([
            getWorkoutPlanEntries(db, range.startDate, range.endDate),
            getRoutineSummaries(db),
            getLocalUserProfile(db),
            getWorkoutPlanSettings(db),
          ]);
          let legacyDays: LegacyWorkoutPlanDay[] = [];
          let legacyImportPending = settings.legacy_import_handled === 0;
          if (legacyImportPending) {
            const current = getIsoWeek(new Date());
            legacyDays = await getLegacyWorkoutPlanDays(
              db,
              getIsoWeekDateKeys(current.year, current.week),
              today
            );
            if (legacyDays.length === 0) {
              await markLegacyWorkoutPlanImportHandled(db);
              legacyImportPending = false;
            }
          }
          if (!active) return;
          setState((current) => ({
            ...current,
            entries,
            error: null,
            isLoading: false,
            isSaving: false,
            legacyDays,
            legacyImportPending,
            profileName: user.username,
            workouts: mapWorkoutDefinitions(routines),
          }));
        } catch (error) {
          if (!active) return;
          setState((current) => ({
            ...current,
            error: messageFrom(error, 'Weekly plan could not be loaded.'),
            isLoading: false,
          }));
        }
      }
      load();
      return () => {
        active = false;
      };
    }, [reloadKey, today, year])
  );

  const refresh = useCallback(() => setReloadKey((value) => value + 1), []);
  const mutate = useCallback(
    async (task: () => Promise<{ notice?: string; undo?: WorkoutPlanUndo | null }>) => {
      setState((current) => ({ ...current, error: null, isSaving: true, notice: null }));
      try {
        const result = await task();
        setState((current) => ({
          ...current,
          isSaving: false,
          notice: result.notice ?? 'Plan saved.',
          undo: result.undo ?? null,
        }));
        refresh();
      } catch (error) {
        setState((current) => ({
          ...current,
          error: messageFrom(error, 'The plan could not be updated.'),
          isSaving: false,
        }));
      }
    },
    [refresh]
  );

  const selectYear = useCallback((nextYear: number) => {
    setYear(nextYear);
    setWeek((current) => Math.min(current, getIsoWeeksInYear(nextYear)));
  }, []);

  const goToToday = useCallback(() => {
    const current = getIsoWeek(new Date());
    setYear(current.year);
    setWeek(current.week);
  }, []);

  return {
    ...state,
    currentIsoWeek,
    dates,
    maxWeek: getIsoWeeksInYear(year),
    today,
    week,
    weekModel,
    year,
    assign: (date: string, routineId: string) =>
      mutate(async () => {
        const db = await initializeLocalDatabase();
        return { undo: await assignWorkoutToDate(db, { plannedDate: date, routineId, today }) };
      }),
    copyPreviousWeek: () =>
      mutate(async () => {
        const db = await initializeLocalDatabase();
        const sourceMonday = addDaysToDateKey(dates[0], -7);
        const sourceIso = getIsoWeek(parseLocalDateKey(sourceMonday));
        const result = await copyWorkoutPlanWeek(db, {
          sourceDates: getIsoWeekDateKeys(sourceIso.year, sourceIso.week),
          targetDates: dates,
          today,
        });
        const skipped = result.skippedInactive;
        return {
          notice: skipped
            ? `Week copied. ${skipped} inactive workout${skipped === 1 ? '' : 's'} skipped.`
            : 'Previous week copied.',
          undo: result.undo,
        };
      }),
    dismissLegacyImport: () =>
      mutate(async () => {
        const db = await initializeLocalDatabase();
        await markLegacyWorkoutPlanImportHandled(db);
        setState((current) => ({ ...current, legacyImportPending: false }));
        return { notice: 'Started with an empty plan.' };
      }),
    importLegacy: (selections: { date: string; routineId: string }[]) =>
      mutate(async () => {
        const db = await initializeLocalDatabase();
        const undo = await importLegacyWorkoutPlan(db, { selections });
        setState((current) => ({ ...current, legacyImportPending: false }));
        return { notice: 'Legacy schedule imported.', undo };
      }),
    move: (entryId: string, targetDate: string) =>
      mutate(async () => {
        const db = await initializeLocalDatabase();
        return {
          notice: 'Workout moved.',
          undo: await moveWorkoutPlanEntry(db, { entryId, targetDate, today }),
        };
      }),
    remove: (entryId: string) =>
      mutate(async () => {
        const db = await initializeLocalDatabase();
        return {
          notice: 'Assignment removed.',
          undo: await removeWorkoutPlanEntry(db, { entryId, today }),
        };
      }),
    replace: (date: string, routineId: string) =>
      mutate(async () => {
        const db = await initializeLocalDatabase();
        return {
          notice: 'Workout replaced.',
          undo: await assignWorkoutToDate(db, { plannedDate: date, routineId, today }),
        };
      }),
    replaceAndMove: (entryId: string, routineId: string, targetDate: string) =>
      mutate(async () => {
        const db = await initializeLocalDatabase();
        return {
          notice: 'Workout changed and the original moved.',
          undo: await replaceAndMoveWorkoutPlanEntry(db, {
            entryId,
            originalTargetDate: targetDate,
            replacementRoutineId: routineId,
            today,
          }),
        };
      }),
    retry: refresh,
    selectWeek: setWeek,
    selectYear,
    start: async (entryId: string) => {
      setState((current) => ({ ...current, error: null, isSaving: true }));
      try {
        const db = await initializeLocalDatabase();
        const result = await startOrResumeWorkoutFromPlanEntry(db, entryId);
        router.push({
          pathname: '/workout-session/[id]',
          params: { id: result.session.workout_session_id },
        });
      } catch (error) {
        setState((current) => ({
          ...current,
          error: messageFrom(error, 'Workout could not be opened.'),
          isSaving: false,
        }));
      }
    },
    undoLast: state.undo
      ? () =>
          mutate(async () => {
            const db = await initializeLocalDatabase();
            await undoWorkoutPlanChange(db, state.undo as WorkoutPlanUndo);
            return { notice: 'Last plan change undone.' };
          })
      : null,
    goToToday,
  };
}

function safeInitialDate(value?: string): Date {
  if (!value) return new Date();
  try {
    return parseLocalDateKey(value);
  } catch {
    return new Date();
  }
}

function messageFrom(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

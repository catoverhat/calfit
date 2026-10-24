import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";

import {
  assignWorkoutToDate,
  copyWorkoutPlanWeek,
  getLocalUserProfile,
  getRoutineSummaries,
  getWorkoutPlanEntries,
  initializeLocalDatabase,
  moveWorkoutPlanEntry,
  removeWorkoutPlanEntry,
  replaceAndMoveWorkoutPlanEntry,
  seedDemoRoutinesIfEmpty,
  startOrResumeWorkoutFromPlanEntry,
  undoWorkoutPlanChange,
  type WorkoutPlanEntryDetail,
  type WorkoutPlanUndo,
} from "@/db";
import {
  addDaysToDateKey,
  getIsoWeek,
  getIsoWeekDateKeys,
  getIsoWeeksInYear,
  getIsoYearDateRange,
  parseLocalDateKey,
  toLocalDateKey,
} from "./plan-calendar";
import {
  createWorkoutPlanWeek,
  mapWorkoutDefinitions,
  type WorkoutDefinition,
  type WorkoutPlanWeek,
} from "./weekly-plan.viewmodel";

interface PlanState {
  entries: WorkoutPlanEntryDetail[];
  error: string | null;
  isLoading: boolean;
  isSaving: boolean;
  savingDates: string[];
  loadedYear: number | null;
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
    savingDates: [],
    loadedYear: null,
    notice: null,
    profileName: "Local Athlete",
    undo: null,
    workouts: [],
  });

  const mutationLock = useRef(false);
  const loadVersion = useRef(0);

  const today = toLocalDateKey(new Date());
  const dates = useMemo(() => getIsoWeekDateKeys(year, week), [week, year]);
  const currentIsoWeek = getIsoWeek(new Date());
  const weekModel: WorkoutPlanWeek = useMemo(
    () => createWorkoutPlanWeek(state.entries, year, week),
    [state.entries, week, year],
  );

  useFocusEffect(
    useCallback(() => {
      let active = true;
      const version = ++loadVersion.current;
      async function load() {
        setState((current) => ({
          ...current,
          error: null,
          isLoading: current.loadedYear !== year,
        }));
        try {
          const db = await initializeLocalDatabase();
          await seedDemoRoutinesIfEmpty(db);
          const range = getIsoYearDateRange(year);
          const [entries, routines, user] = await Promise.all([
            getWorkoutPlanEntries(db, range.startDate, range.endDate),
            getRoutineSummaries(db),
            getLocalUserProfile(db),
          ]);
          if (!active || version !== loadVersion.current) return;
          setState((current) => ({
            ...current,
            entries,
            error: null,
            isLoading: false,
            loadedYear: year,
            profileName: user.username,
            workouts: mapWorkoutDefinitions(routines),
          }));
        } catch (error) {
          if (!active || version !== loadVersion.current) return;
          setState((current) => ({
            ...current,
            error: messageFrom(error, "Weekly plan could not be loaded."),
            isLoading: false,
          }));
        }
      }
      load();
      return () => {
        active = false;
      };
      // The retry token deliberately restarts the focus refresh.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reloadKey, today, year]),
  );

  const refresh = useCallback(() => setReloadKey((value) => value + 1), []);
  const mutate = useCallback(
    async (
      task: () => Promise<{ notice?: string; undo?: WorkoutPlanUndo | null }>,
      affectedDates: string[] = dates,
    ) => {
      if (mutationLock.current) return;
      mutationLock.current = true;
      // Ignore a focus refresh that began before this write.
      ++loadVersion.current;
      setState((current) => ({
        ...current,
        error: null,
        isSaving: true,
        savingDates: affectedDates,
        notice: null,
      }));
      try {
        const result = await task();
        const db = await initializeLocalDatabase();
        const range = getIsoYearDateRange(year);
        const entries = await getWorkoutPlanEntries(
          db,
          range.startDate,
          range.endDate,
        );
        ++loadVersion.current;
        setState((current) => ({
          ...current,
          entries,
          loadedYear: year,
          isLoading: false,
          isSaving: false,
          savingDates: [],
          notice: result.notice ?? "Plan saved.",
          undo: result.undo ?? null,
        }));
      } catch (error) {
        setState((current) => ({
          ...current,
          error: messageFrom(error, "The plan could not be updated."),
          isSaving: false,
          savingDates: [],
        }));
      } finally {
        mutationLock.current = false;
      }
    },
    [dates, year],
  );

  const entryDates = (entryId: string) =>
    state.entries
      .filter((entry) => entry.workout_plan_entry_id === entryId)
      .map((entry) => entry.planned_date);

  const selectYear = useCallback((nextYear: number) => {
    if (mutationLock.current) return;
    setYear(nextYear);
    setWeek((current) => Math.min(current, getIsoWeeksInYear(nextYear)));
  }, []);

  const goToToday = useCallback(() => {
    if (mutationLock.current) return;
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
        return {
          undo: await assignWorkoutToDate(db, {
            plannedDate: date,
            routineId,
            today,
          }),
        };
      }, [date]),
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
            ? `Week copied. ${skipped} inactive workout${skipped === 1 ? "" : "s"} skipped.`
            : "Previous week copied.",
          undo: result.undo,
        };
      }),
    move: (entryId: string, targetDate: string) =>
      mutate(async () => {
        const db = await initializeLocalDatabase();
        return {
          notice: "Workout moved.",
          undo: await moveWorkoutPlanEntry(db, { entryId, targetDate, today }),
        };
      }, [...entryDates(entryId), targetDate]),
    remove: (entryId: string) =>
      mutate(async () => {
        const db = await initializeLocalDatabase();
        return {
          notice: "Assignment removed.",
          undo: await removeWorkoutPlanEntry(db, { entryId, today }),
        };
      }, entryDates(entryId)),
    replace: (date: string, routineId: string) =>
      mutate(async () => {
        const db = await initializeLocalDatabase();
        return {
          notice: "Workout replaced.",
          undo: await assignWorkoutToDate(db, {
            plannedDate: date,
            routineId,
            today,
          }),
        };
      }, [date]),
    replaceAndMove: (entryId: string, routineId: string, targetDate: string) =>
      mutate(async () => {
        const db = await initializeLocalDatabase();
        return {
          notice: "Workout changed and the original moved.",
          undo: await replaceAndMoveWorkoutPlanEntry(db, {
            entryId,
            originalTargetDate: targetDate,
            replacementRoutineId: routineId,
            today,
          }),
        };
      }, [...entryDates(entryId), targetDate]),
    retry: refresh,
    selectWeek: (nextWeek: number) => {
      if (!mutationLock.current) setWeek(nextWeek);
    },
    selectYear,
    start: async (entryId: string) => {
      if (mutationLock.current) return;
      mutationLock.current = true;
      setState((current) => ({
        ...current,
        error: null,
        isSaving: true,
        savingDates: entryDates(entryId),
      }));
      try {
        const db = await initializeLocalDatabase();
        const result = await startOrResumeWorkoutFromPlanEntry(db, entryId);
        router.push({
          pathname: "/workout-session/[id]",
          params: { id: result.session.workout_session_id },
        });
      } catch (error) {
        setState((current) => ({
          ...current,
          error: messageFrom(error, "Workout could not be opened."),
        }));
      } finally {
        mutationLock.current = false;
        setState((current) => ({
          ...current,
          isSaving: false,
          savingDates: [],
        }));
      }
    },
    undoLast: state.undo
      ? () =>
          mutate(async () => {
            const db = await initializeLocalDatabase();
            await undoWorkoutPlanChange(db, state.undo as WorkoutPlanUndo);
            return { notice: "Last plan change undone." };
          }, state.undo?.affectedDates ?? dates)
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

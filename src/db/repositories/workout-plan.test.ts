/// <reference types="jest" />

import {
  assignWorkoutToDate,
  completeWorkoutSession,
  copyWorkoutPlanWeek,
  getLegacyWorkoutPlanDays,
  getWorkoutPlanEntries,
  getWorkoutPlanSettings,
  getWorkoutSessionDetail,
  importLegacyWorkoutPlan,
  initializeLocalDatabase,
  moveWorkoutPlanEntry,
  removeWorkoutPlanEntry,
  removeFutureWorkoutPlanEntriesForRoutine,
  replaceAndMoveWorkoutPlanEntry,
  seedDemoRoutinesIfEmpty,
  startOrResumeWorkoutFromPlanEntry,
  startOrResumeWorkoutFromRoutine,
  undoWorkoutPlanChange,
  updateRoutine,
} from '@/db';
import { MemoryDb } from '../testing/memory-database';

const TODAY = '2026-10-22';

async function createDb() {
  const db = new MemoryDb();
  await initializeLocalDatabase(db);
  await seedDemoRoutinesIfEmpty(db, undefined, '2026-10-22T12:00:00.000Z');
  return db;
}

describe('workout plan repository', () => {
  it('enforces one entry per date while allowing a workout on multiple dates', async () => {
    const db = await createDb();
    await assignWorkoutToDate(db, { plannedDate: '2026-10-22', routineId: 'push-day', today: TODAY });
    await assignWorkoutToDate(db, { plannedDate: '2026-10-24', routineId: 'push-day', today: TODAY });
    const replacementUndo = await assignWorkoutToDate(db, {
      plannedDate: '2026-10-22',
      routineId: 'leg-day',
      today: TODAY,
    });

    let entries = await getWorkoutPlanEntries(db, '2026-10-22', '2026-10-24');
    expect(entries).toHaveLength(2);
    expect(entries.map((entry) => entry.routine_id_fk)).toEqual(['leg-day', 'push-day']);

    await undoWorkoutPlanChange(db, replacementUndo);
    entries = await getWorkoutPlanEntries(db, '2026-10-22', '2026-10-24');
    expect(entries.map((entry) => entry.routine_id_fk)).toEqual(['push-day', 'push-day']);
  });

  it('moves to an empty date, swaps occupied dates, removes, and undoes each action', async () => {
    const db = await createDb();
    await assignWorkoutToDate(db, { plannedDate: '2026-10-22', routineId: 'push-day', today: TODAY });
    await assignWorkoutToDate(db, { plannedDate: '2026-10-23', routineId: 'leg-day', today: TODAY });
    const original = await getWorkoutPlanEntries(db, '2026-10-22', '2026-10-23');

    const swapUndo = await moveWorkoutPlanEntry(db, {
      entryId: original[0].workout_plan_entry_id,
      targetDate: '2026-10-23',
      today: TODAY,
    });
    expect((await getWorkoutPlanEntries(db, '2026-10-22', '2026-10-23')).map((entry) => entry.routine_id_fk))
      .toEqual(['leg-day', 'push-day']);
    await undoWorkoutPlanChange(db, swapUndo);

    const moveUndo = await moveWorkoutPlanEntry(db, {
      entryId: original[0].workout_plan_entry_id,
      targetDate: '2026-10-24',
      today: TODAY,
    });
    expect((await getWorkoutPlanEntries(db, '2026-10-22', '2026-10-24')).map((entry) => entry.planned_date))
      .toEqual(['2026-10-23', '2026-10-24']);
    await undoWorkoutPlanChange(db, moveUndo);

    const restored = await getWorkoutPlanEntries(db, '2026-10-22', '2026-10-23');
    const removeUndo = await removeWorkoutPlanEntry(db, {
      entryId: restored[0].workout_plan_entry_id,
      today: TODAY,
    });
    expect(await getWorkoutPlanEntries(db, '2026-10-22', '2026-10-22')).toHaveLength(0);
    await undoWorkoutPlanChange(db, removeUndo);
    expect(await getWorkoutPlanEntries(db, '2026-10-22', '2026-10-22')).toHaveLength(1);
  });

  it('replaces a date while moving its original workout to an empty date', async () => {
    const db = await createDb();
    await assignWorkoutToDate(db, { plannedDate: '2026-10-22', routineId: 'push-day', today: TODAY });
    const [entry] = await getWorkoutPlanEntries(db, '2026-10-22', '2026-10-22');
    const undo = await replaceAndMoveWorkoutPlanEntry(db, {
      entryId: entry.workout_plan_entry_id,
      originalTargetDate: '2026-10-25',
      replacementRoutineId: 'leg-day',
      today: TODAY,
    });

    expect((await getWorkoutPlanEntries(db, '2026-10-22', '2026-10-25')).map((item) => [item.planned_date, item.routine_id_fk]))
      .toEqual([['2026-10-22', 'leg-day'], ['2026-10-25', 'push-day']]);
    await undoWorkoutPlanChange(db, undo);
    expect((await getWorkoutPlanEntries(db, '2026-10-22', '2026-10-25')).map((item) => item.routine_id_fk))
      .toEqual(['push-day']);
  });

  it('copies only eligible current-week dates and skips inactive workouts', async () => {
    const db = await createDb();
    await assignWorkoutToDate(db, { plannedDate: '2026-10-14', routineId: 'push-day', today: '2026-10-01' });
    await assignWorkoutToDate(db, { plannedDate: '2026-10-15', routineId: 'leg-day', today: '2026-10-01' });
    await updateRoutine(db, {
      routineId: 'leg-day',
      name: 'Leg Day',
      active: false,
    });

    const result = await copyWorkoutPlanWeek(db, {
      sourceDates: ['2026-10-12', '2026-10-13', '2026-10-14', '2026-10-15', '2026-10-16', '2026-10-17', '2026-10-18'],
      targetDates: ['2026-10-19', '2026-10-20', '2026-10-21', '2026-10-22', '2026-10-23', '2026-10-24', '2026-10-25'],
      today: TODAY,
    });

    expect(result.skippedInactive).toBe(1);
    expect(await getWorkoutPlanEntries(db, '2026-10-19', '2026-10-25')).toHaveLength(0);
  });

  it('creates and links the session snapshot only when a planned workout starts', async () => {
    const db = await createDb();
    await assignWorkoutToDate(db, { plannedDate: TODAY, routineId: 'push-day', today: TODAY });
    await updateRoutine(db, {
      routineId: 'push-day',
      name: 'Push Day Updated Before Start',
      exercises: [{ exerciseId: 'bench-press', targets: [{ targetReps: 3, targetWeight: 90 }] }],
    });
    const [entry] = await getWorkoutPlanEntries(db, TODAY, TODAY);
    expect(db.tables.get('workout_sessions')).toHaveLength(0);

    const started = await startOrResumeWorkoutFromPlanEntry(db, entry.workout_plan_entry_id, '2026-10-22T14:00:00.000Z');
    const linked = await getWorkoutPlanEntries(db, TODAY, TODAY);
    const session = await getWorkoutSessionDetail(db, started.session.workout_session_id);
    expect(linked[0].workout_session_id_fk).toBe(started.session.workout_session_id);
    expect(session?.routine_name).toBe('Push Day Updated Before Start');
    expect(session?.exercises[0].sets[0]).toEqual(expect.objectContaining({ reps: 3, weight: 90 }));

    await expect(removeWorkoutPlanEntry(db, { entryId: entry.workout_plan_entry_id, today: TODAY }))
      .rejects.toThrow('cannot be changed');
    const resumed = await startOrResumeWorkoutFromPlanEntry(db, entry.workout_plan_entry_id);
    expect(resumed.resumed).toBe(true);
    expect(resumed.session.workout_session_id).toBe(started.session.workout_session_id);

    await completeWorkoutSession(db, started.session.workout_session_id, '2026-10-22T15:00:00.000Z');
    await expect(moveWorkoutPlanEntry(db, {
      entryId: entry.workout_plan_entry_id,
      targetDate: '2026-10-23',
      today: TODAY,
    })).rejects.toThrow('cannot be changed');
  });

  it('imports one selected legacy workout per date once and rolls back failed imports', async () => {
    const db = await createDb();
    const days = await getLegacyWorkoutPlanDays(
      db,
      ['2026-10-19', '2026-10-20', '2026-10-21', '2026-10-22', '2026-10-23', '2026-10-24', '2026-10-25'],
      TODAY
    );
    expect(days.find((day) => day.date === '2026-10-23')?.routines.map((routine) => routine.routine_id))
      .toEqual(expect.arrayContaining(['push-day', 'full-body-power']));

    await updateRoutine(db, { routineId: 'leg-day', name: 'Leg Day', active: false });
    await expect(importLegacyWorkoutPlan(db, {
      selections: [
        { date: '2026-10-23', routineId: 'push-day' },
        { date: '2026-10-24', routineId: 'leg-day' },
      ],
    })).rejects.toThrow('active workout');
    expect(await getWorkoutPlanEntries(db, '2026-10-23', '2026-10-24')).toHaveLength(0);
    expect((await getWorkoutPlanSettings(db)).legacy_import_handled).toBe(0);

    await importLegacyWorkoutPlan(db, {
      selections: [{ date: '2026-10-23', routineId: 'full-body-power' }],
    });
    expect((await getWorkoutPlanSettings(db)).legacy_import_handled).toBe(1);
    expect((await getWorkoutPlanEntries(db, '2026-10-23', '2026-10-23'))[0].routine_id_fk)
      .toBe('full-body-power');
  });

  it('rejects changes to past dates', async () => {
    const db = await createDb();
    await expect(assignWorkoutToDate(db, {
      plannedDate: '2026-10-21',
      routineId: 'push-day',
      today: TODAY,
    })).rejects.toThrow('read-only');
  });

  it('removes only future assignments when a workout is deactivated', async () => {
    const db = await createDb();
    await assignWorkoutToDate(db, {
      plannedDate: '2026-10-20',
      routineId: 'push-day',
      today: '2026-10-01',
    });
    await assignWorkoutToDate(db, {
      plannedDate: '2026-10-24',
      routineId: 'push-day',
      today: TODAY,
    });

    await removeFutureWorkoutPlanEntriesForRoutine(db, { routineId: 'push-day', today: TODAY });
    const remaining = await getWorkoutPlanEntries(db, '2026-10-01', '2026-10-31');
    expect(remaining.map((entry) => entry.planned_date)).toEqual(['2026-10-20']);
  });

  it('keeps library-started workout sessions ad hoc', async () => {
    const db = await createDb();
    await startOrResumeWorkoutFromRoutine(db, {
      id: 'ad-hoc-session',
      routineId: 'push-day',
      now: '2026-10-22T12:00:00.000Z',
    });
    expect(await getWorkoutPlanEntries(db, TODAY, TODAY)).toHaveLength(0);
  });
});

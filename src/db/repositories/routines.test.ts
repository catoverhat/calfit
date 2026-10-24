/// <reference types="jest" />

import {
  completeWorkoutSession,
  createRoutine,
  getTodayRoutine,
  getRoutineSummaries,
  getWorkoutSessionDetail,
  initializeLocalDatabase,
  seedBuiltInExercisesIfEmpty,
  seedDemoRoutinesIfEmpty,
  seedStarterRoutineIfEmpty,
  startWorkoutFromRoutine,
  updateRoutine,
} from '@/db';
import { MemoryDb } from '../testing/memory-database';

describe('routine repository', () => {
  it('seeds a starter routine once and can load today/session detail', async () => {
    const db = new MemoryDb();

    await initializeLocalDatabase(db);

    const seededRoutine = await seedStarterRoutineIfEmpty(db, undefined, '2026-07-06T12:00:00.000Z');
    const seededAgain = await seedStarterRoutineIfEmpty(db, undefined, '2026-07-06T12:00:00.000Z');
    const todayRoutine = await getTodayRoutine(db, undefined, new Date('2026-07-06T12:00:00.000Z'));

    expect(seededRoutine.routine_id).toBe(seededAgain.routine_id);
    expect(db.tables.get('routines')).toHaveLength(4);
    expect(todayRoutine?.exercises.map((exercise) => exercise.exercise.name)).toEqual([
      'Bench Press',
      'Shoulder Press',
      'Push-ups',
    ]);
    expect(todayRoutine?.schedules.map((schedule) => schedule.day_of_week)).toEqual([1, 3, 5]);

    const summaries = await getRoutineSummaries(db);
    expect(summaries).toHaveLength(4);
    expect(summaries.find((routine) => routine.routine_id === 'running-day')).toEqual(
      expect.objectContaining({ focus: 'cardio', schedule_days: [3, 6] })
    );

    const session = await startWorkoutFromRoutine(db, {
      id: 'starter-session',
      routineId: seededRoutine.routine_id,
      now: '2026-07-06T15:00:00.000Z',
      startedAt: '2026-07-06T15:00:00.000Z',
    });
    const detail = await getWorkoutSessionDetail(db, session.workout_session_id);

    expect(detail?.routine_name).toBe('Push Day');
    expect(detail?.exercises).toHaveLength(3);
    expect(detail?.exercises[0].sets).toHaveLength(4);
    expect(detail?.exercises[0].sets[0]).toEqual(
      expect.objectContaining({
        reps: 8,
        weight: 70,
        rest_time_seconds: 90,
        completed: 0,
      })
    );

    await completeWorkoutSession(db, session.workout_session_id, '2026-07-06T16:00:00.000Z');
    const completedSummaries = await getRoutineSummaries(db);
    expect(completedSummaries.find((routine) => routine.routine_id === 'push-day')?.last_completed_at)
      .toBe('2026-07-06T16:00:00.000Z');
  });

  it('replaces ordered exercises, targets, and schedules without duplicating seed data', async () => {
    const db = new MemoryDb();
    await initializeLocalDatabase(db);
    await seedDemoRoutinesIfEmpty(db, undefined, '2026-07-06T12:00:00.000Z');

    await updateRoutine(db, {
      routineId: 'push-day',
      name: 'Push Day Updated',
      description: 'A smaller push session.',
      active: true,
      scheduleDays: [0, 6],
      exercises: [
        {
          exerciseId: 'bench-press',
          targets: [
            { targetReps: 6, targetWeight: 80, restTimeSeconds: 120 },
            { targetReps: null, targetWeight: 82.5, restTimeSeconds: 120 },
          ],
        },
      ],
      now: '2026-07-07T12:00:00.000Z',
    });

    const updated = await getTodayRoutine(db, undefined, new Date(2026, 6, 12, 12));
    expect(updated).toEqual(
      expect.objectContaining({
        name: 'Push Day Updated',
        schedules: [expect.objectContaining({ day_of_week: 0 }), expect.objectContaining({ day_of_week: 6 })],
      })
    );
    expect(updated?.exercises).toHaveLength(1);
    expect(updated?.exercises[0].targets).toEqual([
      expect.objectContaining({ target_reps: 6, target_weight: 80 }),
      expect.objectContaining({ target_reps: null, target_weight: 82.5 }),
    ]);
    expect(db.tables.get('routines')).toHaveLength(4);
  });

  it('does not add demo routines when the user already has routine data', async () => {
    const db = new MemoryDb();
    await initializeLocalDatabase(db);
    await seedBuiltInExercisesIfEmpty(db);
    await createRoutine(db, {
      id: 'my-routine',
      name: 'My Routine',
      exercises: [{ exerciseId: 'squat', targets: [{ targetReps: 5 }] }],
    });

    const result = await seedDemoRoutinesIfEmpty(db);

    expect(result.routine_id).toBe('my-routine');
    expect(db.tables.get('routines')).toHaveLength(1);
  });

  it('prioritizes a due routine that has not been completed', async () => {
    const db = new MemoryDb();
    const friday = new Date('2026-07-10T12:00:00.000Z');
    await initializeLocalDatabase(db);
    await seedDemoRoutinesIfEmpty(db, undefined, friday.toISOString());

    const first = await getTodayRoutine(db, undefined, friday);
    expect(first?.routine_id).toBe('full-body-power');
    const session = await startWorkoutFromRoutine(db, {
      routineId: 'full-body-power', now: '2026-07-10T13:00:00.000Z',
    });
    await completeWorkoutSession(db, session.workout_session_id, '2026-07-10T14:00:00.000Z');

    await expect(getTodayRoutine(db, undefined, friday)).resolves.toEqual(
      expect.objectContaining({ routine_id: 'push-day' })
    );
  });

});

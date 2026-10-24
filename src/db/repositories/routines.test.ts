/// <reference types="jest" />

import {
  completeWorkoutSession,
  createRoutine,
  getRoutineDetail,
  getRoutineSummaries,
  getWorkoutSessionDetail,
  initializeLocalDatabase,
  seedBuiltInExercisesIfEmpty,
  seedDemoRoutinesIfEmpty,
  startWorkoutFromRoutine,
  updateRoutine,
} from '@/db';
import { MemoryDb } from '../testing/memory-database';

describe('routine repository', () => {
  it('seeds a demo workouts once and loads session detail', async () => {
    const db = new MemoryDb();

    await initializeLocalDatabase(db);

    const seededRoutine = await seedDemoRoutinesIfEmpty(db, undefined, '2026-07-06T12:00:00.000Z');
    const seededAgain = await seedDemoRoutinesIfEmpty(db, undefined, '2026-07-06T12:00:00.000Z');
    const routine = await getRoutineDetail(db, 'push-day');

    expect(seededRoutine.routine_id).toBe(seededAgain.routine_id);
    expect(db.tables.get('routines')).toHaveLength(4);
    expect(routine?.exercises.map((exercise) => exercise.exercise.name)).toEqual([
      'Bench Press',
      'Shoulder Press',
      'Push-ups',
    ]);

    const summaries = await getRoutineSummaries(db);
    expect(summaries).toHaveLength(4);
    expect(summaries.find((routine) => routine.routine_id === 'running-day')).toEqual(
      expect.objectContaining({ focus: 'cardio' })
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

  it('replaces ordered exercises and targets without duplicating seed data', async () => {
    const db = new MemoryDb();
    await initializeLocalDatabase(db);
    await seedDemoRoutinesIfEmpty(db, undefined, '2026-07-06T12:00:00.000Z');

    await updateRoutine(db, {
      routineId: 'push-day',
      name: 'Push Day Updated',
      description: 'A smaller push session.',
      active: true,
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

    const updated = await getRoutineDetail(db, 'push-day');
    expect(updated).toEqual(
      expect.objectContaining({
        name: 'Push Day Updated',
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

});

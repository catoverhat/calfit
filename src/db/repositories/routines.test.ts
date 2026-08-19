/// <reference types="jest" />

import {
  getTodayRoutine,
  getWorkoutSessionDetail,
  initializeLocalDatabase,
  seedStarterRoutineIfEmpty,
  startWorkoutFromRoutine,
} from '@/db';
import { MemoryDb } from '../testing/memory-database';

describe('routine repository', () => {
  it('seeds a starter routine once and can load today/session detail', async () => {
    const db = new MemoryDb();

    await initializeLocalDatabase(db);

    const seededRoutine = await seedStarterRoutineIfEmpty(db);
    const seededAgain = await seedStarterRoutineIfEmpty(db);
    const todayRoutine = await getTodayRoutine(db);

    expect(seededRoutine.routine_id).toBe(seededAgain.routine_id);
    expect(db.tables.get('routines')).toHaveLength(1);
    expect(todayRoutine?.exercises.map((exercise) => exercise.exercise.name)).toEqual([
      'Bench Press',
      'Shoulder Press',
      'Push-ups',
    ]);

    const session = await startWorkoutFromRoutine(db, {
      id: 'starter-session',
      routineId: seededRoutine.routine_id,
      now: '2026-07-06T15:00:00.000Z',
      startedAt: '2026-07-06T15:00:00.000Z',
    });
    const detail = await getWorkoutSessionDetail(db, session.workout_session_id);

    expect(detail?.routine_name).toBe('Push Day');
    expect(detail?.exercises).toHaveLength(3);
    expect(detail?.exercises[0].sets).toHaveLength(3);
    expect(detail?.exercises[0].sets[0]).toEqual(
      expect.objectContaining({
        reps: 10,
        weight: 60,
        rest_time_seconds: 90,
        completed: 0,
      })
    );
  });

});

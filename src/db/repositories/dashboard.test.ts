/// <reference types="jest" />

import {
  completeWorkoutSession,
  createBodyMeasurement,
  getTodayDashboardSnapshot,
  getTodayRoutine,
  getWorkoutStreak,
  initializeLocalDatabase,
  LOCAL_USER_ID,
  seedStarterRoutineIfEmpty,
  startWorkoutFromRoutine,
} from '@/db';
import { MemoryDb } from '../testing/memory-database';

describe('dashboard repository', () => {
  it('loads dashboard measurements and workout streak from local data', async () => {
    const db = new MemoryDb();

    await initializeLocalDatabase(db);
    await seedStarterRoutineIfEmpty(db);

    const emptySnapshot = await getTodayDashboardSnapshot(db, LOCAL_USER_ID, new Date('2026-07-06T12:00:00.000Z'));

    expect(emptySnapshot.latestBodyMeasurement).toBeNull();
    expect(emptySnapshot.workoutStreak).toBe(0);

    await createBodyMeasurement(db, {
      id: 'measurement-old',
      weight: 82.4,
      createdAt: '2026-07-01T08:00:00.000Z',
    });
    await createBodyMeasurement(db, {
      id: 'measurement-new',
      weight: 81.7,
      createdAt: '2026-07-06T08:00:00.000Z',
    });

    const routine = await getTodayRoutine(db);
    if (!routine) throw new Error('Expected seeded routine');

    const todaySession = await startWorkoutFromRoutine(db, {
      id: 'session-today',
      routineId: routine.routine_id,
      now: '2026-07-06T10:00:00.000Z',
      startedAt: '2026-07-06T10:00:00.000Z',
    });
    await completeWorkoutSession(db, todaySession.workout_session_id, '2026-07-06T11:00:00.000Z');

    const yesterdaySession = await startWorkoutFromRoutine(db, {
      id: 'session-yesterday',
      routineId: routine.routine_id,
      now: '2026-07-05T10:00:00.000Z',
      startedAt: '2026-07-05T10:00:00.000Z',
    });
    await completeWorkoutSession(db, yesterdaySession.workout_session_id, '2026-07-05T11:00:00.000Z');

    const streak = await getWorkoutStreak(db, LOCAL_USER_ID, new Date('2026-07-06T12:00:00.000Z'));
    const snapshot = await getTodayDashboardSnapshot(db, LOCAL_USER_ID, new Date('2026-07-06T12:00:00.000Z'));

    expect(streak).toBe(2);
    expect(snapshot.latestBodyMeasurement?.body_measurement_id).toBe('measurement-new');
    expect(snapshot.previousBodyMeasurement?.body_measurement_id).toBe('measurement-old');
    expect(snapshot.workoutStreak).toBe(2);
    expect(snapshot.completedWorkoutCount).toBe(2);
  });
});

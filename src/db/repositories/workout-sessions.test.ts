/// <reference types="jest" />

import {
  completeWorkoutSession,
  createExercise,
  createRoutine,
  getRoutineDetail,
  getWorkoutHistory,
  getWorkoutSessionDetail,
  initializeLocalDatabase,
  logWorkoutSet,
  startOrResumeWorkoutFromRoutine,
  startWorkoutFromRoutine,
  updateRoutine,
  updateRoutineExerciseTarget,
} from '@/db';
import { MemoryDb } from '../testing/memory-database';

describe('workout session repository', () => {
  it('runs the first routine-to-workout slice with copied workout history', async () => {
    const db = new MemoryDb();
    const now = '2026-07-06T12:00:00.000Z';

    await initializeLocalDatabase(db);

    const squat = await createExercise(db, {
      id: 'exercise-squat',
      name: 'Back Squat',
      categoryId: 'cat-legs',
      now,
    });
    const bench = await createExercise(db, {
      id: 'exercise-bench',
      name: 'Bench Press',
      categoryId: 'cat-chest',
      now,
    });

    const routine = await createRoutine(db, {
      id: 'routine-strength',
      name: 'Strength A',
      description: 'Heavy compound day',
      now,
      exercises: [
        {
          id: 'routine-exercise-squat',
          exerciseId: squat.exercise_id,
          targets: [
            { id: 'target-squat-1', targetReps: 5, targetWeight: 140, restTimeSeconds: 180 },
            { id: 'target-squat-2', targetReps: 5, targetWeight: 140, restTimeSeconds: 180 },
          ],
        },
        {
          id: 'routine-exercise-bench',
          exerciseId: bench.exercise_id,
          targets: [{ id: 'target-bench-1', targetReps: 8, targetWeight: 90, restTimeSeconds: 120 }],
        },
      ],
    });

    expect(routine.exercises.map((exercise) => exercise.exercise.name)).toEqual(['Back Squat', 'Bench Press']);
    expect(routine.exercises.map((exercise) => exercise.order_index)).toEqual([0, 1]);

    const session = await startWorkoutFromRoutine(db, {
      id: 'session-strength',
      routineId: routine.routine_id,
      startedAt: '2026-07-06T13:00:00.000Z',
      now: '2026-07-06T13:00:00.000Z',
    });
    let history = await getWorkoutHistory(db);
    const squatFirstSet = history[0].exercises[0].sets[0];

    await logWorkoutSet(db, squatFirstSet.workout_set_id, {
      reps: 5,
      weight: 142.5,
      completed: true,
    });
    await completeWorkoutSession(db, session.workout_session_id, '2026-07-06T14:05:00.000Z');
    await updateRoutine(db, {
      routineId: routine.routine_id,
      name: 'Strength A Edited',
      description: 'Edited later',
      now: '2026-07-07T09:00:00.000Z',
    });
    await updateRoutineExerciseTarget(db, {
      routineExerciseTargetId: 'target-squat-1',
      targetReps: 3,
      targetWeight: 160,
      restTimeSeconds: 240,
    });

    history = await getWorkoutHistory(db);
    const updatedRoutine = await getRoutineDetail(db, routine.routine_id);
    const completedSession = history[0];
    const sessionDetail = await getWorkoutSessionDetail(db, session.workout_session_id);

    expect(updatedRoutine?.name).toBe('Strength A Edited');
    expect(updatedRoutine?.exercises[0].targets[0]).toEqual(
      expect.objectContaining({ target_reps: 3, target_weight: 160, rest_time_seconds: 240 })
    );
    expect(completedSession.status).toBe('completed');
    expect(completedSession.completed_at).toBe('2026-07-06T14:05:00.000Z');
    expect(completedSession.exercises.map((exercise) => exercise.exercise.name)).toEqual(['Back Squat', 'Bench Press']);
    expect(completedSession.exercises[0].sets[0]).toEqual(
      expect.objectContaining({
        reps: 5,
        weight: 142.5,
        rest_time_seconds: 180,
        completed: 1,
      })
    );
    expect(completedSession.exercises[0].sets[1]).toEqual(
      expect.objectContaining({
        reps: 5,
        weight: 140,
        rest_time_seconds: 180,
        completed: 0,
      })
    );
    expect(sessionDetail).toEqual(expect.objectContaining({ workout_session_id: 'session-strength', status: 'completed' }));

    await startWorkoutFromRoutine(db, {
      id: 'session-scheduled',
      routineId: routine.routine_id,
      scheduledFor: '2026-07-08T13:00:00.000Z',
      now: '2026-07-07T10:00:00.000Z',
      status: 'scheduled',
    });
    history = await getWorkoutHistory(db);
    expect(history.map((item) => item.status)).toEqual(expect.arrayContaining(['completed', 'scheduled']));
    expect(await getWorkoutSessionDetail(db, 'session-scheduled')).toEqual(
      expect.objectContaining({ started_at: null, status: 'scheduled' })
    );
  });

  it('resumes an active session and timestamps completed sets', async () => {
    const db = new MemoryDb();
    await initializeLocalDatabase(db);
    const exercise = await createExercise(db, {
      id: 'resume-exercise', name: 'Row', categoryId: 'cat-back',
    });
    const routine = await createRoutine(db, {
      id: 'resume-routine', name: 'Resume',
      exercises: [{ exerciseId: exercise.exercise_id, targets: [{ targetReps: 8 }] }],
    });
    const created = await startOrResumeWorkoutFromRoutine(db, {
      id: 'active-session', routineId: routine.routine_id, now: '2026-09-10T10:00:00.000Z',
    });
    const resumed = await startOrResumeWorkoutFromRoutine(db, {
      id: 'should-not-exist', routineId: routine.routine_id, now: '2026-09-10T11:00:00.000Z',
    });
    expect(created.resumed).toBe(false);
    expect(resumed.resumed).toBe(true);
    expect(resumed.session.workout_session_id).toBe('active-session');
    expect(db.tables.get('workout_sessions')).toHaveLength(1);

    const detail = await getWorkoutSessionDetail(db, 'active-session');
    const setId = detail?.exercises[0].sets[0].workout_set_id;
    if (!setId) throw new Error('Expected workout set');
    await logWorkoutSet(db, setId, {
      completed: true, completedAt: '2026-09-10T10:05:00.000Z',
    });
    const updated = await getWorkoutSessionDetail(db, 'active-session');
    expect(updated?.exercises[0].sets[0]).toEqual(expect.objectContaining({
      completed: 1, completed_at: '2026-09-10T10:05:00.000Z',
    }));
  });

});

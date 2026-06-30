/// <reference types="jest" />

import {
  createWorkoutSessionState,
  formatSessionDuration,
  getActiveSet,
  isExerciseComplete,
  workoutSessionReducer,
  type SessionExerciseSeed,
} from './session-state';

const exercises: SessionExerciseSeed[] = [
  {
    id: 'squat',
    name: 'Squat',
    tip: 'Stay tall.',
    sessionSets: [
      { id: 'squat-1', weight: '135', reps: '10', completed: true },
      { id: 'squat-2', weight: '155', reps: '8', completed: false },
    ],
  },
  {
    id: 'press',
    name: 'Press',
    tip: 'Brace.',
    sessionSets: [{ id: 'press-1', weight: '45', reps: '8', completed: false }],
  },
];

describe('workout session state', () => {
  it('formats the session timer', () => {
    expect(formatSessionDuration(1455)).toBe('00:24:15');
    expect(formatSessionDuration(3661)).toBe('01:01:01');
  });

  it('edits only the active set', () => {
    const state = createWorkoutSessionState(exercises);
    const updated = workoutSessionReducer(state, {
      type: 'update-set',
      field: 'weight',
      setId: 'squat-2',
      value: '160',
    });

    expect(getActiveSet(updated.exercises[0])?.weight).toBe('160');
    expect(
      workoutSessionReducer(updated, {
        type: 'update-set',
        field: 'weight',
        setId: 'squat-1',
        value: '0',
      }),
    ).toBe(updated);
  });

  it('finishes sets and advances only after the exercise is complete', () => {
    const state = createWorkoutSessionState(exercises);
    expect(workoutSessionReducer(state, { type: 'next-exercise' })).toBe(state);

    const finished = workoutSessionReducer(state, { type: 'finish-set' });
    expect(isExerciseComplete(finished.exercises[0])).toBe(true);

    const advanced = workoutSessionReducer(finished, { type: 'next-exercise' });
    expect(advanced.currentExerciseIndex).toBe(1);
  });

  it('adds a set using the previous values', () => {
    const state = createWorkoutSessionState(exercises);
    const updated = workoutSessionReducer(state, { type: 'add-set' });
    const added = updated.exercises[0].sets.at(-1);

    expect(added).toMatchObject({ number: 3, weight: '155', reps: '8', completed: false });
  });

  it('keeps the session on the final exercise after every set is complete', () => {
    let state = createWorkoutSessionState(exercises);
    state = workoutSessionReducer(state, { type: 'finish-set' });
    state = workoutSessionReducer(state, { type: 'next-exercise' });
    state = workoutSessionReducer(state, { type: 'finish-set' });

    expect(isExerciseComplete(state.exercises[1])).toBe(true);
    expect(workoutSessionReducer(state, { type: 'next-exercise' })).toBe(state);
  });
});

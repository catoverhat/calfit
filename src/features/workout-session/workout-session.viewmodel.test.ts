/// <reference types="jest" />

import type { WorkoutSessionDetail } from '@/db';

import { mapWorkoutSessionToViewModel } from './workout-session.viewmodel';

const session: WorkoutSessionDetail = {
  workout_session_id: 'session-1',
  user_id_fk: 'local-user',
  routine_id_fk: 'routine-1',
  routine_name: 'Push Day',
  scheduled_for: null,
  started_at: '2026-07-06T13:00:00.000Z',
  completed_at: null,
  status: 'in_progress',
  created_at: '2026-07-06T13:00:00.000Z',
  exercises: [
    {
      workout_exercise_id: 'workout-exercise-1',
      workout_session_id_fk: 'session-1',
      exercise_id_fk: 'exercise-1',
      order_index: 0,
      created_at: '2026-07-06T13:00:00.000Z',
      exercise: {
        exercise_id: 'exercise-1',
        name: 'Bench Press',
        description: null,
        image_url: null,
        video_url: null,
        active: 1,
        user_id_fk: 'local-user',
        category_id_fk: 'cat-chest',
        created_at: '2026-07-06T12:00:00.000Z',
        updated_at: '2026-07-06T12:00:00.000Z',
      },
      sets: [
        createSet('workout-set-1', 1, 8, 60),
        createSet('workout-set-2', 2, 10, 65),
      ],
    },
  ],
};

describe('workout session view model', () => {
  it('maps a local workout session into the active workout shape', () => {
    const workout = mapWorkoutSessionToViewModel(session);

    expect(workout).toEqual(
      expect.objectContaining({
        id: 'session-1',
        title: 'Push Day',
        intensity: 'In Progress',
      })
    );
    expect(workout.exercises).toEqual([
      expect.objectContaining({
        id: 'workout-exercise-1',
        name: 'Bench Press',
        sets: 2,
        reps: '8-10 reps',
      }),
    ]);
  });
});

function createSet(id: string, setNumber: number, reps: number, weight: number) {
  return {
    workout_set_id: id,
    workout_exercise_id_fk: 'workout-exercise-1',
    set_number: setNumber,
    reps,
    weight,
    speed: null,
    duration_seconds: null,
    distance: null,
    rest_time_seconds: 90,
    completed: 0,
    created_at: '2026-07-06T13:00:00.000Z',
  };
}

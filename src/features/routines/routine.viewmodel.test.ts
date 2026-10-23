/// <reference types="jest" />

import { mapRoutineSummary } from './routine.viewmodel';
import { validateRoutineDraft } from './use-routine-editor';
import type { RoutineDraft } from './routine-draft-context';

const draft: RoutineDraft = {
  active: true,
  description: '',
  exercises: [
    {
      id: 'draft-exercise',
      exerciseId: 'bench-press',
      imageUrl: null,
      name: 'Bench Press',
      targets: [{ id: 'target', reps: '8', weight: '', speed: '', duration: '', distance: '', rest: '90' }],
    },
  ],
  name: 'Push Day',
  scheduleDays: [1, 3, 5],
  sourceKey: 'create',
};

describe('routine view models', () => {
  it('maps database schedule days and completion state without mock labels', () => {
    const result = mapRoutineSummary({
      routine_id: 'push-day',
      user_id_fk: 'local-user',
      name: 'Push Day',
      description: null,
      active: 1,
      created_at: '2026-07-06T12:00:00.000Z',
      updated_at: '2026-07-06T12:00:00.000Z',
      exercise_count: 3,
      set_count: 10,
      schedule_days: [1, 3, 5],
      last_completed_at: null,
      image_url: null,
      focus: 'strength',
    });

    expect(result.schedule.map((day) => day.longLabel)).toEqual(['Monday', 'Wednesday', 'Friday']);
    expect(result.lastCompleted).toBe('Never completed');
    expect(result.description).toBe('No description yet.');
  });

  it('validates routine names, exercises, and target sets', () => {
    expect(validateRoutineDraft(draft)).toBeNull();
    expect(validateRoutineDraft({ ...draft, name: '   ' })).toBe('Workout name is required.');
    expect(validateRoutineDraft({ ...draft, exercises: [] })).toBe('Add at least one exercise.');
    expect(
      validateRoutineDraft({
        ...draft,
        exercises: [{ ...draft.exercises[0], targets: [] }],
      })
    ).toBe('Every exercise needs at least one target set.');
  });
});

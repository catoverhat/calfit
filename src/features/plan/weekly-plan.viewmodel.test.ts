/// <reference types="jest" />

import type { WorkoutPlanEntryDetail } from '@/db';
import { createWorkoutPlanWeek, getPlanEntryState } from './weekly-plan.viewmodel';

describe('weekly plan view model', () => {
  it('marks missing past assignments as missed and empty dates as rest', () => {
    const entry = planEntry();
    const week = createWorkoutPlanWeek([entry], 2026, 43, new Date(2026, 9, 22, 12));
    expect(week.days.find((day) => day.date === '2026-10-20')?.state).toBe('missed');
    expect(week.days.find((day) => day.date === '2026-10-21')?.state).toBe('rest');
    expect(week.days.find((day) => day.date === '2026-10-21')?.editable).toBe(false);
  });

  it('prioritizes session and availability states', () => {
    const entry = planEntry();
    expect(getPlanEntryState({ ...entry, routine: { ...entry.routine, active: 0 } }, '2026-10-23', '2026-10-22')).toBe('unavailable');
    expect(getPlanEntryState({ ...entry, session: { ...session(), status: 'completed' } }, '2026-10-20', '2026-10-22')).toBe('completed');
  });

  it('considers only the selected week when deciding whether it is empty', () => {
    const outsideWeek = { ...planEntry(), planned_date: '2026-11-03' };
    expect(createWorkoutPlanWeek([outsideWeek], 2026, 43).isEmpty).toBe(true);
  });
});

function planEntry(): WorkoutPlanEntryDetail {
  return {
    workout_plan_entry_id: 'plan-1', user_id_fk: 'local-user', routine_id_fk: 'workout-1',
    planned_date: '2026-10-20', workout_session_id_fk: null,
    created_at: '2026-10-01T12:00:00.000Z', updated_at: '2026-10-01T12:00:00.000Z',
    session: null,
    routine: {
      routine_id: 'workout-1', user_id_fk: 'local-user', name: 'Push Day', description: null,
      active: 1, created_at: '2026-10-01T12:00:00.000Z', updated_at: '2026-10-01T12:00:00.000Z',
      exercises: [], schedules: [],
    },
  };
}

function session() {
  return {
    workout_session_id: 'session-1', user_id_fk: 'local-user', routine_id_fk: 'workout-1',
    scheduled_for: '2026-10-20', started_at: '2026-10-20T12:00:00.000Z', completed_at: null,
    status: 'in_progress' as const, created_at: '2026-10-20T12:00:00.000Z',
  };
}

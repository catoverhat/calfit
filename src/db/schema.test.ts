/// <reference types="jest" />

import { DATABASE_VERSION, migrateDbIfNeeded } from '@/db';
import { MemoryDb } from './testing/memory-database';

describe('database schema migrations', () => {
  it('upgrades a v1 database by adding body measurements', async () => {
    const db = new MemoryDb();
    db.userVersion = 1;

    await migrateDbIfNeeded(db);

    expect(db.userVersion).toBe(DATABASE_VERSION);
    expect(db.createdTables.has('body_measurements')).toBe(true);
    expect(db.createdTables.has('routine_schedules')).toBe(true);
  });

  it('upgrades a v2 database by adding recurring routine schedules', async () => {
    const db = new MemoryDb();
    db.userVersion = 2;

    await migrateDbIfNeeded(db);

    expect(db.userVersion).toBe(DATABASE_VERSION);
    expect(db.createdTables.has('routine_schedules')).toBe(true);
  });

  it('upgrades v3 workout sets and normalizes the legacy distance preference', async () => {
    const db = new MemoryDb();
    db.userVersion = 3;
    db.tables.set('users', [{ user_id: 'local-user', distance_unit: 'm' }]);
    db.tables.set('workout_sets', [{ workout_set_id: 'set-1' }]);

    await migrateDbIfNeeded(db);

    expect(db.tables.get('users')?.[0].distance_unit).toBe('km');
    expect(db.tables.get('workout_sets')?.[0].completed_at).toBeNull();
  });

  it('upgrades v4 with date-based planning tables without changing existing data', async () => {
    const db = new MemoryDb();
    db.userVersion = 4;
    const routine = { routine_id: 'workout-1', name: 'Existing workout' };
    const exercise = { exercise_id: 'exercise-1', name: 'Existing exercise' };
    const target = { routine_exercise_target_id: 'target-1', target_reps: 8 };
    const session = { workout_session_id: 'session-1', routine_id_fk: 'workout-1' };
    db.tables.set('routines', [routine]);
    db.tables.set('exercises', [exercise]);
    db.tables.set('routine_exercise_targets', [target]);
    db.tables.set('workout_sessions', [session]);

    await migrateDbIfNeeded(db);

    expect(db.userVersion).toBe(5);
    expect(db.createdTables.has('workout_plan_entries')).toBe(true);
    expect(db.createdTables.has('workout_plan_settings')).toBe(true);
    expect(db.tables.get('routines')).toEqual([routine]);
    expect(db.tables.get('exercises')).toEqual([exercise]);
    expect(db.tables.get('routine_exercise_targets')).toEqual([target]);
    expect(db.tables.get('workout_sessions')).toEqual([session]);
  });

});

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

});

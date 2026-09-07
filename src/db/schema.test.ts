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

});

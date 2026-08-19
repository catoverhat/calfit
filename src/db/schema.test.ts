/// <reference types="jest" />

import { migrateDbIfNeeded } from '@/db';
import { MemoryDb } from './testing/memory-database';

describe('database schema migrations', () => {
  it('upgrades a v1 database by adding body measurements', async () => {
    const db = new MemoryDb();
    db.userVersion = 1;

    await migrateDbIfNeeded(db);

    expect(db.userVersion).toBe(2);
    expect(db.createdTables.has('body_measurements')).toBe(true);
  });

});

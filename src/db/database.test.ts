/// <reference types="jest" />

import { EXPECTED_TABLES, LOCAL_USER_ID, migrateDbIfNeeded, seedStarterData, STARTER_CATEGORIES } from '@/db';
import { MemoryDb } from './testing/memory-database';

describe('database initialization', () => {
  it('migrates the v1 schema and seeds local starter data', async () => {
    const db = new MemoryDb();

    await migrateDbIfNeeded(db);
    await seedStarterData(db, '2026-07-06T12:00:00.000Z');

    expect(db.userVersion).toBe(2);
    expect([...db.createdTables].sort()).toEqual([...EXPECTED_TABLES].sort());
    expect(db.tables.get('users')).toEqual(
      expect.arrayContaining([expect.objectContaining({ user_id: LOCAL_USER_ID, username: 'Local Athlete' })])
    );
    expect(db.tables.get('categories')).toHaveLength(STARTER_CATEGORIES.length);
    expect(db.createdTables.has('body_measurements')).toBe(true);
  });

});

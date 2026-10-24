/// <reference types="jest" />

import { CREATE_TABLE_STATEMENTS, DATABASE_VERSION, EXPECTED_TABLES, LOCAL_USER_ID, initializeLocalDatabase, migrateDbIfNeeded } from '@/db';
import { MemoryDb } from './testing/memory-database';

describe('development database baseline', () => {
  it.each([1, 2, 3, 4, 5, 6, 7])('clears every old development table at version %i and seeds a fresh baseline', async (version) => {
    const db = new MemoryDb();
    db.userVersion = version;
    for (const table of EXPECTED_TABLES) {
      db.createdTables.add(table);
      db.tables.set(table, [{ old_development_record: 'remove-me' }]);
    }
    db.createdTables.add('routine_schedules');
    db.tables.set('routine_schedules', [{ routine_schedule_id: 'old-schedule' }]);
    db.createdTables.add('workout_plan_settings');
    db.tables.set('workout_plan_settings', [{ legacy_import_handled: 0 }]);
    await initializeLocalDatabase(db);
    expect(db.createdTables.has('routine_schedules')).toBe(false);
    expect(db.tables.has('routine_schedules')).toBe(false);
    expect(db.createdTables.has('workout_plan_settings')).toBe(false);
    expect(db.userVersion).toBe(DATABASE_VERSION);
    expect([...db.createdTables].sort()).toEqual([...EXPECTED_TABLES].sort());
    for (const table of EXPECTED_TABLES) {
      expect(db.tables.get(table)).not.toContainEqual(expect.objectContaining({ old_development_record: 'remove-me' }));
    }
    expect(db.tables.get('workout_sessions')).toEqual([]);
    expect(db.tables.get('workout_sets')).toEqual([]);
    expect(db.tables.get('workout_plan_entries')).toEqual([]);
    expect(db.tables.get('users')).toEqual([expect.objectContaining({ user_id: LOCAL_USER_ID, username: 'Local Athlete' })]);
  });

  it('retains new development records on subsequent initialization', async () => {
    const db = new MemoryDb();
    await initializeLocalDatabase(db);
    db.tables.set('workout_sessions', [{ workout_session_id: 'new-session', status: 'in_progress' }]);
    await initializeLocalDatabase(db);
    expect(db.tables.get('workout_sessions')).toEqual([{ workout_session_id: 'new-session', status: 'in_progress' }]);
  });

  it('rejects a future database version without resetting it', async () => {
    const db = new MemoryDb();
    db.userVersion = DATABASE_VERSION + 1;
    await expect(migrateDbIfNeeded(db)).rejects.toThrow('Unsupported local database version');
    expect(db.userVersion).toBe(DATABASE_VERSION + 1);
  });

  it('restricts persisted session statuses to the current lifecycle', () => {
    expect(CREATE_TABLE_STATEMENTS.find((sql) => sql.includes('CREATE TABLE IF NOT EXISTS workout_sessions')))
      .toContain("CHECK (status IN ('in_progress', 'completed'))");
  });
});

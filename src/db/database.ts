import * as SQLite from 'expo-sqlite';

import { DATABASE_NAME, migrateDbIfNeeded, seedStarterData } from './schema';
import type { LocalDatabase } from './types';

let databasePromise: Promise<LocalDatabase> | null = null;

export async function openLocalDatabase(): Promise<LocalDatabase> {
  databasePromise ??= SQLite.openDatabaseAsync(DATABASE_NAME) as Promise<LocalDatabase>;

  return databasePromise;
}

export async function initializeLocalDatabase(db?: LocalDatabase): Promise<LocalDatabase> {
  const database = db ?? (await openLocalDatabase());

  await migrateDbIfNeeded(database);
  await seedStarterData(database);

  return database;
}

export function resetLocalDatabaseCache(): void {
  databasePromise = null;
}

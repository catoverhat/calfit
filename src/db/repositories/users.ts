import { LOCAL_USER_ID } from '../schema';
import { createLocalId } from '../id';
import type { LocalDatabase, ThemePreference, UserRow } from '../types';
import { calculateBmi, type DistanceUnit, type HeightUnit, type SpeedUnit, type WeightUnit } from '../units';

export interface SaveLocalProfileInput {
  currentWeightKg?: number | null;
  dob: string | null;
  distanceUnit: DistanceUnit;
  heightCm: number | null;
  heightUnit: HeightUnit;
  now?: string;
  speedUnit: SpeedUnit;
  userId?: string;
  username: string;
  weightUnit: WeightUnit;
}

export async function getLocalUserProfile(db: LocalDatabase, userId = LOCAL_USER_ID): Promise<UserRow> {
  const user = await db.getFirstAsync<UserRow>('SELECT * FROM users WHERE user_id = ?', userId);

  if (!user) {
    throw new Error(`Local user profile not found: ${userId}`);
  }

  return user;
}

export async function saveLocalProfile(
  db: LocalDatabase,
  input: SaveLocalProfileInput
): Promise<UserRow> {
  const userId = input.userId ?? LOCAL_USER_ID;
  const now = input.now ?? new Date().toISOString();

  await runInExclusiveTransaction(db, async (txn) => {
    const result = await txn.runAsync(
      `UPDATE users
      SET username = ?, dob = ?, height = ?, height_unit = ?, weight_unit = ?,
        speed_unit = ?, distance_unit = ?, updated_at = ?
      WHERE user_id = ?`,
      input.username,
      input.dob,
      input.heightCm,
      input.heightUnit,
      input.weightUnit,
      input.speedUnit,
      input.distanceUnit,
      now,
      userId
    );

    if (result.changes === 0) throw new Error(`Local user profile not found: ${userId}`);

    if (input.currentWeightKg !== undefined && input.currentWeightKg !== null) {
      await txn.runAsync(
        `INSERT INTO body_measurements (
          body_measurement_id, user_id_fk, weight, bmi, body_fat_percentage, created_at
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        createLocalId('body_measurement'),
        userId,
        input.currentWeightKg,
        calculateBmi(input.currentWeightKg, input.heightCm),
        null,
        now
      );
    }
  });

  return getLocalUserProfile(db, userId);
}

async function runInExclusiveTransaction<T>(
  db: LocalDatabase,
  task: (txn: LocalDatabase) => Promise<T>
): Promise<T> {
  if (!db.withExclusiveTransactionAsync) return task(db);

  let result!: T;
  await db.withExclusiveTransactionAsync(async (txn) => {
    result = await task(txn);
  });
  return result;
}

export async function saveThemePreference(db: LocalDatabase, preference: ThemePreference, userId = LOCAL_USER_ID): Promise<void> {
  if (!['system', 'light', 'dark'].includes(preference)) throw new Error('Invalid appearance preference.');
  const result = await db.runAsync('UPDATE users SET theme_preference = ?, updated_at = ? WHERE user_id = ?', preference, new Date().toISOString(), userId);
  if (result.changes === 0) throw new Error('Local user profile not found.');
}

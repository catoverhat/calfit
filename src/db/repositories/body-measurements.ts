import { createLocalId } from '../id';
import { LOCAL_USER_ID } from '../schema';
import type { BodyMeasurementRow, LocalDatabase } from '../types';

export interface CreateBodyMeasurementInput {
  id?: string;
  userId?: string;
  weight?: number | null;
  bmi?: number | null;
  bodyFatPercentage?: number | null;
  createdAt?: string;
}


export async function createBodyMeasurement(
  db: LocalDatabase,
  input: CreateBodyMeasurementInput
): Promise<BodyMeasurementRow> {
  const measurement: BodyMeasurementRow = {
    body_measurement_id: input.id ?? createLocalId('body_measurement'),
    user_id_fk: input.userId ?? LOCAL_USER_ID,
    weight: input.weight ?? null,
    bmi: input.bmi ?? null,
    body_fat_percentage: input.bodyFatPercentage ?? null,
    created_at: input.createdAt ?? new Date().toISOString(),
  };

  await db.runAsync(
    `INSERT INTO body_measurements (
      body_measurement_id,
      user_id_fk,
      weight,
      bmi,
      body_fat_percentage,
      created_at
    ) VALUES (?, ?, ?, ?, ?, ?)`,
    measurement.body_measurement_id,
    measurement.user_id_fk,
    measurement.weight,
    measurement.bmi,
    measurement.body_fat_percentage,
    measurement.created_at
  );

  return measurement;
}

export async function getLatestBodyMeasurement(
  db: LocalDatabase,
  userId = LOCAL_USER_ID
): Promise<BodyMeasurementRow | null> {
  return db.getFirstAsync<BodyMeasurementRow>(
    `SELECT *
    FROM body_measurements
    WHERE user_id_fk = ?
    ORDER BY created_at DESC
    LIMIT 1`,
    userId
  );
}

export async function getRecentBodyMeasurements(
  db: LocalDatabase,
  userId = LOCAL_USER_ID,
  limit = 2
): Promise<BodyMeasurementRow[]> {
  return db.getAllAsync<BodyMeasurementRow>(
    `SELECT *
    FROM body_measurements
    WHERE user_id_fk = ?
    ORDER BY created_at DESC
    LIMIT ?`,
    userId,
    limit
  );
}


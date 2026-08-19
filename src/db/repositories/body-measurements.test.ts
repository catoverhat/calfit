/// <reference types="jest" />

import {
  createBodyMeasurement,
  getLatestBodyMeasurement,
  getRecentBodyMeasurements,
  initializeLocalDatabase,
} from '@/db';
import { MemoryDb } from '../testing/memory-database';

describe('body-measurements repository', () => {
  it('creates measurements and loads them in newest-first order', async () => {
    const db = new MemoryDb();

    await initializeLocalDatabase(db);
    await createBodyMeasurement(db, {
      id: 'measurement-old',
      weight: 82.4,
      createdAt: '2026-07-01T08:00:00.000Z',
    });
    await createBodyMeasurement(db, {
      id: 'measurement-new',
      weight: 81.7,
      createdAt: '2026-07-06T08:00:00.000Z',
    });

    const latest = await getLatestBodyMeasurement(db);
    const recent = await getRecentBodyMeasurements(db);

    expect(latest?.body_measurement_id).toBe('measurement-new');
    expect(recent.map((measurement) => measurement.body_measurement_id)).toEqual([
      'measurement-new',
      'measurement-old',
    ]);
  });
});

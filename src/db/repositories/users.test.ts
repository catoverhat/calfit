/// <reference types="jest" />

import { getLatestBodyMeasurement, getLocalUserProfile, initializeLocalDatabase, LOCAL_USER_ID, saveLocalProfile } from '@/db';
import { MemoryDb } from '../testing/memory-database';

describe('users repository', () => {
  it('loads the seeded local athlete profile', async () => {
    const db = new MemoryDb();

    await initializeLocalDatabase(db);

    await expect(getLocalUserProfile(db, LOCAL_USER_ID)).resolves.toEqual(
      expect.objectContaining({
        user_id: LOCAL_USER_ID,
        username: 'Local Athlete',
      })
    );
  });

  it('saves profile preferences and a canonical current weight together', async () => {
    const db = new MemoryDb();
    await initializeLocalDatabase(db);
    const saved = await saveLocalProfile(db, {
      currentWeightKg: 81.5,
      dob: '1990-05-20',
      distanceUnit: 'mi',
      heightCm: 180,
      heightUnit: 'ft',
      now: '2026-09-10T12:00:00.000Z',
      speedUnit: 'mph',
      username: 'IronPulse',
      weightUnit: 'lb',
    });
    expect(saved).toEqual(expect.objectContaining({ username: 'IronPulse', height: 180, weight_unit: 'lb' }));
    await expect(getLatestBodyMeasurement(db)).resolves.toEqual(expect.objectContaining({ weight: 81.5 }));
  });
});

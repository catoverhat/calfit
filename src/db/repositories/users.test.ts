/// <reference types="jest" />

import { getLocalUserProfile, initializeLocalDatabase, LOCAL_USER_ID } from '@/db';
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
});

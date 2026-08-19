import { LOCAL_USER_ID } from '../schema';
import type { LocalDatabase, UserRow } from '../types';

export async function getLocalUserProfile(db: LocalDatabase, userId = LOCAL_USER_ID): Promise<UserRow> {
  const user = await db.getFirstAsync<UserRow>('SELECT * FROM users WHERE user_id = ?', userId);

  if (!user) {
    throw new Error(`Local user profile not found: ${userId}`);
  }

  return user;
}


import { LOCAL_USER_ID } from '../schema';
import type { DashboardSnapshot, LocalDatabase } from '../types';
import { getRecentBodyMeasurements } from './body-measurements';
import { getTodayRoutine } from './routines';
import { getLocalUserProfile } from './users';

export async function getWorkoutStreak(
  db: LocalDatabase,
  userId = LOCAL_USER_ID,
  asOf = new Date()
): Promise<number> {
  const rows = await db.getAllAsync<{ completed_at: string }>(
    `SELECT completed_at
    FROM workout_sessions
    WHERE user_id_fk = ? AND status = ? AND completed_at IS NOT NULL
    ORDER BY completed_at DESC`,
    userId,
    'completed'
  );
  const completedDays = new Set(rows.map((row) => toLocalDateKey(new Date(row.completed_at))));
  let streak = 0;
  const cursor = startOfLocalDay(asOf);

  while (completedDays.has(toLocalDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export async function getTodayDashboardSnapshot(
  db: LocalDatabase,
  userId = LOCAL_USER_ID,
  asOf = new Date()
): Promise<DashboardSnapshot> {
  const user = await getLocalUserProfile(db, userId);
  const routine = await getTodayRoutine(db, userId);
  const measurements = await getRecentBodyMeasurements(db, userId, 2);
  const workoutStreak = await getWorkoutStreak(db, userId, asOf);
  const completedWorkoutRow = await db.getFirstAsync<{ completed_count: number }>(
    `SELECT COUNT(*) AS completed_count
    FROM workout_sessions
    WHERE user_id_fk = ? AND status = ?`,
    userId,
    'completed'
  );

  return {
    user,
    routine,
    latestBodyMeasurement: measurements[0] ?? null,
    previousBodyMeasurement: measurements[1] ?? null,
    workoutStreak,
    completedWorkoutCount: completedWorkoutRow?.completed_count ?? 0,
  };
}


function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function toLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
}


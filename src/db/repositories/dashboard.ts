import { LOCAL_USER_ID } from '../schema';
import type { DashboardSnapshot, LocalDatabase } from '../types';
import { getRecentBodyMeasurements } from './body-measurements';
import { getWorkoutPlanEntryForDate } from './workout-plan';
import { getLocalUserProfile } from './users';
import { getInProgressWorkoutSession } from './workout-sessions';

/** Consecutive Monday-to-Sunday weeks with at least one completed workout, so rest days never break it. */
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
  const trainedWeeks = new Set(rows.map((row) => toLocalDateKey(startOfLocalWeek(new Date(row.completed_at)))));
  let streak = 0;
  const cursor = startOfLocalWeek(asOf);
  // The current week is still open, so not having trained yet does not end the streak.
  if (!trainedWeeks.has(toLocalDateKey(cursor))) cursor.setDate(cursor.getDate() - 7);

  while (trainedWeeks.has(toLocalDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 7);
  }

  return streak;
}

export async function getTodayDashboardSnapshot(
  db: LocalDatabase,
  userId = LOCAL_USER_ID,
  asOf = new Date()
): Promise<DashboardSnapshot> {
  const user = await getLocalUserProfile(db, userId);
  const activeSession = await getInProgressWorkoutSession(db, userId);
  const planEntry = await getWorkoutPlanEntryForDate(db, toLocalDateKey(asOf), userId);
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
    activeSession,
    user,
    planEntry,
    latestBodyMeasurement: measurements[0] ?? null,
    previousBodyMeasurement: measurements[1] ?? null,
    workoutStreak,
    completedWorkoutCount: completedWorkoutRow?.completed_count ?? 0,
  };
}


function startOfLocalWeek(date: Date): Date {
  const mondayOffset = (date.getDay() + 6) % 7;
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - mondayOffset);
}

function toLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
}

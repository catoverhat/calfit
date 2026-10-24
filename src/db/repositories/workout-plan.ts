import { createLocalId } from '../id';
import { LOCAL_USER_ID } from '../schema';
import type {
  LocalDatabase,
  RoutineDetail,
  WorkoutPlanEntryDetail,
  WorkoutPlanEntryRow,
  WorkoutSessionRow,
} from '../types';
import { getRoutineDetail } from './routines';
import {
  createWorkoutSessionFromRoutine,
  getInProgressWorkoutSession,
  type StartOrResumeWorkoutResult,
} from './workout-sessions';

export interface WorkoutPlanUndo {
  affectedDates: string[];
  before: WorkoutPlanEntryRow[];
  userId: string;
}

export async function getWorkoutPlanEntries(
  db: LocalDatabase,
  startDate: string,
  endDate: string,
  userId = LOCAL_USER_ID
): Promise<WorkoutPlanEntryDetail[]> {
  assertDateKey(startDate);
  assertDateKey(endDate);
  const entries = await db.getAllAsync<WorkoutPlanEntryRow>(
    `SELECT * FROM workout_plan_entries
    WHERE user_id_fk = ? AND planned_date BETWEEN ? AND ?
    ORDER BY planned_date ASC`,
    userId,
    startDate,
    endDate
  );

  const details: WorkoutPlanEntryDetail[] = [];
  for (const entry of entries) {
    const routine = await getRoutineDetail(db, entry.routine_id_fk);
    if (!routine) continue;
    const session = entry.workout_session_id_fk
      ? await db.getFirstAsync<WorkoutSessionRow>(
          'SELECT * FROM workout_sessions WHERE workout_session_id = ?',
          entry.workout_session_id_fk
        )
      : null;
    details.push({ ...entry, routine, session });
  }
  return details;
}

export async function getWorkoutPlanEntryForDate(
  db: LocalDatabase,
  plannedDate: string,
  userId = LOCAL_USER_ID
): Promise<WorkoutPlanEntryDetail | null> {
  const [entry] = await getWorkoutPlanEntries(db, plannedDate, plannedDate, userId);
  return entry ?? null;
}

export async function assignWorkoutToDate(
  db: LocalDatabase,
  input: { plannedDate: string; routineId: string; userId?: string; now?: string; today?: string }
): Promise<WorkoutPlanUndo> {
  const userId = input.userId ?? LOCAL_USER_ID;
  const now = input.now ?? new Date().toISOString();
  assertDateKey(input.plannedDate);
  assertNotPast(input.plannedDate, input.today);
  await requireActiveRoutine(db, input.routineId);

  return mutateDates(db, userId, [input.plannedDate], async (txn) => {
    const existing = await getEntryRowForDate(txn, userId, input.plannedDate);
    if (existing) {
      await assertEntryEditable(txn, existing);
      await txn.runAsync(
        `UPDATE workout_plan_entries
        SET routine_id_fk = ?, updated_at = ?
        WHERE workout_plan_entry_id = ?`,
        input.routineId,
        now,
        existing.workout_plan_entry_id
      );
      return;
    }
    await insertEntry(txn, {
      id: createLocalId('workout_plan'),
      plannedDate: input.plannedDate,
      routineId: input.routineId,
      userId,
      now,
    });
  });
}

export async function removeWorkoutPlanEntry(
  db: LocalDatabase,
  input: { entryId: string; userId?: string; today?: string }
): Promise<WorkoutPlanUndo> {
  const userId = input.userId ?? LOCAL_USER_ID;
  const entry = await getEntryRowById(db, input.entryId);
  if (!entry || entry.user_id_fk !== userId) throw new Error('Planned workout could not be found.');
  assertNotPast(entry.planned_date, input.today);
  await assertEntryEditable(db, entry);
  return mutateDates(db, userId, [entry.planned_date], (txn) =>
    txn.runAsync('DELETE FROM workout_plan_entries WHERE workout_plan_entry_id = ?', input.entryId)
  );
}

export async function moveWorkoutPlanEntry(
  db: LocalDatabase,
  input: { entryId: string; targetDate: string; userId?: string; now?: string; today?: string }
): Promise<WorkoutPlanUndo> {
  const userId = input.userId ?? LOCAL_USER_ID;
  const now = input.now ?? new Date().toISOString();
  assertDateKey(input.targetDate);
  assertNotPast(input.targetDate, input.today);
  const source = await getEntryRowById(db, input.entryId);
  if (!source || source.user_id_fk !== userId) throw new Error('Planned workout could not be found.');
  assertNotPast(source.planned_date, input.today);
  if (source.planned_date === input.targetDate) throw new Error('Choose a different date.');
  await assertEntryEditable(db, source);

  return mutateDates(db, userId, [source.planned_date, input.targetDate], async (txn) => {
    const target = await getEntryRowForDate(txn, userId, input.targetDate);
    if (target) {
      await assertEntryEditable(txn, target);
      const sourceRoutineId = source.routine_id_fk;
      const targetRoutineId = target.routine_id_fk;
      await txn.runAsync(
        'UPDATE workout_plan_entries SET routine_id_fk = ?, updated_at = ? WHERE workout_plan_entry_id = ?',
        targetRoutineId,
        now,
        source.workout_plan_entry_id
      );
      await txn.runAsync(
        'UPDATE workout_plan_entries SET routine_id_fk = ?, updated_at = ? WHERE workout_plan_entry_id = ?',
        sourceRoutineId,
        now,
        target.workout_plan_entry_id
      );
      return;
    }
    await txn.runAsync(
      'UPDATE workout_plan_entries SET planned_date = ?, updated_at = ? WHERE workout_plan_entry_id = ?',
      input.targetDate,
      now,
      source.workout_plan_entry_id
    );
  });
}

export async function replaceAndMoveWorkoutPlanEntry(
  db: LocalDatabase,
  input: {
    entryId: string;
    replacementRoutineId: string;
    originalTargetDate: string;
    userId?: string;
    now?: string;
    today?: string;
  }
): Promise<WorkoutPlanUndo> {
  const userId = input.userId ?? LOCAL_USER_ID;
  const now = input.now ?? new Date().toISOString();
  assertDateKey(input.originalTargetDate);
  assertNotPast(input.originalTargetDate, input.today);
  await requireActiveRoutine(db, input.replacementRoutineId);
  const source = await getEntryRowById(db, input.entryId);
  if (!source || source.user_id_fk !== userId) throw new Error('Planned workout could not be found.');
  assertNotPast(source.planned_date, input.today);
  await assertEntryEditable(db, source);
  if (await getEntryRowForDate(db, userId, input.originalTargetDate)) {
    throw new Error('Choose an empty date for the original workout.');
  }

  return mutateDates(db, userId, [source.planned_date, input.originalTargetDate], async (txn) => {
    const originalRoutineId = source.routine_id_fk;
    await txn.runAsync(
      'UPDATE workout_plan_entries SET routine_id_fk = ?, updated_at = ? WHERE workout_plan_entry_id = ?',
      input.replacementRoutineId,
      now,
      source.workout_plan_entry_id
    );
    await insertEntry(txn, {
      id: createLocalId('workout_plan'),
      plannedDate: input.originalTargetDate,
      routineId: originalRoutineId,
      userId,
      now,
    });
  });
}

export async function copyWorkoutPlanWeek(
  db: LocalDatabase,
  input: { sourceDates: string[]; targetDates: string[]; today: string; userId?: string; now?: string }
): Promise<{ skippedInactive: number; undo: WorkoutPlanUndo }> {
  const userId = input.userId ?? LOCAL_USER_ID;
  const now = input.now ?? new Date().toISOString();
  if (input.sourceDates.length !== 7 || input.targetDates.length !== 7) {
    throw new Error('Week copy requires seven source and target dates.');
  }
  const existingTarget = await getWorkoutPlanEntries(db, input.targetDates[0], input.targetDates[6], userId);
  if (existingTarget.length > 0) throw new Error('Copy is available only for an empty week.');
  const source = await getWorkoutPlanEntries(db, input.sourceDates[0], input.sourceDates[6], userId);
  const sourceByDate = new Map(source.map((entry) => [entry.planned_date, entry]));
  let skippedInactive = 0;
  const eligibleDates = input.targetDates.filter((date) => date >= input.today);

  const undo = await mutateDates(db, userId, eligibleDates, async (txn) => {
    for (let index = 0; index < 7; index += 1) {
      const targetDate = input.targetDates[index];
      if (targetDate < input.today) continue;
      const item = sourceByDate.get(input.sourceDates[index]);
      if (!item) continue;
      if (item.routine.active !== 1) {
        skippedInactive += 1;
        continue;
      }
      await insertEntry(txn, {
        id: createLocalId('workout_plan'),
        plannedDate: targetDate,
        routineId: item.routine_id_fk,
        userId,
        now,
      });
    }
  });
  return { skippedInactive, undo };
}

export async function undoWorkoutPlanChange(db: LocalDatabase, undo: WorkoutPlanUndo): Promise<void> {
  await runInExclusiveTransaction(db, async (txn) => {
    for (const date of undo.affectedDates) {
      await txn.runAsync(
        'DELETE FROM workout_plan_entries WHERE user_id_fk = ? AND planned_date = ?',
        undo.userId,
        date
      );
    }
    for (const entry of undo.before) {
      await txn.runAsync(
        `INSERT INTO workout_plan_entries (
          workout_plan_entry_id, user_id_fk, routine_id_fk, planned_date,
          workout_session_id_fk, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        entry.workout_plan_entry_id,
        entry.user_id_fk,
        entry.routine_id_fk,
        entry.planned_date,
        entry.workout_session_id_fk,
        entry.created_at,
        entry.updated_at
      );
    }
  });
}

export async function removeFutureWorkoutPlanEntriesForRoutine(
  db: LocalDatabase,
  input: { routineId: string; today: string; userId?: string }
): Promise<WorkoutPlanUndo | null> {
  const userId = input.userId ?? LOCAL_USER_ID;
  assertDateKey(input.today);
  const rows = await db.getAllAsync<WorkoutPlanEntryRow>(
    `SELECT * FROM workout_plan_entries
    WHERE user_id_fk = ? AND planned_date >= ? AND routine_id_fk = ?
    ORDER BY planned_date ASC`,
    userId,
    input.today,
    input.routineId
  );
  const editable: WorkoutPlanEntryRow[] = [];
  for (const row of rows) {
    await assertEntryEditable(db, row);
    editable.push(row);
  }
  if (editable.length === 0) return null;
  const dates = editable.map((row) => row.planned_date);
  return mutateDates(db, userId, dates, async (txn) => {
    for (const row of editable) {
      await txn.runAsync(
        'DELETE FROM workout_plan_entries WHERE workout_plan_entry_id = ?',
        row.workout_plan_entry_id
      );
    }
  });
}

export async function startOrResumeWorkoutFromPlanEntry(
  db: LocalDatabase,
  entryId: string,
  now = new Date().toISOString()
): Promise<StartOrResumeWorkoutResult> {
  const active = await getInProgressWorkoutSession(db);
  if (active) return { resumed: true, session: active };
  const entry = await getEntryRowById(db, entryId);
  if (!entry) throw new Error('Planned workout could not be found.');
  if (entry.workout_session_id_fk) {
    const session = await db.getFirstAsync<WorkoutSessionRow>(
      'SELECT * FROM workout_sessions WHERE workout_session_id = ?',
      entry.workout_session_id_fk
    );
    if (!session) throw new Error('Linked workout session could not be found.');
    if (session.status === 'completed') throw new Error('This workout is already completed.');
    return { resumed: session.status === 'in_progress', session };
  }

  let session: WorkoutSessionRow | null = null;
  await runInExclusiveTransaction(db, async (txn) => {
    session = await createWorkoutSessionFromRoutine(txn, {
      routineId: entry.routine_id_fk,
      scheduledFor: entry.planned_date,
      userId: entry.user_id_fk,
      now,
    });
    await txn.runAsync(
      `UPDATE workout_plan_entries
      SET workout_session_id_fk = ?, updated_at = ?
      WHERE workout_plan_entry_id = ?`,
      session.workout_session_id,
      now,
      entryId
    );
  });
  if (!session) throw new Error('Planned workout could not be started.');
  return { resumed: false, session };
}

async function mutateDates(
  db: LocalDatabase,
  userId: string,
  dates: string[],
  mutation: (txn: LocalDatabase) => Promise<unknown>
): Promise<WorkoutPlanUndo> {
  const affectedDates = [...new Set(dates)].sort();
  const before: WorkoutPlanEntryRow[] = [];
  for (const date of affectedDates) {
    const entry = await getEntryRowForDate(db, userId, date);
    if (entry) before.push({ ...entry });
  }
  await runInExclusiveTransaction(db, mutation);
  return { affectedDates, before, userId };
}

async function insertEntry(
  db: LocalDatabase,
  input: { id: string; plannedDate: string; routineId: string; userId: string; now: string }
): Promise<void> {
  await db.runAsync(
    `INSERT INTO workout_plan_entries (
      workout_plan_entry_id, user_id_fk, routine_id_fk, planned_date,
      workout_session_id_fk, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    input.id,
    input.userId,
    input.routineId,
    input.plannedDate,
    null,
    input.now,
    input.now
  );
}

async function getEntryRowForDate(
  db: LocalDatabase,
  userId: string,
  date: string
): Promise<WorkoutPlanEntryRow | null> {
  return db.getFirstAsync<WorkoutPlanEntryRow>(
    'SELECT * FROM workout_plan_entries WHERE user_id_fk = ? AND planned_date = ?',
    userId,
    date
  );
}

async function getEntryRowById(db: LocalDatabase, entryId: string): Promise<WorkoutPlanEntryRow | null> {
  return db.getFirstAsync<WorkoutPlanEntryRow>(
    'SELECT * FROM workout_plan_entries WHERE workout_plan_entry_id = ?',
    entryId
  );
}

async function assertEntryEditable(db: LocalDatabase, entry: WorkoutPlanEntryRow): Promise<void> {
  if (!entry.workout_session_id_fk) return;
  const session = await db.getFirstAsync<WorkoutSessionRow>(
    'SELECT * FROM workout_sessions WHERE workout_session_id = ?',
    entry.workout_session_id_fk
  );
  if (session?.status === 'in_progress' || session?.status === 'completed') {
    throw new Error('Started or completed workouts cannot be changed.');
  }
}

async function requireActiveRoutine(db: LocalDatabase, routineId: string): Promise<RoutineDetail> {
  const routine = await getRoutineDetail(db, routineId);
  if (!routine || routine.active !== 1) throw new Error('Choose an active workout.');
  return routine;
}

function assertDateKey(value: string): void {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error(`Invalid planned date: ${value}`);
}

function assertNotPast(value: string, today = localDateKey(new Date())): void {
  assertDateKey(today);
  if (value < today) throw new Error('Past plan dates are read-only.');
}

function localDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}`;
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

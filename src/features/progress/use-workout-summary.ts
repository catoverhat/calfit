import { useEffect, useState } from 'react';

import { getExerciseBestWeights, getLocalUserProfile, getWorkoutSessionDetail, initializeLocalDatabase } from '@/db';
import { createWorkoutSummaryData, type WorkoutSummaryData } from './progress.viewmodel';

type State = { data: WorkoutSummaryData | null; error: string | null; isLoading: boolean };

export function useWorkoutSummary(sessionId?: string): State {
  const [state, setState] = useState<State>({ data: null, error: null, isLoading: true });
  useEffect(() => {
    let active = true;
    async function load() {
      if (!sessionId) {
        setState({ data: null, error: 'Workout session id is missing.', isLoading: false });
        return;
      }
      try {
        const db = await initializeLocalDatabase();
        const [user, session] = await Promise.all([getLocalUserProfile(db), getWorkoutSessionDetail(db, sessionId)]);
        if (!session) throw new Error('Workout session could not be found.');
        const bestWeights = await getExerciseBestWeights(
          db,
          [...new Set(session.exercises.map((exercise) => exercise.exercise_id_fk))],
          session.started_at ?? session.created_at
        );
        if (active) setState({ data: createWorkoutSummaryData(session, user.weight_unit, bestWeights), error: null, isLoading: false });
      } catch (error) {
        if (active) setState({ data: null, error: error instanceof Error ? error.message : 'Workout summary could not be loaded.', isLoading: false });
      }
    }
    load();
    return () => { active = false; };
  }, [sessionId]);
  return state;
}

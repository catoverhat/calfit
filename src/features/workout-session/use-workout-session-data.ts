import { useEffect, useState } from 'react';

import {
  getLocalUserProfile,
  getPreviousExercisePerformance,
  getWorkoutSessionDetail,
  initializeLocalDatabase,
} from '@/db';
import { mapWorkoutSessionToViewModel, type WorkoutSessionViewModel } from './workout-session.viewmodel';

type State = { error: string | null; isLoading: boolean; workout: WorkoutSessionViewModel | null };

export function useWorkoutSessionData(sessionId?: string): State & { reload: () => void } {
  const [reloadKey, setReloadKey] = useState(0);
  const [state, setState] = useState<State>({ error: null, isLoading: true, workout: null });
  useEffect(() => {
    let active = true;
    async function load() {
      if (!sessionId) {
        setState({ error: 'Workout session id is missing.', isLoading: false, workout: null });
        return;
      }
      try {
        const db = await initializeLocalDatabase();
        const [session, user] = await Promise.all([
          getWorkoutSessionDetail(db, sessionId),
          getLocalUserProfile(db),
        ]);
        if (!session) throw new Error('Workout session could not be found.');
        const previous = await getPreviousExercisePerformance(
          db,
          [...new Set(session.exercises.map((exercise) => exercise.exercise_id_fk))]
        );
        if (active) setState({ error: null, isLoading: false, workout: mapWorkoutSessionToViewModel(session, user, previous) });
      } catch (error) {
        if (active) setState({ error: error instanceof Error ? error.message : 'Workout session could not be loaded.', isLoading: false, workout: null });
      }
    }
    load();
    return () => { active = false; };
  }, [reloadKey, sessionId]);
  return { ...state, reload: () => setReloadKey((value) => value + 1) };
}

import { useEffect, useState } from 'react';

import { getWorkoutSessionDetail, initializeLocalDatabase } from '@/db';
import { mapWorkoutSessionToViewModel, type WorkoutSessionViewModel } from './workout-session.viewmodel';

type State = { error: string | null; isLoading: boolean; workout: WorkoutSessionViewModel | null };

export function useWorkoutSessionData(sessionId?: string): State {
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
        const session = await getWorkoutSessionDetail(db, sessionId);
        if (!session) throw new Error('Workout session could not be found.');
        if (active) setState({ error: null, isLoading: false, workout: mapWorkoutSessionToViewModel(session) });
      } catch (error) {
        if (active) setState({ error: error instanceof Error ? error.message : 'Workout session could not be loaded.', isLoading: false, workout: null });
      }
    }
    load();
    return () => { active = false; };
  }, [sessionId]);
  return state;
}

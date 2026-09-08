import { useCallback, useEffect, useState } from 'react';

import { getLocalUserProfile, initializeLocalDatabase } from '@/db';

type State = { error: string | null; isLoading: boolean; profileName: string; ready: boolean };

export function useLocalStorageStatus(): State & { retry: () => void } {
  const [reloadKey, setReloadKey] = useState(0);
  const [state, setState] = useState<State>({ error: null, isLoading: true, profileName: 'Local Athlete', ready: false });
  useEffect(() => {
    let active = true;
    async function load() {
      setState((current) => ({ ...current, error: null, isLoading: true }));
      try {
        const db = await initializeLocalDatabase();
        const user = await getLocalUserProfile(db);
        if (active) setState({ error: null, isLoading: false, profileName: user.username, ready: true });
      } catch (error) {
        if (active) setState({ error: error instanceof Error ? error.message : 'Local storage is unavailable.', isLoading: false, profileName: 'Local Athlete', ready: false });
      }
    }
    load();
    return () => { active = false; };
  }, [reloadKey]);
  return { ...state, retry: useCallback(() => setReloadKey((value) => value + 1), []) };
}

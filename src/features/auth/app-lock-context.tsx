import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';

import type { AppLockState, DeviceAuthenticationCapability } from './app-lock.types';
import {
  authenticateWithDevice,
  getDeviceAuthenticationCapability,
} from './device-authentication';
import {
  getAuthenticationFailureFeedback,
  initialAppLockState,
  reduceAppLockState,
  UnlockGate,
} from './app-lock.viewmodel';

interface AppLockContextValue extends AppLockState {
  lock: () => void;
  unlock: () => Promise<void>;
}

const AppLockContext = createContext<AppLockContextValue | null>(null);

export function AppLockProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(reduceAppLockState, initialAppLockState);
  const [unlockGate] = useState(() => new UnlockGate());

  useEffect(() => {
    let active = true;

    void getDeviceAuthenticationCapability()
      .then((capability) => {
        if (active) dispatch({ capability, type: 'capability-checked' });
      })
      .catch(() => {
        if (active) dispatch({ capability: unavailableCapability(), type: 'capability-checked' });
      });

    return () => {
      active = false;
    };
  }, []);

  const lock = useCallback(() => {
    dispatch({ type: 'lock' });
  }, []);

  const unlock = useCallback(async () => {
    const result = await unlockGate.run(async () => {
      dispatch({ type: 'unlock-started' });
      dispatch({ type: 'capability-check-started' });

      try {
        const capability = await getDeviceAuthenticationCapability();
        dispatch({ capability, type: 'capability-checked' });

        if (capability.availability !== 'available') {
          return {
            code: 'capability_unavailable',
            feedback: { message: capability.description, tone: 'error' as const },
            success: false as const,
          };
        }

        return await authenticateWithDevice();
      } catch {
        return {
          code: 'unexpected',
          feedback: getAuthenticationFailureFeedback('unexpected'),
          success: false as const,
        };
      }
    });

    if (!result) return;
    if (result.success) dispatch({ type: 'unlock-succeeded' });
    else dispatch({ feedback: result.feedback, type: 'unlock-failed' });
  }, [unlockGate]);

  const value = useMemo<AppLockContextValue>(
    () => ({ ...state, lock, unlock }),
    [lock, state, unlock]
  );

  return <AppLockContext value={value}>{children}</AppLockContext>;
}

export function useAppLock(): AppLockContextValue {
  const value = useContext(AppLockContext);
  if (!value) throw new Error('useAppLock must be used within AppLockProvider.');
  return value;
}

function unavailableCapability(): DeviceAuthenticationCapability {
  return {
    availability: 'unavailable',
    description: 'Device security could not be checked. Try again.',
    kind: 'none',
    label: 'Check Device Security',
  };
}

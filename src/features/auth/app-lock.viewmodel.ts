import type {
  AppLockFeedback,
  AppLockState,
  AppLockStatus,
  DeviceAuthenticationCapability,
} from './app-lock.types';

export const checkingCapability: DeviceAuthenticationCapability = {
  availability: 'checking',
  description: 'Checking the secure authentication available on this device.',
  kind: 'none',
  label: 'Checking device security…',
};

export const initialAppLockState: AppLockState = {
  capability: checkingCapability,
  feedback: null,
  status: 'locked',
};

export type AppLockAction =
  | { type: 'capability-check-started' }
  | { capability: DeviceAuthenticationCapability; type: 'capability-checked' }
  | { type: 'lock' }
  | { type: 'unlock-started' }
  | { type: 'unlock-succeeded' }
  | { feedback: AppLockFeedback; type: 'unlock-failed' };

export function reduceAppLockState(state: AppLockState, action: AppLockAction): AppLockState {
  switch (action.type) {
    case 'capability-check-started':
      return { ...state, capability: checkingCapability };
    case 'capability-checked':
      return { ...state, capability: action.capability };
    case 'lock':
      return { ...state, feedback: null, status: 'locked' };
    case 'unlock-started':
      return state.status === 'authenticating' || state.status === 'unlocked'
        ? state
        : { ...state, feedback: null, status: 'authenticating' };
    case 'unlock-succeeded':
      return { ...state, feedback: null, status: 'unlocked' };
    case 'unlock-failed':
      return { ...state, feedback: action.feedback, status: 'locked' };
  }
}

export function getAuthenticationFailureFeedback(error: string): AppLockFeedback {
  switch (error) {
    case 'user_cancel':
    case 'app_cancel':
    case 'system_cancel':
      return {
        message: 'Unlock canceled. Tap the button when you are ready to try again.',
        tone: 'info',
      };
    case 'authentication_failed':
      return {
        message: 'Authentication was not recognized. Try again or use your device passcode.',
        tone: 'error',
      };
    case 'not_enrolled':
      return {
        message: 'Set up biometrics or a device passcode in Settings, then try again.',
        tone: 'error',
      };
    case 'not_available':
    case 'passcode_not_set':
      return {
        message: 'Device authentication is unavailable. Set up a secure screen lock in Settings.',
        tone: 'error',
      };
    case 'lockout':
      return {
        message: 'Device authentication is temporarily locked. Use your device passcode or try again later.',
        tone: 'error',
      };
    case 'timeout':
      return {
        message: 'The authentication request timed out. Try again.',
        tone: 'error',
      };
    case 'user_fallback':
      return {
        message: 'Use your device passcode when the system prompt appears, or try again.',
        tone: 'info',
      };
    default:
      return {
        message: 'Device authentication could not be completed. Check your settings and try again.',
        tone: 'error',
      };
  }
}

export function getAppLockRouteAccess(status: AppLockStatus) {
  return {
    canAccessLogin: status !== 'unlocked',
    canAccessProtectedRoutes: status === 'unlocked',
  };
}

export class UnlockGate {
  private isRunning = false;

  async run<T>(task: () => Promise<T>): Promise<T | null> {
    if (this.isRunning) return null;

    this.isRunning = true;
    try {
      return await task();
    } finally {
      this.isRunning = false;
    }
  }
}

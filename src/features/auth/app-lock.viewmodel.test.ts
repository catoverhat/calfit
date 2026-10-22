/// <reference types="jest" />

import {
  getAppLockRouteAccess,
  getAuthenticationFailureFeedback,
  initialAppLockState,
  reduceAppLockState,
  UnlockGate,
} from './app-lock.viewmodel';

const availableCapability = {
  availability: 'available' as const,
  description: 'Use device security.',
  kind: 'fingerprint' as const,
  label: 'Unlock with Fingerprint',
};

describe('app lock view model', () => {
  it('starts locked and exposes only the login route', () => {
    expect(initialAppLockState.status).toBe('locked');
    expect(getAppLockRouteAccess(initialAppLockState.status)).toEqual({
      canAccessLogin: true,
      canAccessProtectedRoutes: false,
    });
  });

  it('unlocks after successful authentication and locks manually', () => {
    const ready = reduceAppLockState(initialAppLockState, {
      capability: availableCapability,
      type: 'capability-checked',
    });
    const authenticating = reduceAppLockState(ready, { type: 'unlock-started' });
    const unlocked = reduceAppLockState(authenticating, { type: 'unlock-succeeded' });

    expect(authenticating.status).toBe('authenticating');
    expect(unlocked.status).toBe('unlocked');
    expect(getAppLockRouteAccess(unlocked.status)).toEqual({
      canAccessLogin: false,
      canAccessProtectedRoutes: true,
    });
    expect(reduceAppLockState(unlocked, { type: 'lock' }).status).toBe('locked');
  });

  it('returns to locked with retryable feedback after a failed attempt', () => {
    const failed = reduceAppLockState(
      { ...initialAppLockState, status: 'authenticating' },
      {
        feedback: getAuthenticationFailureFeedback('not_enrolled'),
        type: 'unlock-failed',
      }
    );

    expect(failed.status).toBe('locked');
    expect(failed.feedback).toEqual({
      message: 'Set up biometrics or a device passcode in Settings, then try again.',
      tone: 'error',
    });
  });

  it('treats cancellation as information while keeping the app locked', () => {
    const feedback = getAuthenticationFailureFeedback('user_cancel');
    const state = reduceAppLockState(initialAppLockState, {
      feedback,
      type: 'unlock-failed',
    });

    expect(state.status).toBe('locked');
    expect(state.feedback?.tone).toBe('info');
  });

  it('prevents concurrent authentication work and allows a later retry', async () => {
    const gate = new UnlockGate();
    let finishFirst: ((value: string) => void) | undefined;
    const first = gate.run(() => new Promise<string>((resolve) => {
      finishFirst = resolve;
    }));
    const duplicateTask = jest.fn(async () => 'duplicate');

    await expect(gate.run(duplicateTask)).resolves.toBeNull();
    expect(duplicateTask).not.toHaveBeenCalled();

    finishFirst?.('first');
    await expect(first).resolves.toBe('first');
    await expect(gate.run(async () => 'retry')).resolves.toBe('retry');
  });
});

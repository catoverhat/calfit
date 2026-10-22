export type AppLockStatus = 'locked' | 'authenticating' | 'unlocked';

export type AuthenticationKind =
  | 'biometric'
  | 'device-credential'
  | 'face'
  | 'fingerprint'
  | 'none'
  | 'web';

export type AuthenticationAvailability = 'available' | 'checking' | 'unavailable';

export interface DeviceAuthenticationCapability {
  availability: AuthenticationAvailability;
  description: string;
  kind: AuthenticationKind;
  label: string;
}

export interface AppLockFeedback {
  message: string;
  tone: 'error' | 'info';
}

export type DeviceAuthenticationResult =
  | { success: true }
  | {
      code: string;
      feedback: AppLockFeedback;
      success: false;
    };

export interface AppLockState {
  capability: DeviceAuthenticationCapability;
  feedback: AppLockFeedback | null;
  status: AppLockStatus;
}

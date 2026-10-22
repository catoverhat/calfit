import * as LocalAuthentication from 'expo-local-authentication';

import type {
  AuthenticationKind,
  DeviceAuthenticationCapability,
  DeviceAuthenticationResult,
} from './app-lock.types';
import { getAuthenticationFailureFeedback } from './app-lock.viewmodel';

export const nativeAuthenticationOptions: LocalAuthentication.LocalAuthenticationOptions = {
  biometricsSecurityLevel: 'strong',
  cancelLabel: 'Cancel',
  disableDeviceFallback: false,
  fallbackLabel: 'Use Device Passcode',
  promptDescription: 'Confirm your identity to access your local workout data.',
  promptMessage: 'Unlock Calfit',
  promptSubtitle: 'Use biometrics or your device passcode',
  requireConfirmation: true,
};

export async function getDeviceAuthenticationCapability(): Promise<DeviceAuthenticationCapability> {
  const [hasHardware, isEnrolled, securityLevel, supportedTypes] = await Promise.all([
    LocalAuthentication.hasHardwareAsync(),
    LocalAuthentication.isEnrolledAsync(),
    LocalAuthentication.getEnrolledLevelAsync(),
    LocalAuthentication.supportedAuthenticationTypesAsync(),
  ]);

  if (securityLevel !== LocalAuthentication.SecurityLevel.NONE) {
    const kind = getAuthenticationKind(securityLevel, supportedTypes);
    return availableCapability(kind);
  }

  const description = hasHardware && !isEnrolled
    ? 'Set up Face ID, Touch ID, fingerprint, or a device passcode in Settings, then check again.'
    : 'Set up a secure device passcode in Settings before unlocking Calfit.';

  return {
    availability: 'unavailable',
    description,
    kind: 'none',
    label: 'Check Device Security',
  };
}

export async function authenticateWithDevice(): Promise<DeviceAuthenticationResult> {
  const result = await LocalAuthentication.authenticateAsync(nativeAuthenticationOptions);

  if (result.success) return { success: true };

  return {
    code: result.error,
    feedback: getAuthenticationFailureFeedback(result.error),
    success: false,
  };
}

function getAuthenticationKind(
  securityLevel: LocalAuthentication.SecurityLevel,
  supportedTypes: LocalAuthentication.AuthenticationType[]
): AuthenticationKind {
  if (securityLevel !== LocalAuthentication.SecurityLevel.BIOMETRIC_STRONG) {
    return 'device-credential';
  }

  const supportsFace = supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION);
  const supportsFingerprint = supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT);

  if (supportsFace && !supportsFingerprint) return 'face';
  if (supportsFingerprint && !supportsFace) return 'fingerprint';
  return 'biometric';
}

function availableCapability(kind: AuthenticationKind): DeviceAuthenticationCapability {
  switch (kind) {
    case 'face':
      return {
        availability: 'available',
        description: 'Use Face ID or your device passcode to access your local workout data.',
        kind,
        label: 'Unlock with Face ID',
      };
    case 'fingerprint':
      return {
        availability: 'available',
        description: 'Use your fingerprint or device passcode to access your local workout data.',
        kind,
        label: 'Unlock with Fingerprint',
      };
    case 'biometric':
      return {
        availability: 'available',
        description: 'Use strong biometrics or your device passcode to access your local workout data.',
        kind,
        label: 'Unlock with Biometrics',
      };
    default:
      return {
        availability: 'available',
        description: 'Use your secure device credential to access your local workout data.',
        kind: 'device-credential',
        label: 'Unlock with Device Security',
      };
  }
}

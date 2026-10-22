/// <reference types="jest" />

import * as LocalAuthentication from 'expo-local-authentication';

import {
  authenticateWithDevice,
  getDeviceAuthenticationCapability,
  nativeAuthenticationOptions,
} from './device-authentication';

jest.mock('expo-local-authentication', () => ({
  AuthenticationType: {
    FACIAL_RECOGNITION: 2,
    FINGERPRINT: 1,
    IRIS: 3,
  },
  SecurityLevel: {
    BIOMETRIC_STRONG: 3,
    BIOMETRIC_WEAK: 2,
    NONE: 0,
    SECRET: 1,
  },
  authenticateAsync: jest.fn(),
  getEnrolledLevelAsync: jest.fn(),
  hasHardwareAsync: jest.fn(),
  isEnrolledAsync: jest.fn(),
  supportedAuthenticationTypesAsync: jest.fn(),
}));

const localAuthentication = jest.mocked(LocalAuthentication);

describe('native device authentication adapter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localAuthentication.hasHardwareAsync.mockResolvedValue(true);
    localAuthentication.isEnrolledAsync.mockResolvedValue(true);
    localAuthentication.getEnrolledLevelAsync.mockResolvedValue(
      LocalAuthentication.SecurityLevel.BIOMETRIC_STRONG
    );
    localAuthentication.supportedAuthenticationTypesAsync.mockResolvedValue([
      LocalAuthentication.AuthenticationType.FINGERPRINT,
    ]);
  });

  it('labels an enrolled strong fingerprint authenticator', async () => {
    await expect(getDeviceAuthenticationCapability()).resolves.toEqual({
      availability: 'available',
      description: 'Use your fingerprint or device passcode to access your local workout data.',
      kind: 'fingerprint',
      label: 'Unlock with Fingerprint',
    });
  });

  it('uses device security when only a PIN or pattern is enrolled', async () => {
    localAuthentication.hasHardwareAsync.mockResolvedValue(false);
    localAuthentication.isEnrolledAsync.mockResolvedValue(false);
    localAuthentication.getEnrolledLevelAsync.mockResolvedValue(
      LocalAuthentication.SecurityLevel.SECRET
    );
    localAuthentication.supportedAuthenticationTypesAsync.mockResolvedValue([]);

    const capability = await getDeviceAuthenticationCapability();
    expect(capability).toEqual(expect.objectContaining({
      availability: 'available',
      kind: 'device-credential',
      label: 'Unlock with Device Security',
    }));
  });

  it('blocks access when no secure authentication is configured', async () => {
    localAuthentication.isEnrolledAsync.mockResolvedValue(false);
    localAuthentication.getEnrolledLevelAsync.mockResolvedValue(
      LocalAuthentication.SecurityLevel.NONE
    );

    const capability = await getDeviceAuthenticationCapability();
    expect(capability.availability).toBe('unavailable');
    expect(capability.description).toContain('Set up Face ID');
  });

  it('requests strong biometrics with system credential fallback', async () => {
    localAuthentication.authenticateAsync.mockResolvedValue({ success: true });

    await expect(authenticateWithDevice()).resolves.toEqual({ success: true });
    expect(localAuthentication.authenticateAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        biometricsSecurityLevel: 'strong',
        disableDeviceFallback: false,
        fallbackLabel: 'Use Device Passcode',
      })
    );
    expect(nativeAuthenticationOptions.requireConfirmation).toBe(true);
  });

  it.each([
    ['user_cancel', 'info'],
    ['not_enrolled', 'error'],
    ['lockout', 'error'],
    ['not_available', 'error'],
    ['authentication_failed', 'error'],
    ['unknown', 'error'],
  ] as const)('maps %s failures to locked-screen feedback', async (error, tone) => {
    localAuthentication.authenticateAsync.mockResolvedValue({ error, success: false });

    const result = await authenticateWithDevice();
    expect(result).toEqual(expect.objectContaining({ code: error, success: false }));
    if (!result.success) expect(result.feedback.tone).toBe(tone);
  });
});

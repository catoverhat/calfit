import type {
  DeviceAuthenticationCapability,
  DeviceAuthenticationResult,
} from './app-lock.types';

export async function getDeviceAuthenticationCapability(): Promise<DeviceAuthenticationCapability> {
  return {
    availability: 'available',
    description: 'This browser session is not protected by device biometrics. Data remains local to this browser.',
    kind: 'web',
    label: 'Continue on Web',
  };
}

export async function authenticateWithDevice(): Promise<DeviceAuthenticationResult> {
  return { success: true };
}

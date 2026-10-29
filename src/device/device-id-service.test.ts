/* eslint-disable @typescript-eslint/no-require-imports -- Isolated imports create a fresh singleton per test. */
import type { deviceIdService as Service } from './device-id-service';

jest.mock('expo-application', () => ({
  __esModule: true,
  applicationId: 'com.anonymous.calfit',
  getAndroidId: jest.fn().mockReturnValue('abc123def4567890'),
}));
jest.mock('expo-crypto', () => {
  const { createHash } = jest.requireActual('node:crypto');
  return {
    CryptoDigestAlgorithm: { SHA256: 'SHA-256' },
    CryptoEncoding: { HEX: 'hex' },
    randomUUID: jest.fn().mockReturnValue('12345678-1234-4234-8234-123456789abc'),
    digestStringAsync: jest.fn(async (_algorithm: string, value: string) => createHash('sha256').update(value).digest('hex')),
  };
});
jest.mock('expo-secure-store', () => ({
  WHEN_UNLOCKED_THIS_DEVICE_ONLY: 1,
  isAvailableAsync: jest.fn().mockResolvedValue(true),
  getItemAsync: jest.fn().mockResolvedValue(null),
  setItemAsync: jest.fn().mockResolvedValue(undefined),
}));

let service: typeof Service;
let serviceModule: typeof import('./device-id-service');
let application: jest.Mocked<typeof import('expo-application')>;
let crypto: jest.Mocked<typeof import('expo-crypto')>;
let secureStore: jest.Mocked<typeof import('expo-secure-store')>;
let native: typeof import('react-native');
const IOS_ID = 'ios_12345678-1234-4234-8234-123456789abc';

beforeEach(() => {
  jest.isolateModules(() => {
    native = require('react-native');
    application = jest.mocked(require('expo-application'));
    crypto = jest.mocked(require('expo-crypto'));
    secureStore = jest.mocked(require('expo-secure-store'));
    serviceModule = require('./device-id-service');
    service = serviceModule.deviceIdService;
  });
});
afterEach(() => { jest.restoreAllMocks(); });

test('exports one singleton and reuses the same pending and completed request', async () => {
  expect(serviceModule.DeviceIdService.getInstance()).toBe(service);
  const first = service.getId();
  const second = service.getId();
  expect(second).toBe(first);
  await expect(first).resolves.toBe(IOS_ID);
  expect(service.getId()).toBe(first);
  expect(crypto.randomUUID).toHaveBeenCalledTimes(1);
  expect(secureStore.setItemAsync).toHaveBeenCalledTimes(1);
});

test('uses an existing Keychain ID without generating or replacing it', async () => {
  secureStore.getItemAsync.mockResolvedValue(IOS_ID);
  await expect(service.getId()).resolves.toBe(IOS_ID);
  expect(crypto.randomUUID).not.toHaveBeenCalled();
  expect(secureStore.setItemAsync).not.toHaveBeenCalled();
  expect(application.getAndroidId).not.toHaveBeenCalled();
});

test('waits for the device-only, non-biometric Keychain write before returning an ID', async () => {
  let finish!: () => void;
  secureStore.setItemAsync.mockImplementationOnce(() => new Promise((resolve) => { finish = resolve; }));
  let returned = false;
  const result = service.getId().then((id) => { returned = true; return id; });
  await Promise.resolve();
  await Promise.resolve();
  expect(secureStore.setItemAsync).toHaveBeenCalledWith('calfit.device-id.v1', IOS_ID, expect.objectContaining({
    keychainService: 'calfit.device-identity',
    keychainAccessible: secureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    requireAuthentication: false,
  }));
  expect(returned).toBe(false);
  finish();
  await expect(result).resolves.toBe(IOS_ID);
  expect(secureStore.getItemAsync.mock.calls[0][1]).toEqual(secureStore.setItemAsync.mock.calls[0][2]);
});

test('a Keychain read failure does not generate a replacement and can be retried', async () => {
  secureStore.getItemAsync.mockRejectedValueOnce(new Error('Device is locked'));
  await expect(service.getId()).rejects.toThrow('Device is locked');
  expect(crypto.randomUUID).not.toHaveBeenCalled();
  expect(secureStore.setItemAsync).not.toHaveBeenCalled();
  secureStore.getItemAsync.mockResolvedValueOnce(IOS_ID);
  await expect(service.getId()).resolves.toBe(IOS_ID);
});

test('a failed write is not cached or returned as a durable identity', async () => {
  secureStore.setItemAsync.mockRejectedValueOnce(new Error('Keychain write failed'));
  await expect(service.getId()).rejects.toThrow('Keychain write failed');
  // The native write may have succeeded before reporting an error. Read again.
  secureStore.getItemAsync.mockResolvedValueOnce(IOS_ID);
  await expect(service.getId()).resolves.toBe(IOS_ID);
  expect(crypto.randomUUID).toHaveBeenCalledTimes(1);
});

test.each(['', 'corrupt-id'])('does not overwrite an invalid stored identity (%p)', async (id) => {
  secureStore.getItemAsync.mockResolvedValueOnce(id);
  await expect(service.getId()).rejects.toThrow('Stored iOS device identifier is invalid');
  expect(secureStore.setItemAsync).not.toHaveBeenCalled();
  expect(crypto.randomUUID).not.toHaveBeenCalled();
});

test('does not fall back to a volatile ID if Keychain is unavailable', async () => {
  secureStore.isAvailableAsync.mockResolvedValueOnce(false);
  await expect(service.getId()).rejects.toThrow('Keychain storage is unavailable');
  expect(crypto.randomUUID).not.toHaveBeenCalled();
});

test('rejects an invalid generated UUID before writing it', async () => {
  crypto.randomUUID.mockReturnValueOnce('invalid');
  await expect(service.getId()).rejects.toThrow('Could not generate a valid');
  expect(secureStore.setItemAsync).not.toHaveBeenCalled();
});

test('Android returns a stable application-scoped hash without storing a reinstall-volatile UUID', async () => {
  jest.replaceProperty(native.Platform, 'OS', 'android');
  const id = await service.getId();
  expect(id).toMatch(/^android_[0-9a-f]{64}$/);
  expect(id).not.toContain('abc123def4567890');
  expect(crypto.digestStringAsync).toHaveBeenCalledWith('SHA-256', 'calfit.device-id.android.v1:com.anonymous.calfit:abc123def4567890', { encoding: 'hex' });
  await expect(service.getId()).resolves.toBe(id);
  expect(application.getAndroidId).toHaveBeenCalledTimes(1);
  expect(secureStore.getItemAsync).not.toHaveBeenCalled();
  expect(secureStore.setItemAsync).not.toHaveBeenCalled();
  expect(crypto.randomUUID).not.toHaveBeenCalled();
});

test.each(['', '0000000000000000', 'not-hex'])('rejects an unavailable or invalid Android ID (%p)', async (id) => {
  jest.replaceProperty(native.Platform, 'OS', 'android');
  application.getAndroidId.mockReturnValueOnce(id);
  await expect(service.getId()).rejects.toThrow('identifier is unavailable');
  expect(crypto.digestStringAsync).not.toHaveBeenCalled();
});

test('Android requires an application namespace and does not substitute a hard-coded package', async () => {
  jest.replaceProperty(native.Platform, 'OS', 'android');
  jest.replaceProperty(application, 'applicationId', null);
  await expect(service.getId()).rejects.toThrow('identifier is unavailable');
});

test('Android hash failures can be retried', async () => {
  jest.replaceProperty(native.Platform, 'OS', 'android');
  crypto.digestStringAsync.mockRejectedValueOnce(new Error('Crypto unavailable'));
  await expect(service.getId()).rejects.toThrow('Crypto unavailable');
  await expect(service.getId()).resolves.toMatch(/^android_[0-9a-f]{64}$/);
});

test('the same Android ID produces different public IDs for different app packages', async () => {
  jest.replaceProperty(native.Platform, 'OS', 'android');
  const calfitId = await service.getId();
  let otherService!: typeof Service;
  jest.isolateModules(() => {
    const otherNative: typeof import('react-native') = require('react-native');
    const otherApplication: typeof import('expo-application') = require('expo-application');
    jest.replaceProperty(otherNative.Platform, 'OS', 'android');
    jest.replaceProperty(otherApplication, 'applicationId', 'com.example.other');
    otherService = require('./device-id-service').deviceIdService;
  });
  expect(await otherService.getId()).not.toBe(calfitId);
});

test('web is explicitly unsupported instead of pretending a browser ID is a device ID', async () => {
  jest.replaceProperty(native.Platform, 'OS', 'web');
  await expect(service.getId()).rejects.toThrow('supported only on Android and iOS');
  expect(application.getAndroidId).not.toHaveBeenCalled();
  expect(secureStore.isAvailableAsync).not.toHaveBeenCalled();
});

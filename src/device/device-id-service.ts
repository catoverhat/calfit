import * as Application from 'expo-application';
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Keep these stable across releases: changing either creates a new iOS identity.
const IOS_STORAGE_KEY = 'calfit.device-id.v1';
const IOS_KEYCHAIN_OPTIONS: SecureStore.SecureStoreOptions = {
  keychainService: 'calfit.device-identity',
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  requireAuthentication: false,
};
const IOS_ID_PATTERN = /^ios_[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Native, app-scoped identifier. This is not a credential or an account ID. */
export class DeviceIdService {
  private static instance: DeviceIdService | undefined;
  private request: Promise<string> | null = null;

  private constructor() {}

  static getInstance(): DeviceIdService {
    DeviceIdService.instance ??= new DeviceIdService();
    return DeviceIdService.instance;
  }

  /**
   * Concurrent callers share one read/create operation. Failed reads/writes can
   * be retried; an iOS ID is never returned until its Keychain write succeeds.
   */
  getId(): Promise<string> {
    if (!this.request) {
      const request = this.resolveId();
      this.request = request;
      void request.catch(() => {
        if (this.request === request) this.request = null;
      });
    }
    return this.request;
  }

  private async resolveId(): Promise<string> {
    if (Platform.OS === 'ios') return this.getIosId();
    if (Platform.OS === 'android') return this.getAndroidId();
    throw new Error('Persistent device IDs are supported only on Android and iOS.');
  }

  private async getIosId(): Promise<string> {
    if (!(await SecureStore.isAvailableAsync())) {
      throw new Error('iOS Keychain storage is unavailable.');
    }

    const storedId = await SecureStore.getItemAsync(IOS_STORAGE_KEY, IOS_KEYCHAIN_OPTIONS);
    if (storedId !== null) {
      // Do not silently rotate identity if storage is unreadable or corrupt.
      if (!IOS_ID_PATTERN.test(storedId)) throw new Error('Stored iOS device identifier is invalid.');
      return storedId;
    }

    const id = `ios_${Crypto.randomUUID()}`;
    if (!IOS_ID_PATTERN.test(id)) throw new Error('Could not generate a valid iOS device identifier.');
    await SecureStore.setItemAsync(IOS_STORAGE_KEY, id, IOS_KEYCHAIN_OPTIONS);
    return id;
  }

  private async getAndroidId(): Promise<string> {
    const applicationId = Application.applicationId;
    const androidId = Application.getAndroidId();
    if (!applicationId || !androidId || !/^[0-9a-f]{1,16}$/i.test(androidId) || /^0+$/.test(androidId)) {
      throw new Error('Android application or device identifier is unavailable.');
    }

    // ANDROID_ID is scoped to signing key/user/device. Including the package
    // scopes our public ID to Calfit even if other apps share the signing key.
    const digest = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      `calfit.device-id.android.v1:${applicationId}:${androidId.toLowerCase()}`,
      { encoding: Crypto.CryptoEncoding.HEX },
    );
    return `android_${digest}`;
  }
}

export const deviceIdService = DeviceIdService.getInstance();

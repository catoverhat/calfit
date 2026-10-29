# Native device identity

The app exposes one lazy singleton in `src/device/device-id-service.ts`:

```ts
import { deviceIdService } from '@/device/device-id-service';

const deviceId = await deviceIdService.getId();
```

`DeviceIdService.getInstance()` returns the same instance. Concurrent callers share one promise; successful results are cached for the current JavaScript runtime. Failed requests can be retried. Treat the returned string as an opaque identifier.

This service is ready for native consumers. It does not automatically change user IDs, initialize on app launch, send identifiers to a server, or create a browser identifier.

## Platform choices

| Platform | Source | Returned format | Persistence boundary |
|---|---|---|---|
| iOS | Cryptographically generated UUID v4 in Keychain through `expo-secure-store` | `ios_<uuid>` | Persists across launches/updates; can survive reinstall under the same app identity, but reinstall survival is not guaranteed |
| Android | `expo-application.getAndroidId()`, hashed with the application's package namespace through `expo-crypto` | `android_<sha256>` | Stable for the same signing key, Android user, device, and app namespace; factory reset, a different Android user, or signing/package changes can change it |
| Web / other platforms | Unsupported | Rejected promise | No native device identifier is claimed |

The service uses Expo SDK 56-compatible `expo-application`, `expo-secure-store`, and `expo-crypto`. These provide the native APIs already needed by this Expo app; a general device-info package and a separate UUID package are unnecessary.

## iOS Keychain behavior

The storage key is `calfit.device-id.v1`, with `keychainService: 'calfit.device-identity'`. Both must remain stable across releases. The default app-private Keychain access group is used; Keychain Sharing is not needed.

The item uses `WHEN_UNLOCKED_THIS_DEVICE_ONLY`. It is accessible while the device is unlocked and does not migrate to a different physical device through a backup restore. This avoids copying one device's identity to a replacement phone. No iCloud synchronization is requested. `requireAuthentication: false` avoids biometric prompts and invalidation when enrolled biometrics change. The app's separate device-authentication feature keeps its existing Face ID purpose string.

Only a successful read returning `null` causes creation. A read error, unavailable Keychain, or malformed stored value rejects without overwriting an existing identity. A newly generated ID is returned only after the Keychain write succeeds. A subsequent retry reads storage again, including when a write may have succeeded before reporting an error.

Apple does not promise that Keychain items survive app deletion. Reinstall persistence is useful observed behavior, not a permanent hardware identifier. Device erasure, Keychain removal, changes to app identity/access entitlements, and OS behavior can invalidate that assumption. `identifierForVendor` alone was not selected because it changes when all apps from a vendor are removed.

## Android behavior

Android's `ANDROID_ID` is already scoped to signing key, user, and device on Android 8+. The service hashes:

```text
calfit.device-id.android.v1:<applicationId>:<ANDROID_ID>
```

Including the package separates Calfit's public identifier from another app using the same signing key. Hashing namespaces the value; it does not make it anonymous or turn it into a secret. Debug builds and Play-distributed builds can have different signing identities and therefore different results.

No UUID is persisted in Android SecureStore: its encrypted preferences and Keystore key do not survive uninstall together. Using `ANDROID_ID` avoids presenting an installation UUID as a reinstall-persistent device identifier. The SecureStore config plugin still installs its standard Android backup exclusions, preserving correct behavior if secure storage is used elsewhere later.

For ordinary installation-only identity, Android recommends a Firebase installation ID or privately stored GUID. The stronger persistence choice here follows the explicit request for a native device identifier across reinstalls. Neither platform can guarantee an identifier that survives every reset. The ID is not an account identity, authentication credential, or proof that a request came from a genuine device.

## Research checked on 2026-10-24

Primary sources determine the implementation:

- [Expo SDK 56 Application](https://docs.expo.dev/versions/v56.0.0/sdk/application/): Android ID scope/reset conditions and iOS vendor-ID lifecycle.
- [Expo SDK 56 SecureStore](https://docs.expo.dev/versions/v56.0.0/sdk/securestore/): native storage, accessibility options, reinstall caveat, biometric invalidation, and Android backup exclusions.
- [Expo SDK 56 Crypto](https://docs.expo.dev/versions/v56.0.0/sdk/crypto/): secure UUID generation and SHA-256 hashing.
- [Android identifier guidance](https://developer.android.com/identity/user-data-ids) and [ANDROID_ID reference](https://developer.android.com/reference/android/provider/Settings.Secure#ANDROID_ID): appropriate scopes and lifecycle limits.
- [Apple Keychain accessibility](https://developer.apple.com/documentation/security/restricting-keychain-item-accessibility): device-only items do not migrate to another device.
- [Apple DTS discussion of uninstall behavior](https://developer.apple.com/forums/thread/36442): preserving Keychain items after deletion is an implementation detail.

Reddit was reviewed as requested, as community experience rather than a platform guarantee:

- [iOS identifier discussion](https://www.reddit.com/r/swift/comments/16lyii9/what_is_your_alternative_way_to_get_the_unique_id/): Keychain persistence suggestions and the risk of carrying an identifier to another iPhone through backup migration. The device-only accessibility setting addresses the latter.
- [Android persistent-ID discussion](https://www.reddit.com/r/reactnative/comments/1oc6n09/need_a_unique_and_persistent_device_id_on_android/): reports of changing IDs and conflicting reinstall advice. The implementation follows Android's documented scope rather than assuming permanence from comments.

## Verification and native builds

Unit tests cover singleton reuse, concurrent creation, waiting for durable writes, stored-ID reuse, error retry, corruption handling, unavailable storage, Android namespace separation, and unsupported platforms. These verify service logic, not OS uninstall behavior.

Create a new Android/iOS development build after adding the native packages and config plugin. Keep the intended production package/bundle ID and signing identity stable. Reinstall and backup behavior still need testing on real native builds; no development server or device erase is part of this change. Local SQLite development resets do not clear this service's identifier.


Verification for this change: TypeScript and ESLint passed; all 28 Jest suites / 122 tests passed, including 17 device-ID cases. Web production export passed to `dist/device-id-check`. Expo native configuration introspection confirmed SecureStore backup exclusions and the unchanged Face ID purpose string. Expo's offline dependency check accepted the installed SDK-compatible versions. Reinstall tests must use Calfit's own fixed-bundle, consistently signed native build; Expo Go's host identity is not representative of Calfit's production identity.

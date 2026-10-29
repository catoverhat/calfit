# Screen and battery behavior

Calfit allows the device's normal screen dimming and auto-lock by default. It does not set its own lock timeout or change device brightness.

Profile → Screen & battery offers **Keep screen awake during workouts**, off by default. The setting saves immediately on this device using Expo SQLite key-value storage. `features/workout-session/workout-preferences.tsx` is the public preference API shared with Profile.

When enabled, a wake lock is held only while the active workout screen has navigation focus and the app is active. Leaving that screen, finishing the workout, locking Calfit, backgrounding the app, or turning the option off releases the lock. Unsupported browsers or denied wake-lock requests fall back to normal screen timeout.

Workout display ticks stop when the screen loses focus or the app becomes inactive. Elapsed time and rest deadlines use timestamps, so returning to the screen immediately shows the correct time. Pending debounced set edits are submitted when the screen loses foreground. No background timer service or polling is added. The existing startup animation is finite and no repeating animations were found.

Expo's development wrapper automatically holds its default wake lock. `hooks/use-development-screen-timeout.ts` releases that tag after mount effects run, allowing the same timeout behavior during development. Workout locks have separate tags.

Implementation follows the [Expo SDK 56 KeepAwake API](https://docs.expo.dev/versions/v56.0.0/sdk/keep-awake/) and [SQLite key-value storage](https://docs.expo.dev/versions/v56.0.0/sdk/sqlite/#key-value-storage).

## Device verification

Use a short device auto-lock timeout and check:

1. With the option off, leave Profile and a workout open separately. Both should dim and lock normally.
2. Turn the option on and open an active workout. It should remain awake beyond that timeout.
3. Leave the workout, finish it, or lock Calfit. Normal auto-lock should resume.
4. Background or manually lock the device during a rest period. Return after the rest deadline; the elapsed timer should include that time and the rest period should be over.
5. Restart Calfit and verify the preference persists.

These physical screen and operating-system behaviors require device verification; automated tests cover preferences, lifecycle gating, timer catch-up, pending saves, and wake-lock cleanup.

# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing any code.

## Development Server

- Do not start the Expo dev server, including `pnpm start`, `expo start`, or background `Start-Process` server commands.
- The user will start and manage the Expo dev server manually.
- You may run non-server verification commands such as TypeScript, lint, and tests when useful.

## Design Reference

- Read `docs/design.md` before making UI changes.
- Treat `docs/design.md` as the source of truth for visual style: dark-mode-first technical athleticism, Electric Orange primary actions, 8px spacing rhythm, 8px standard radius, tonal borders over heavy shadows, and Montserrat/Inter typography roles.
- Prefer the design file over ad hoc styling choices unless the user provides a newer screenshot or direct instruction.

## Fonts

Follow https://docs.expo.dev/develop/user-interface/fonts/.

- Embed native fonts at build time with the `expo-font` config plugin in `app.json`.
- Do not load fonts at runtime on Android or iOS with `useFonts`.
- Load fonts at runtime only on web through `src/hooks/use-app-fonts.web.ts`, because config plugins do not run on web.
- Keep font-family tokens in `src/constants/theme.ts` and use those tokens instead of hard-coded family names.
- After adding or changing embedded fonts, create a new development build. Embedded fonts are not available in Expo Go.

## Icons

- Use `@react-native-vector-icons/lucide` for app icons.
- Prefer static icon-font imports: `import { Lucide } from '@react-native-vector-icons/lucide/static';`.
- Render icons with the shared design tokens for color and sizing; avoid hard-coded icon colors unless the design explicitly calls for one.
- Keep `@react-native-vector-icons/lucide` in the Expo `plugins` array when using static imports so the icon font is embedded at build time.
- Do not introduce `@expo/vector-icons` for new icon work.

## Navigation

Follow https://docs.expo.dev/router/advanced/stack/ and the SDK 56 Expo Router documentation.

- Use `NativeTabs` only for top-level destinations. Every `NativeTabs.Trigger` name must exactly match its route file or directory.
- When a tab has child or detail screens, make that tab a directory with its own `_layout.tsx` using `Stack`.
- Put the tab's landing screen in `index.tsx` and use dynamic route files such as `[id].tsx` for details.
- Keep route files focused on route parameters and screen composition. Put reusable UI, types, and business logic outside `src/app`.
- Navigate with Expo Router `Link` or `router.push`; do not simulate navigation with local component state.
- Use the shared branded `Header` on tab landing screens. Use Stack headers and native back behavior on detail screens.
- Make a `ScrollView`, `FlatList`, or `SectionList` with `contentInsetAdjustmentBehavior="automatic"` the first rendered view of Stack screens.
- Keep `app-tabs.tsx` and `app-tabs.web.tsx` aligned so native and web expose the same top-level destinations.

# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing any code.

## Fonts

Follow https://docs.expo.dev/develop/user-interface/fonts/.

- Embed native fonts at build time with the `expo-font` config plugin in `app.json`.
- Do not load fonts at runtime on Android or iOS with `useFonts`.
- Load fonts at runtime only on web through `src/hooks/use-app-fonts.web.ts`, because config plugins do not run on web.
- Keep font-family tokens in `src/constants/theme.ts` and use those tokens instead of hard-coded family names.
- After adding or changing embedded fonts, create a new development build. Embedded fonts are not available in Expo Go.

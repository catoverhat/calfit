# Calfit

Calfit is a local-first workout tracking app built with Expo SDK 56, Expo Router, React Native, and SQLite.

## Setup

Install dependencies with pnpm:

```bash
pnpm install
```

Native fonts and Lucide icons are embedded at build time. Use a development build for Android and iOS; Expo Go does not include those embedded assets.

## Commands

```bash
pnpm start                    # Start Expo manually
pnpm android                  # Open the Android development build
pnpm ios                      # Open the iOS development build
pnpm web                      # Run the web app
pnpm test -- --runInBand      # Run the Jest suite
pnpm lint                     # Run ESLint
pnpm exec tsc --noEmit        # Type-check the project
pnpm exec expo export --platform web  # Validate the production web bundle
```

## Architecture

- [Folder structure](docs/folderStructure.md) — route-only `src/app`, feature-owned code, shared boundaries, and colocated tests.
- [Design system](docs/design.md) — visual language, spacing, typography, colors, and component guidance.

Expo Router owns navigation under `src/app`; product screens, hooks, components, and view models live under `src/features`. Database consumers import the stable public API from `@/db` rather than individual repository modules.

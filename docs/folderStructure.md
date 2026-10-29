# Folder Structure

This document defines Calfit's source organization. It is the source of truth for where new and existing code belongs.

The architecture is **route-first at the navigation boundary and feature-first everywhere else**:

- Expo Router owns `src/app`.
- Product capabilities live in `src/features`.
- Reusable UI, navigation, persistence, theme, and test data have explicit shared locations.
- Related code stays close together so a feature can be understood and changed without searching several global folders.

## Repository Tree

```text
assets/                         # Expo-configured images, icons, and native assets
docs/                           # Product, design, architecture, and workflow documentation
src/
├── device/                     # App-wide native device identity
│   ├── device-id-service.ts
│   └── device-id-service.test.ts
├── app/                        # Expo Router routes and layouts only
│   ├── _layout.tsx
│   ├── login.tsx
│   ├── workout-session/
│   │   └── [id].tsx
│   └── (tabs)/
│       ├── _layout.tsx
│       ├── index.tsx
│       ├── plan/
│       │   ├── _layout.tsx
│       │   └── index.tsx
│       ├── workouts/
│       │   ├── _layout.tsx
│       │   ├── index.tsx
│       │   ├── create.tsx
│       │   ├── add-exercise.tsx
│       │   ├── [id]/
│       │   │   ├── index.tsx
│       │   │   └── edit.tsx
│       │   └── exercises/
│       │       ├── _layout.tsx
│       │       ├── index.tsx
│       │       ├── create.tsx
│       │       └── [id]/
│       │           └── edit.tsx
│       ├── progress/
│       │   ├── _layout.tsx
│       │   ├── index.tsx
│       │   ├── history.tsx
│       │   ├── measurements.tsx
│       │   ├── summary.tsx
│       │   └── storage.tsx
│       └── profile/
│           └── index.tsx
│
├── features/                   # Product capabilities and feature-owned code
│   ├── auth/
│   ├── today/
│   ├── plan/                   # ISO-week planner UI, calendar rules, and view models
│   ├── exercises/              # Exercise management owned by the Workouts product area
│   ├── routines/               # Workout library/builder and definitions
│   ├── workout-session/
│   ├── progress/
│   └── profile/
│
├── components/                 # Feature-agnostic reusable UI only
│   ├── ui/                     # Primitive controls and visual building blocks
│   └── layout/                 # Shared page shells, headers, and layout helpers
│
├── navigation/                 # Shared navigation implementations
│   ├── app-tabs.tsx
│   └── app-tabs.web.tsx
│
├── db/                         # SQLite infrastructure and shared persistence types
│   ├── database.ts
│   ├── database.test.ts
│   ├── id.ts
│   ├── index.ts
│   ├── schema.ts
│   ├── schema.test.ts
│   ├── types.ts
│   ├── units.ts                    # Canonical measurement conversions and unit types
│   ├── units.test.ts
│   ├── repositories/           # Repositories split by domain
│   │   ├── body-measurements.ts
│   │   ├── body-measurements.test.ts
│   │   ├── dashboard.ts
│   │   ├── dashboard.test.ts
│   │   ├── exercises.ts
│   │   ├── exercises.test.ts
│   │   ├── routines.ts
│   │   ├── routines.test.ts
│   │   ├── workout-plan.ts
│   │   ├── workout-plan.test.ts
│   │   ├── users.ts
│   │   ├── users.test.ts
│   │   ├── workout-sessions.ts
│   │   └── workout-sessions.test.ts
│   ├── seed-data/
│   │   └── exercise-catalog.ts
│   └── testing/                # Shared database test support
│       └── memory-database.ts
│
├── theme/                      # Design tokens and theme utilities
│   ├── tokens.ts
│   ├── navigation-theme.ts
│   ├── palettes.ts
│   ├── appearance.ts
│   ├── app-theme-provider.tsx
│   └── create-themed-styles.ts
│
├── hooks/                      # App-wide hooks only, never feature-specific hooks
│   ├── use-app-fonts.ts
│   └── use-app-fonts.web.ts
│
└── global.css
```

Configuration files such as `app.json`, `package.json`, `tsconfig.json`, and `eslint.config.js` remain at the repository root. Expo assets remain in the root `assets` directory.

The tree describes active ownership boundaries, not a requirement to create every possible directory. Do not add empty folders merely to match the diagram.

### Plan and Workouts ownership

The five top-level destinations are Today, Plan, Workouts, Progress, and Profile on both native and web. `src/features/plan` owns date-based ISO-week planning. The Workouts product area owns reusable workout definitions and the nested exercise catalog. Its implementation remains in `src/features/routines` and `src/features/exercises` to match the SQLite `routines` domain and feature ownership; no user-facing screen should call a workout a routine.

The retired `/routines` and `/exercises` URL aliases are not registered in `src/app`. New navigation and links must use `/workouts` and `/workouts/exercises` exclusively.

Date assignments belong exclusively to `db/repositories/workout-plan.ts`. Workouts are reusable definitions with no weekday schedule; Today reads the date-based plan. The retired recurring-schedule tables, import UI, and compatibility APIs are removed.

## Device infrastructure

`src/device` owns app-wide device identity services. It is independent of feature state and SQLite, so development database resets do not rotate a native device identifier. Feature code imports the singleton from `@/device/device-id-service`; colocate its tests in the same directory. Only Android and iOS have a native device identifier; web callers receive an explicit unsupported-platform error.

## Folder Responsibilities

### `src/app`

`src/app` is exclusively the Expo Router navigation tree. A route should normally do only the following:

1. Read and validate route parameters.
2. Configure route-specific navigation options when needed.
3. Render a screen imported from `src/features`.
4. Export Router-specific functions such as `generateStaticParams` when required.

Do not define reusable components, feature state, database queries, business rules, large style sheets, or general-purpose utilities in a route file. Loading, empty, and error UI that is specific to a feature belongs with that feature.

Keep route names aligned with their URLs and navigator entries. A top-level `NativeTabs.Trigger` name must exactly match its route file or directory. When a dynamic route has nested pages, prefer:

```text
[id]/
├── index.tsx
└── edit.tsx
```

over a sibling `[id].tsx` file and `[id]` directory.

### `src/features`

Each feature owns its screens, feature-specific components, hooks, view models, validation, types, and tests. Start with a flat feature folder and introduce subdirectories only when they improve scanning.

Example:

```text
features/exercises/
├── components/
│   ├── exercise-card.tsx
│   ├── exercise-card.test.tsx
│   └── exercise-form.tsx
├── exercise-catalog-screen.tsx
├── exercise-editor-screen.tsx
├── exercise-catalog.viewmodel.ts
├── exercise-catalog.viewmodel.test.ts
├── use-exercise-catalog.ts
├── use-exercise-catalog.native.ts
├── use-exercise-catalog.web.ts
├── use-exercise-editor.ts
├── use-exercise-editor.native.ts
└── use-exercise-editor.web.ts
```

Platform variants stay beside the base module and expose the same public API.

### Test Colocation

Unit and component tests must live directly beside the source file they cover. Matching filenames make implementation and coverage easy to discover:

```text
exercise-card.tsx
exercise-card.test.tsx

exercise-catalog.viewmodel.ts
exercise-catalog.viewmodel.test.ts

use-exercise-catalog.native.ts
use-exercise-catalog.native.test.ts
```

Do not create `__tests__` directories for unit or component tests. When a test covers several modules, place it beside the primary module or feature entry point it verifies and give it a descriptive `.test.ts` or `.test.tsx` name. Only genuinely repository-wide integration or end-to-end suites may use a separate top-level test location, and that location must be documented when introduced.

A feature must not reach into another feature's internal files casually. If code has stable meaning across multiple features, extract it into an appropriate shared module. If it still belongs to one feature, expose a deliberate public module from that feature rather than importing arbitrary internals.

### `src/components`

This folder contains only reusable, feature-agnostic UI:

- `ui`: icons, text primitives, buttons, inputs, cards, and similar building blocks.
- `layout`: shared headers, screen containers, and page-level layout helpers.

A component used by only one feature belongs in that feature. A component should not be moved into the shared folder merely because it might be reused someday.

### `src/navigation`

Shared navigator implementations live here. Route `_layout.tsx` files may import these navigators, but route definitions remain in `src/app`.

Native and web variants must expose the same destinations and equivalent navigation behavior.

### `src/db`

Keep database initialization, schema, persistence types, IDs, and repository implementations here. Split repositories by domain rather than accumulating unrelated operations in a single `repositories.ts` file.

Feature UI must not contain raw SQL. Feature hooks or data adapters may call the database's exported repository functions.

### `src/theme`

All design tokens and theme utilities live here. `palettes.ts` defines both color schemes; `app-theme-provider.tsx` resolves the saved profile preference against the device scheme, `appearance.ts` contains the selection rules, and `create-themed-styles.ts` keeps component styles reactive. Navigation themes are derived from the same active palette. Colors, spacing, typography, font families, radii, and other design values must be imported from the shared theme rather than duplicated or hard-coded in feature code.

`docs/design.md` remains the visual source of truth; `src/theme/tokens.ts` and `src/theme/palettes.ts` are its code representation.

### `src/hooks`

Only hooks used across the entire application belong here, such as app font initialization or platform color-scheme access. Feature-specific hooks belong in their feature even when their names begin with `use`.

## Naming and Imports

- Use `kebab-case` filenames.
- Name React hooks with the `use-` prefix.
- Name screen components with the `-screen.tsx` suffix.
- Colocate tests with their source and use matching names: `thing.ts` with `thing.test.ts`, or `thing.tsx` with `thing.test.tsx`.
- Use platform suffixes immediately before the extension: `.native.ts`, `.web.ts`, `.native.tsx`, or `.web.tsx`.
- Prefer the `@/` alias for imports across directories.
- Use relative imports for tightly coupled files inside the same feature when that is clearer.
- Avoid broad barrel files that hide ownership or introduce circular dependencies. Add a narrow public entry point only when a feature needs an intentional external API.
- Do not create generic dumping grounds such as `utils`, `helpers`, `common`, or `misc`. Name a module after its responsibility and place it with its owner.

## Dependency Direction

Dependencies should generally flow in this direction:

```text
src/app
  -> src/features
      -> src/components
      -> src/theme
      -> src/db
  -> src/navigation
      -> src/components
      -> src/theme
```

Shared modules must not import route files. Database infrastructure must not import UI. Reusable UI must not import feature screens or feature state.

## Structure Maintenance Rules

The feature-first migration is complete. When moving or introducing code:

1. Work in a coherent vertical slice, such as exercises or progress.
2. Preserve behavior and any unrelated user changes.
3. Move its screens, hooks, view models, tests, and feature-only components together, placing every unit or component test beside its source file.
4. Update imports in the same change.
5. Split oversized files or repositories only where the boundaries are clear.
6. Remove obsolete originals after references have been updated; do not maintain duplicate implementations.
7. Remove empty directories and unused barrel files created by the move.
8. Run TypeScript, lint, and relevant tests without starting the Expo development server.
9. Keep screen files focused on state, navigation, and composition; extract feature-owned sections and keep their styles beside them.

## Workout screen preferences

`src/features/workout-session/workout-preferences.tsx` exposes the workout screen wake preference and its provider as a deliberate public API for Profile. The workout feature owns foreground detection, screen wake locks, and display timer lifecycle. Profile owns the settings control. The app-wide `src/hooks/use-development-screen-timeout.ts` releases Expo's automatic development wake lock. See [screen and battery behavior](screen-and-battery.md).

## Placement Checklist

Before creating a source file, ask:

1. Is it an Expo Router route or layout? Put it in `src/app`.
2. Does one product feature own it? Put it in `src/features/<feature>`.
3. Is it reusable UI with no feature knowledge? Put it in `src/components/ui` or `src/components/layout`.
4. Is it shared navigation, persistence, theme, or an app-wide hook? Use the dedicated folder.
5. Is the proposed folder generic because ownership is unclear? Resolve ownership before adding the file.

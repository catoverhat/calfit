# Folder Structure

This document defines the target source organization for Calfit. It is the source of truth for where new code belongs and how existing code should be migrated.

The architecture is **route-first at the navigation boundary and feature-first everywhere else**:

- Expo Router owns `src/app`.
- Product capabilities live in `src/features`.
- Reusable UI, navigation, persistence, theme, and test data have explicit shared locations.
- Related code stays close together so a feature can be understood and changed without searching several global folders.

## Target Tree

```text
assets/                         # Expo-configured images, icons, and native assets
docs/                           # Product, design, architecture, and workflow documentation
scripts/                        # Repository maintenance scripts

src/
├── app/                        # Expo Router routes and layouts only
│   ├── _layout.tsx
│   ├── login.tsx
│   ├── workout-session/
│   │   └── [id].tsx
│   └── (tabs)/
│       ├── _layout.tsx
│       ├── index.tsx
│       ├── exercises/
│       │   ├── _layout.tsx
│       │   ├── index.tsx
│       │   ├── create.tsx
│       │   └── [id]/
│       │       └── edit.tsx
│       ├── routines/
│       │   ├── _layout.tsx
│       │   ├── index.tsx
│       │   ├── create.tsx
│       │   ├── add-exercise.tsx
│       │   └── [id]/
│       │       ├── index.tsx
│       │       └── edit.tsx
│       ├── progress/
│       │   ├── _layout.tsx
│       │   ├── index.tsx
│       │   ├── history.tsx
│       │   ├── measurements.tsx
│       │   ├── summary.tsx
│       │   └── sync.tsx
│       └── profile/
│           └── index.tsx
│
├── features/                   # Product capabilities and feature-owned code
│   ├── auth/
│   ├── today/
│   ├── exercises/
│   ├── routines/
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
│   ├── id.ts
│   ├── index.ts
│   ├── schema.ts
│   ├── types.ts
│   └── repositories/           # Repositories split by domain
│       ├── exercises.ts
│       ├── routines.ts
│       ├── users.ts
│       └── workout-sessions.ts
│
├── theme/                      # Design tokens and theme utilities
│   ├── tokens.ts
│   └── use-theme.ts
│
├── hooks/                      # App-wide hooks only, never feature-specific hooks
│   ├── use-app-fonts.ts
│   ├── use-app-fonts.web.ts
│   ├── use-color-scheme.ts
│   └── use-color-scheme.web.ts
│
├── fixtures/                   # Development and test fixtures; not production constants
│   └── mock-data.ts
│
└── global.css
```

Configuration files such as `app.json`, `package.json`, `tsconfig.json`, and `eslint.config.js` remain at the repository root. Expo assets remain in the root `assets` directory.

The tree is a target, not a requirement to create every directory immediately. Do not add empty folders merely to match the diagram.

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

All design tokens and theme utilities live here. Colors, spacing, typography, font families, radii, and other design values must be imported from the shared theme rather than duplicated or hard-coded in feature code.

`docs/design.md` remains the visual source of truth; `src/theme/tokens.ts` is its code representation.

### `src/hooks`

Only hooks used across the entire application belong here, such as app font initialization or platform color-scheme access. Feature-specific hooks belong in their feature even when their names begin with `use`.

### `src/fixtures`

Mock users, workouts, routines, and other sample records belong here when multiple features or tests use them. Static production catalogs should live with the feature or persistence layer that owns them, not in a generic `constants` folder.

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

## Incremental Migration Rules

The current repository predates this structure and will be migrated feature by feature.

When migrating:

1. Select a coherent vertical slice, such as exercises or progress.
2. Preserve behavior and any unrelated user changes.
3. Move its screens, hooks, view models, tests, and feature-only components together, placing every unit or component test beside its source file.
4. Update imports in the same change.
5. Split oversized files or repositories only where the boundaries are clear.
6. Remove obsolete originals after references have been updated; do not maintain duplicate implementations.
7. Remove empty directories and unused barrel files created by the move.
8. Run TypeScript, lint, and relevant tests without starting the Expo development server.

Until a shared module is migrated, use its existing location. Do not create a duplicate `theme`, fixture, hook, or database module solely to satisfy the target tree. The module should move once, with its consumers updated atomically.

## Placement Checklist

Before creating a source file, ask:

1. Is it an Expo Router route or layout? Put it in `src/app`.
2. Does one product feature own it? Put it in `src/features/<feature>`.
3. Is it reusable UI with no feature knowledge? Put it in `src/components/ui` or `src/components/layout`.
4. Is it shared navigation, persistence, theme, an app-wide hook, or fixture data? Use the dedicated folder.
5. Is the proposed folder generic because ownership is unclear? Resolve ownership before adding the file.

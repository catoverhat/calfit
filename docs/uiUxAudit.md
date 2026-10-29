# UI/UX Page Audit

This checklist tracks the page-by-page Calfit interface review. A page is marked **Reviewed** only after its hierarchy, primary action, state handling, touch targets, responsiveness, accessibility, and visual consistency have been inspected. **Polished** means the resulting changes have also passed TypeScript, lint, and relevant tests.

The retired `/routines` and `/exercises` aliases have been removed. All workout and exercise management routes live below `/workouts`.

|   # | Page / state            | Route                           | Feature owner   | Review status | Notes                                                                                                                                |
| --: | ----------------------- | ------------------------------- | --------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
|   1 | Login / app unlock      | `/login`                        | Auth            | Polished      | Removed the misleading carousel indicator; retained one clear secure-entry action and device-auth feedback.                          |
|   2 | Today                   | `/`                             | Today           | Polished      | Standardized icons and surfaces, made the identity header open Profile, and improved workout-state accessibility.                    |
|   3 | Weekly planner          | `/plan`                         | Plan            | Polished      | Added complete control labels/states and 48 px retry/undo targets across assignment, move, swap, and import flows.                   |
|   4 | Workout library         | `/workouts`                     | Workouts        | Polished      | Added readable active/inactive status and enlarged Edit/View actions while preserving at-a-glance workout metrics.                   |
|   5 | Create workout          | `/workouts/create`              | Workouts        | Polished      | Corrected the route title, enlarged reorder/remove controls, and clarified disabled and add-set actions.                             |
|   6 | Workout details         | `/workouts/[id]`                | Workouts        | Polished      | Improved error recovery, edit/start semantics, and busy/disabled state announcements.                                                |
|   7 | Edit workout            | `/workouts/[id]/edit`           | Workouts        | Polished      | Corrected the route title and aligned editor controls with the create flow and minimum touch target.                                 |
|   8 | Add exercise to workout | `/workouts/add-exercise`        | Workouts        | Polished      | Enlarged filters and made the footer action explicit and unavailable until exercises are selected.                                   |
|   9 | Exercise catalog        | `/workouts/exercises`           | Exercises       | Polished      | Converted oversized cards to scannable rows and enlarged search, filter, and edit controls.                                          |
|  10 | Create exercise         | `/workouts/exercises/create`    | Exercises       | Polished      | Added editable optional media URLs and enlarged categories and switch interaction areas.                                             |
|  11 | Edit exercise           | `/workouts/exercises/[id]/edit` | Exercises       | Polished      | Existing image/video values can now be edited; form control sizing and accessibility match create mode.                              |
|  12 | Active workout          | `/workout-session/[id]`         | Workout session | Polished      | Added overall set progress plus visible and announced exercise expand/collapse state.                                                |
|  13 | Progress dashboard      | `/progress`                     | Progress        | Polished      | Strengthened page hierarchy, widened the responsive content area, and added a consistency legend and chart summary.                  |
|  14 | Workout history         | `/progress/history`             | Progress        | Polished      | Enlarged session filter chips to reliable 48 px touch targets.                                                                       |
|  15 | Body measurements       | `/progress/measurements`        | Progress        | Polished      | Enlarged the history navigation target; reviewed form, chart, loading, and empty states.                                             |
|  16 | Workout summary         | `/progress/summary`             | Progress        | Reviewed      | Completion hierarchy, stats, notes, history, and primary continuation action already follow the design system.                       |
|  17 | Local storage status    | `/progress/storage`             | Progress        | Polished      | Enlarged recovery action and reviewed clear ready/error/offline explanations.                                                        |
|  18 | Profile and preferences | `/profile`                      | Profile         | Polished      | Reframed onboarding copy as persistent preferences, removed decorative interruption, standardized icons, and enlarged unit controls. |

## Verification

- TypeScript: passed (`pnpm exec tsc --noEmit`).
- ESLint: passed (`pnpm lint`).
- Jest: 22 suites and 85 tests passed (`pnpm test -- --runInBand`).
- Web production export: passed (`pnpm exec expo export --platform web --output-dir dist/uiux-preview-20261023`).

## UI UX Designer implementation refresh — 2026-10-23

This pass implements the earlier code-level review. The dark charcoal palette, Electric Orange actions, Montserrat/Inter roles, standard 8 px corners, and feature ownership remain the design direction.

| Previous issue                                                        | Implemented change                                                                                                | User benefit                                                 |
| --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Shared profile avatars announced an action without a handler          | Header avatars link to Profile by default; Profile renders its own avatar without a redundant action              | Predictable navigation and accurate accessibility semantics  |
| Separate Today/Profile header designs and uneven side slots           | Shared branded Header with equal 48 px slots                                                                      | Consistent alignment and reliable touch targets              |
| Competing Progress charts without a clear starting point              | Training overview, 7/30/90-day selector, workout/volume tabs, separate latest measurements, and exploration links | Faster answers to how much and how often the athlete trained |
| Fixed chart strokes and a six-row consistency grid                    | Connected responsive line geometry, all seven weekdays aligned to Monday, blank future dates, and count legends   | Charts reflect the recorded data correctly                   |
| Profile used legacy colors, small controls, and faint placeholders    | Shared semantic tokens, 48 px fields, larger unit labels, readable placeholders, and feet/inches guidance         | Easier form entry and a consistent visual system             |
| Small catalog labels and a cramped exercise-picker footer             | Larger search/filter text, compact thumbnails, and a wrapping footer                                              | Improved readability and compact-screen behavior             |
| Web controls had no deliberate focus treatment                        | Keyboard focus rings, pointer feedback, larger tab labels, and a selected-tab surface                             | Clearer feedback for keyboard and pointer input              |
| Automatic system theme conflicted with consistently dark app surfaces | Shared dark navigation theme and light status-bar text                                                            | Consistent system chrome on devices using light mode         |

Regression coverage includes period boundaries, distinct training-day counts, full-period volume totals, Sunday consistency entries, absent weight entries, and chart endpoints at phone/tablet widths. An existing repository test now supplies an explicit date instead of depending on the current weekday.

Verification above covers code, data behavior, and web bundling. Device/browser visual QA, large system text, and screen-reader interaction remain manual checks. The Expo development server was not started.

## Review rubric

- One clear page purpose and one visually dominant primary action.
- Important workout data remains readable at a glance and at arm's length.
- Interactive controls provide at least a 48 px touch target and visible pressed/disabled states.
- Loading, empty, success, validation, and error states explain what happened and what to do next.
- Forms use appropriate keyboards, labels, units, helper text, and safe save behavior.
- Navigation labels and back behavior match the user's mental model.
- Layouts preserve the 8 px rhythm, tonal borders, Electric Orange action hierarchy, and Montserrat/Inter type roles.
- Content remains usable on compact phones and constrained to a readable width on larger screens/web.
- Controls expose accessibility roles, labels, state, and logical reading order.

## Wellness color investigation ? 2026-10-23

Tracking scope: shared palette and its consumers, preserving the existing page-by-page audit above. User direction: Calfit is a wellness app. No connected Page was supplied, so this document is the tracking page.

### Research and decisions

- [Color?emotion systematic review](https://pmc.ncbi.nlm.nih.gov/articles/PMC12325498/): associations vary with hue, lightness, saturation, and context. Associations do not demonstrate that an app palette changes experienced emotions. A low-chroma sage/charcoal foundation is a design hypothesis for a less intense wellness identity, to validate with users.
- [Cross-cultural primary research](https://pubmed.ncbi.nlm.nih.gov/32900287/): color associations share patterns but are also shaped by geography and language. Avoid universal claims such as green being inherently calming.
- [WCAG text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html): target at least 4.5:1 for normal text. Lightness contrast takes priority over hue symbolism.
- [WCAG use of color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html): retain text, checks, counts, and accessibility states; color must not be the sole signal.
- [Expo SDK 56 reference](https://docs.expo.dev/versions/v56.0.0/) reviewed before implementation.

Use muted green-charcoal across the largest areas, sage for completion, teal for information/focus, sand for achievements, and rose for errors. Preserve Electric Orange for actions, softening it from #FF5F1F to #FF854D. This balances the existing athletic identity with the requested wellness direction. Keep Montserrat/Inter, spacing, and component geometry unchanged. A separate light appearance is outside this pass; both system modes intentionally retain the dark palette.

### Measured color pairs

Calculated using WCAG relative luminance on solid sRGB tokens. These are token checks, not certification of every rendered screen.

| Role                         | Foreground / background | Contrast |
| ---------------------------- | ----------------------- | -------: |
| Primary text / card          | `#EDF2EC` / `#202925`   |  13.17:1 |
| Secondary text / card        | `#C2CFC5` / `#202925`   |   9.27:1 |
| Muted text / highest surface | `#A7B9AD` / `#35423B`   |   5.11:1 |
| Action label / orange        | `#29180F` / `#FF854D`   |   7.07:1 |
| Peach label / card           | `#FFBC99` / `#202925`   |   9.18:1 |
| Sage / success container     | `#9CCDAB` / `#243C2D`   |   6.67:1 |
| Teal / elevated surface      | `#8DD5CE` / `#2B3631`   |   7.49:1 |
| Error / error container      | `#FFB4AF` / `#5C252B`   |   7.07:1 |
| Input boundary / recessed    | `#71867A` / `#18201C`   |   4.27:1 |

### Implementation tracking

- [x] Replace warm brown neutrals and competing bright blue/neon green with coherent wellness roles in shared tokens.
- [x] Separate peach secondary action text from teal information/focus.
- [x] Use sage rather than orange for recorded consistency, retaining numeric legends.
- [x] Centralize legacy feature accent/status tints; improve exercise-form placeholder legibility.
- [x] Give shared input boundaries a stronger contrast role; retain subtle decorative card borders.
- [x] Align CSS keyboard focus and launch overlay/native splash background with theme tokens.
- [x] Update design source of truth and preserve prior audit entries and local work.
- [ ] Device/browser visual QA, larger text, color-vision simulation, and wellness audience feedback.

Native splash configuration changes require a new native build. No Expo development server was started.

Palette verification: TypeScript and ESLint passed; Jest passed all 22 suites / 85 tests; `git diff --check` passed. The nine documented solid-color pairs meet their respective text (4.5:1) or control-boundary (3:1) targets. Visual QA remains pending; no production export was rerun for this palette pass.

Planner button refinement: day-card actions now share a fixed 80 px width, centered labels, and a minimum 48 px height. Rows wrap on smaller cards; labels can wrap with larger text.

## Component loading and navigation continuity ? 2026-10-23

- [x] Planner initial loading stays within seven dated day cards instead of replacing the week with a large spinner.
- [x] Assignment, replacement, removal, and start show a busy indicator on the affected day. Moves/swaps mark both source and destination; copy/import use the relevant week and undo uses its affected dates.
- [x] Retain other day cards during writes and data reconciliation; keep the pending indicator until updated entries arrive.
- [x] Block overlapping planner writes and announce busy/disabled states. Failed saves retain the week and expose retry/recovery feedback.
- [x] Ignore stale planner refreshes started before a write. Retain cached year data on focus; changing year still loads the new year.
- [x] Widen Assign workout to 144 px while keeping the short action buttons at 80 px, constrained by available card width. Center labels and retain wrapping for larger text.
- [x] Returning to Today, Workouts, Exercises, and Progress refreshes data without replacing previously loaded content with initial-loading UI. Progress retains its previous snapshot if a refresh fails.
- [x] Verification: TypeScript and ESLint passed; 23 Jest suites / 87 tests passed. New asynchronous hook coverage checks day-scoped busy state through reconciliation, duplicate-submission prevention, failure cleanup, and retry.
- [ ] Manual device checks: tab/back transition feel, day-card layout with large text, and screen-reader announcements. No frame-rate measurements or device visual validation performed. The Expo development server was not started.

## Assignment transition refinement - 2026-10-23

Reviewed the supplied screen recording and the planner render path. The earlier day loader still replaced the card body, and inserting the undo banner above the grid could shift the scroll layout.

- [x] Keep rest/workout content and action rows mounted during saves; use the status pill and assign button for inline pending feedback. Body spinners are reserved for the initial load.
- [x] Give rest and assigned content matching minimum space, and animate remaining card size/position changes over 180 ms with system reduced-motion support.
- [x] Move undo feedback to an overlay above the tab bar, outside scroll layout.
- [x] Replace the undersized assign action with a 176 px button, plus icon, centered 14 px label, and matching inline saving state. Retain 48 px minimum height and available-width constraints.
- [x] Extract the feature-owned day card for focused regression coverage. Component tests confirm that the assign button keeps its dimensions during saving and that existing workout/action content stays mounted.
- [x] TypeScript and ESLint passed; both day-card component tests and both planner hook tests passed. Animation timing and final appearance still require device review; no dev server was started.

This supersedes the earlier full-body per-day save spinner and 144 px assign-button treatment.

History filter fix: center labels vertically and horizontally, use consistent minimum chip widths and 48 px touch targets, increase filter type to the shared 12 px scale, and wrap all five options within the content width instead of clipping the last option in a horizontal rail. TypeScript and lint verification recorded for this change; device visual review remains pending.

History filter follow-up: user prefers a compact, single horizontal scrolling row. Removed wrapping while retaining centered labels, consistent minimum widths, and 48 px touch targets. This supersedes the wrapping choice above.


History status investigation: there is no current workout-skip action or repository write to skipped; Skip Rest only ends the rest timer. Planner assignments live in workout_plan_entries and create an in_progress session on start. Removed unconditional Scheduled/Skipped history filters; they now appear only when saved sessions contain those statuses. Keep database status compatibility and all historical records accessible. Added coverage for current filters and older-record discovery.


## Development data reset and obsolete session status removal

User authorized clearing all old local records because the app is still in development. Database version 6 now replaces versions 1-5 with a clean schema in one transaction, dropping known tables in child-first order and reseeding the default profile/categories. This deletes previous local profiles/preferences, exercises, workouts, assignments, session history, and measurements on the next initialization. Current-version databases keep new data on subsequent launches. Initialization serializes concurrent migrations per database connection; failures roll back the rebuild.

Removed scheduled/skipped session statuses from TypeScript and SQLite constraints, the repository option for creating scheduled sessions, and history compatibility filters/tests. Sessions now start in_progress and finish completed. Planned dates and rest-timer skipping remain current functionality. Historical migration branches were replaced by the pre-release reset baseline. This supersedes the previous compatibility-preservation decision.

Verification: TypeScript and ESLint passed; all 24 Jest suites / 94 tests passed, including resets from versions 1-5 and retention after the reset. An in-memory SQLite check verified schema creation, obsolete-status rejection, and child-first reset/recreation. Device storage was not directly accessed: cleanup takes effect when the updated app initializes its database. This pass covers the obsolete session lifecycle and stored development data, not an assertion that every legacy module elsewhere has been removed.


## Legacy-code audit and removal

Scope: repository code, navigation, database schema/repositories, feature drafts/view models, theme scaffolding, and retired UI. The app is pre-release and the user authorized discarding old data, so no record-preserving compatibility is needed.

Removed:

- Recurring weekday schedules from schema/indexes, repository inputs/queries, demo seeds, workout drafts, summary types, and unused editor/library/detail styles.
- Planner schedule import UI, selection state, load/save actions, import repositories, settings table, and tests that exercised the retired import.
- Unused getTodayRoutine fallback/rotation logic; Today now relies exclusively on dated plan entries. Replaced the seedStarterRoutineIfEmpty alias with seedDemoRoutinesIfEmpty.
- Obsolete metre profile type/test fixtures and migration-specific test SQL; stored distance preferences are km/mi, while canonical exercise distances remain metres.
- Unused per-target repository update API; snapshot tests now edit workouts through the current whole-draft update path.
- Duplicate light/dark color maps, unused old palette ramps, system-color-scheme hooks, the theme wrapper, and unused light/dark override props. Shared text and screen shells consume the current dark semantic tokens directly.
- Retired Profile launch card, hand-drawn icon/header styles, Today calendar-strip fields and helper, obsolete loading/import styles, and the routines icon alias.
- Temporary Figma capture-script injection in the route layout and an unused database-cache reset export.

The schema is version 7. Older development databases are rebuilt and the two retired tables are dropped, never recreated. Their names intentionally remain only in the reset drop list and cleanup tests. Current workout/session history, date planning, ad-hoc workout starts, rest skipping, demo definitions, native/web behavior, and unit conversion functions remain active features. Internal routines module/table names remain the current workout-definition domain specified in folderStructure.md; they are not a second routing or scheduling system.

Documentation updated in folderStructure.md and README.md. Repository searches found no active legacy schedule/import APIs, old unit fixtures, old theme hooks, or retired routes. Initial verification: TypeScript and ESLint passed; all 24 Jest suites / 93 tests passed. Web production export passed to dist/legacy-cleanup. A real in-memory SQLite check rebuilt the staged previous schema, confirmed removal of retired tables, and passed foreign_key_check. Device visual interaction remains unverified; no Expo dev server was started.

Final cleanup verification: TypeScript, ESLint, and all 24 suites / 93 tests passed after removal of the temporary capture script and unused cache export.


## Profile appearance preference

User direction supersedes the earlier dark-only decision: retain real Light and Dark themes and default to System. Profile > Appearance now offers all three choices, applies a selection immediately, and saves it independently to users.theme_preference so ordinary profile saves cannot overwrite it. System follows live device/browser changes; explicit selections override them. Failed saves restore the previous preference with retry feedback.

- [x] Add a genuine light wellness palette and keep the established dark palette; validate primary/secondary/muted/action/error text pairs at 4.5:1 or better in both.
- [x] Convert static color-bearing style definitions and consumers to active-theme hooks. Already mounted tabs, cards, forms, planner sheets, charts, headers, and controls update without resetting their feature state.
- [x] Derive navigation theme, native tab colors, status-bar text, keyboard appearance, system background, web color-scheme, and keyboard focus color from the same resolved theme.
- [x] Adapt the login photo overlay and control surfaces for readable light mode. Hold the native splash while loading the saved preference; configure native splash backgrounds for light/dark system appearance.
- [x] Store the preference in the profile with a constrained System default. Schema version 8 follows the existing pre-release reset policy: databases below version 8 are cleared/recreated once; new records and appearance choices then persist.
- [x] Verify live System changes, explicit override, relaunch persistence, automatic style updates, failure rollback, profile-save independence, default values, and palette contrast.
- [x] TypeScript, ESLint, and all 26 Jest suites / 101 tests passed. Web production export passed to dist/appearance-preview. In-memory SQLite verified preference defaults, all three saved choices, and rejection of invalid values; git diff --check passed.
- [ ] Native/browser visual QA remains manual. Rebuild the development client for the changed native splash configuration. No fonts were changed and no Expo development server was started.

Architecture and design documentation now describe the real appearance system. This supersedes the previous removal of duplicate, nonfunctional light/dark maps; both new palettes are distinct and reactive.


Expo color-themes guide verification: re-read https://docs.expo.dev/develop/user-interface/color-themes/ and compared it to the implementation. Confirmed automatic userInterfaceStyle, installed expo-system-ui, and React Native useColorScheme as the live System-mode source. Ran pnpm exec expo config --type introspect: generated iOS UIUserInterfaceStyle is Automatic; Android MainActivity handles uiMode and AppTheme inherits Theme.AppCompat.DayNight.NoActionBar. Persisted user overrides and theme-aware styles extend the guide's minimal example. This verifies source/native configuration, not physical-device behavior.


## Profile redesign - 2026-10-24

Applied the UI UX Designer all-in-one and redesign workflows to the existing native/web Profile screen. Goal: make personal details, saved units, automatically saved appearance, and security understandable in a wellness app. Kept the existing semantic palettes, Montserrat/Inter roles, 8 px radii, 8 px spacing rhythm, and feature ownership.

| Before | Implemented change | Reason |
|---|---|---|
| Appearance controls and profile fields looked like one continuous form | Separate Appearance, Personal details, Body measurements, Training units, and Privacy & security sections | Scan to the relevant preference and understand which actions save automatically |
| Three plain theme labels | Equal preview tiles with radio semantics, selected check, icons, current System preview, and saving/error feedback | Make the choice visible and understandable in either theme |
| Repeated orange uppercase labels and nested controls squeezing input space | Sentence-case labels, recessed full-width inputs, neutral text, optional markers, clear focus borders, and units beside the label | Improve reading and text entry at phone sizes |
| One narrow layout at every width | Shared 800 px content bound and paired fields on wider screens; stack fields with larger system text | Improve use of space without crowding compact layouts |
| Save always active; progress text separated from its action | Dirty-state-aware Save changes with inline pending/success/error state and duplicate-write protection | Make save intent and outcome clear |
| Focus reload could overwrite an unfinished draft | Preserve unsaved edits on refocus and ignore stale reads after edits | Avoid losing form work |
| Blank editable fields during loading | Local details loading/retry state; disable editing during saves | Prevent overwritten input and conflicting writes |
| Heavy security action and implementation-focused wording | Compact outlined Lock app action and plain device/browser-specific explanation | Keep security accessible without competing with the primary save action |

Appearance remains saved independently from profile details. Changing weight explains that a changed value adds a measurement. Height feet/inches guidance and canonical unit conversions remain intact. No schema, font embedding, or top-level navigation changes were needed.

Verification: TypeScript and ESLint passed; all 27 Jest suites / 105 tests passed. Added hook coverage for clean/dirty state, refocus preservation, single pending writes, failure retry, and initial-load recovery. Web production export passed to dist/profile-ui-preview. A responsive single-file visual prototype is available at dist/profile-redesign/profile-preview.html (design preview, not the running native screen). Browser screenshot capture was unavailable under sandbox permissions. Device appearance, native text scaling, keyboard behavior, and screen-reader interaction still need manual review. No Expo development server was started.

Profile ordering follow-up: moved Appearance directly above Privacy & security, after the profile details and save action, as requested.

## Exercise flow refresh - 2026-10-29

Improved the core training journey while preserving the current light/dark palettes, embedded fonts, native navigation, and feature ownership. Reviewed the Expo SDK 56 reference before implementation.

| Area | Implemented change |
|---|---|
| Shared header | Consistent Calfit identity, compact brand mark, and a clearly separated profile action. |
| Today | One prominent start/resume/summary action, useful rest-day and retry states, completed-workout count, and direct access to history and measurements. An active session remains resumable even when today's separate plan is completed or inactive. Completed sessions keep their summary after the workout definition is archived. |
| Workout library | Search by name/description, Strength/Cardio filters, resettable no-results state, full-card navigation, and clearer metadata. |
| Workout details | Compact overview, explicit recovery for empty/inactive workouts, active-session guidance, and numbered expandable exercise targets. |
| Weekly plan | Previous/next-week navigation with an expandable week picker, actual scheduled/completed/rest counts, quieter rest days, and roomier responsive cards. |
| Active workout | Combined timer/progress overview, explicit Log set controls, next-set emphasis, readable numeric inputs, sage completion, and rest controls outside the scroll area. Existing foreground and screen-wake behavior is preserved. |
| Progress | Training metrics and consistency precede optional body measurements; workout history is available near the heading. |

Validation: TypeScript passed; the full Jest suite passed 33 suites / 136 tests. After the final Today fixes, its 3 suites / 12 tests passed, including the newly added retry/refocus regression test. Source ESLint and diff checks passed. The production web export succeeded at `dist/ux-refresh-20261029`. Running ESLint over the entire repository reported only an existing unused-disable warning in generated `.expo/types/router.d.ts`.

No Expo development server was started. Verification covers source, behavior tests, and bundling; rendered device/browser appearance, large system text, keyboard behavior, and screen-reader interaction still need a manual pass.

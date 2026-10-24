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

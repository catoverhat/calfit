# UI/UX Page Audit

This checklist tracks the page-by-page Calfit interface review. A page is marked **Reviewed** only after its hierarchy, primary action, state handling, touch targets, responsiveness, accessibility, and visual consistency have been inspected. **Polished** means the resulting changes have also passed TypeScript, lint, and relevant tests.

The retired `/routines` and `/exercises` aliases have been removed. All workout and exercise management routes live below `/workouts`.

| # | Page / state | Route | Feature owner | Review status | Notes |
|---:|---|---|---|---|---|
| 1 | Login / app unlock | `/login` | Auth | Polished | Removed the misleading carousel indicator; retained one clear secure-entry action and device-auth feedback. |
| 2 | Today | `/` | Today | Polished | Standardized icons and surfaces, made the identity header open Profile, and improved workout-state accessibility. |
| 3 | Weekly planner | `/plan` | Plan | Polished | Added complete control labels/states and 48 px retry/undo targets across assignment, move, swap, and import flows. |
| 4 | Workout library | `/workouts` | Workouts | Polished | Added readable active/inactive status and enlarged Edit/View actions while preserving at-a-glance workout metrics. |
| 5 | Create workout | `/workouts/create` | Workouts | Polished | Corrected the route title, enlarged reorder/remove controls, and clarified disabled and add-set actions. |
| 6 | Workout details | `/workouts/[id]` | Workouts | Polished | Improved error recovery, edit/start semantics, and busy/disabled state announcements. |
| 7 | Edit workout | `/workouts/[id]/edit` | Workouts | Polished | Corrected the route title and aligned editor controls with the create flow and minimum touch target. |
| 8 | Add exercise to workout | `/workouts/add-exercise` | Workouts | Polished | Enlarged filters and made the footer action explicit and unavailable until exercises are selected. |
| 9 | Exercise catalog | `/workouts/exercises` | Exercises | Polished | Converted oversized cards to scannable rows and enlarged search, filter, and edit controls. |
| 10 | Create exercise | `/workouts/exercises/create` | Exercises | Polished | Added editable optional media URLs and enlarged categories and switch interaction areas. |
| 11 | Edit exercise | `/workouts/exercises/[id]/edit` | Exercises | Polished | Existing image/video values can now be edited; form control sizing and accessibility match create mode. |
| 12 | Active workout | `/workout-session/[id]` | Workout session | Polished | Added overall set progress plus visible and announced exercise expand/collapse state. |
| 13 | Progress dashboard | `/progress` | Progress | Polished | Strengthened page hierarchy, widened the responsive content area, and added a consistency legend and chart summary. |
| 14 | Workout history | `/progress/history` | Progress | Polished | Enlarged session filter chips to reliable 48 px touch targets. |
| 15 | Body measurements | `/progress/measurements` | Progress | Polished | Enlarged the history navigation target; reviewed form, chart, loading, and empty states. |
| 16 | Workout summary | `/progress/summary` | Progress | Reviewed | Completion hierarchy, stats, notes, history, and primary continuation action already follow the design system. |
| 17 | Local storage status | `/progress/storage` | Progress | Polished | Enlarged recovery action and reviewed clear ready/error/offline explanations. |
| 18 | Profile and preferences | `/profile` | Profile | Polished | Reframed onboarding copy as persistent preferences, removed decorative interruption, standardized icons, and enlarged unit controls. |

## Verification

- TypeScript: passed (`pnpm exec tsc --noEmit`).
- ESLint: passed (`pnpm lint`).
- Jest: 21 suites and 75 tests passed (`pnpm test -- --runInBand`).

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

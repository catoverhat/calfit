---
name: Kinetic Pulse
colors:
  surface: "#131313"
  surface-dim: "#131313"
  surface-bright: "#393939"
  surface-container-lowest: "#0e0e0e"
  surface-container-low: "#1c1b1b"
  surface-container: "#201f1f"
  surface-container-high: "#2a2a2a"
  surface-container-highest: "#353534"
  on-surface: "#e5e2e1"
  on-surface-variant: "#e3bfb3"
  inverse-surface: "#e5e2e1"
  inverse-on-surface: "#313030"
  outline: "#aa897f"
  outline-variant: "#5b4138"
  surface-tint: "#ffb59c"
  primary: "#ffb59c"
  on-primary: "#5c1900"
  primary-container: "#ff5f1f"
  on-primary-container: "#561700"
  inverse-primary: "#ab3600"
  secondary: "#c8c6c5"
  on-secondary: "#303030"
  secondary-container: "#474746"
  on-secondary-container: "#b6b5b4"
  tertiary: "#8dcdff"
  on-tertiary: "#00344f"
  tertiary-container: "#009de4"
  on-tertiary-container: "#00304a"
  error: "#ffb4ab"
  on-error: "#690005"
  error-container: "#93000a"
  on-error-container: "#ffdad6"
  primary-fixed: "#ffdbcf"
  primary-fixed-dim: "#ffb59c"
  on-primary-fixed: "#390c00"
  on-primary-fixed-variant: "#832700"
  secondary-fixed: "#e4e2e1"
  secondary-fixed-dim: "#c8c6c5"
  on-secondary-fixed: "#1b1c1c"
  on-secondary-fixed-variant: "#474746"
  tertiary-fixed: "#cae6ff"
  tertiary-fixed-dim: "#8dcdff"
  on-tertiary-fixed: "#001e30"
  on-tertiary-fixed-variant: "#004b70"
  background: "#131313"
  on-background: "#e5e2e1"
  surface-variant: "#353534"
typography:
  headline-lg:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: "700"
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: "700"
    lineHeight: 32px
  headline-sm:
    fontFamily: Montserrat
    fontSize: 20px
    fontWeight: "600"
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: "500"
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: "400"
    lineHeight: 24px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: "700"
    lineHeight: 20px
    letterSpacing: 0.05em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: "600"
    lineHeight: 16px
  data-display:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: "800"
    lineHeight: 48px
    letterSpacing: -0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 16px
---

## Brand & Style

The design system is engineered for high-performance workout tracking, prioritizing utility, focus, and physical intensity over social interaction. The aesthetic is "Technical Athleticism"—a blend of modern minimalism and high-contrast professional sports equipment.

The target audience is the dedicated athlete who requires a tool that feels as robust and disciplined as their training regimen. The UI evokes a sense of momentum and precision, using a dark-mode-first environment to reduce eye strain in gym lighting and allow the vibrant primary accent to guide the user's focus toward critical actions.

## Colors

The palette is rooted in a deep charcoal/onyx base to create a focused, immersive environment.

- **Primary (Electric Orange):** Reserved strictly for high-priority interactive elements like "Start Workout," "Log Set," or "Save." It represents energy and movement.
- **Background (#121212):** A solid, deep neutral that provides maximum contrast for data visualization.
- **Surface Container (#1E1E1E):** A slightly elevated charcoal used for cards and grouping elements, providing depth without relying on heavy shadows.
- **Text:** Primary data points use pure white for immediate legibility, while secondary metadata uses a muted grey to maintain visual hierarchy.

## Typography

This system uses a dual-font strategy to balance athletic impact with high-density utility. **Montserrat** is used for headlines and data to establish a bold character, while **Inter** is utilized for body text and labels to ensure maximum legibility for instructions and metadata.

- **Weight Strategy:** Use Bold (700) and ExtraBold (800) in Montserrat for numeric data and headers to emphasize strength. Inter Regular (400) and Medium (500) are reserved for instructional text and labels.
- **Data Display:** A specialized "data-display" role in Montserrat is used for active timers and weight totals, ensuring stats are readable from a distance during a workout.
- **Case:** Labels and category headers in Inter should use All-Caps with slight letter spacing to mimic the utilitarian look of technical apparel and gym equipment.

## Layout & Spacing

This design system utilizes an 8px rhythmic grid to ensure mathematical consistency.

- **Mobile-First Grid:** A fluid 4-column layout for mobile devices with 16px outer margins.
- **Touch Targets:** Minimum touch targets for interactive elements (buttons, set toggles) must be at least 48x48px to accommodate shaky or sweaty hands during exercise.
- **Vertical Rhythm:** Generous vertical spacing (24px+) between distinct exercise blocks to prevent visual clutter and accidental taps.

## Elevation & Depth

Elevation is achieved through tonal layering rather than heavy shadows, maintaining a clean and professional look.

- **Level 0 (Background):** #121212. Used for the main canvas.
- **Level 1 (Cards/Containers):** #1E1E1E. Used for exercise cards and list groupings.
- **Borders:** Instead of shadows, use 1px solid strokes (#2A2A2A) to define the edges of containers. This reinforces the "technical" feel of the interface.
- **Active State:** When an element is focused or "in-progress" (like an active set), use a thin Electric Orange border to signify the active state.

## Shapes

The design system employs a consistent "Rounded Eight" (8px) logic for standard UI components.

- **Standard Elements:** Buttons, cards, and input fields use a 0.5rem (8px) corner radius.
- **Icon Enclosures:** Use circular containers for status indicators or numerical icons to provide a visual counterpoint to the structured rectangular grid.
- **Progress Bars:** Use fully rounded (pill-shaped) ends for tracking bars to suggest fluid movement and completion.

## Components

- **Buttons:** Primary buttons are solid Electric Orange with black text for maximum contrast. Secondary buttons use a ghost style (orange outline, transparent fill).
- **Exercise Cards:** Use the Surface Container color with an 8px radius. Titles are bold white. Sub-text (reps/weight) uses the secondary text color.
- **Set Logger:** A row-based component with large, accessible input fields. Success states (set completed) should transform the row background to a subtle dark green tint or use a bold checkmark.
- **Progress Rings:** High-stroke circular indicators for rest timers, using Electric Orange for the active progress and the secondary neutral for the remaining track.
- **Inputs:** Numeric-first keyboards should be triggered by default for weight/rep entries. Input fields should have a dark, recessed background (#181818).
- **Chips:** Small, rounded-pill tags used for "Warm-up," "Drop Set," or "PR" (Personal Record) indicators. The PR chip should use a subtle gold or orange glow.

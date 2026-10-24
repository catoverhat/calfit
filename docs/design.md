---
name: Grounded Momentum
colors:
  surface: "#141918"
  surface-dim: "#141918"
  surface-bright: "#3C4743"
  surface-container-lowest: "#101513"
  surface-container-low: "#1A211E"
  surface-container: "#202925"
  surface-container-high: "#2B3631"
  surface-container-highest: "#35423B"
  on-surface: "#EDF2EC"
  on-surface-variant: "#C2CFC5"
  inverse-surface: "#EDF2EC"
  inverse-on-surface: "#29332D"
  outline: "#95A99D"
  outline-variant: "#71867A"
  surface-tint: "#FFBC99"
  primary: "#FFBC99"
  on-primary: "#42200E"
  primary-container: "#FF854D"
  on-primary-container: "#29180F"
  inverse-primary: "#A53F0F"
  secondary: "#C2CFC5"
  on-secondary: "#263B30"
  secondary-container: "#354B3E"
  on-secondary-container: "#A7B9AD"
  tertiary: "#8DD5CE"
  on-tertiary: "#103B37"
  tertiary-container: "#52B7AD"
  on-tertiary-container: "#102D29"
  error: "#FFB4AF"
  on-error: "#620E18"
  error-container: "#5C252B"
  on-error-container: "#FFDAD8"
  primary-fixed: "#FFDBC7"
  primary-fixed-dim: "#FFBC99"
  on-primary-fixed: "#341707"
  on-primary-fixed-variant: "#7C3616"
  secondary-fixed: "#D6EBDD"
  secondary-fixed-dim: "#C2CFC5"
  on-secondary-fixed: "#152B20"
  on-secondary-fixed-variant: "#354B3E"
  tertiary-fixed: "#B5EEE7"
  tertiary-fixed-dim: "#8DD5CE"
  on-tertiary-fixed: "#062B27"
  on-tertiary-fixed-variant: "#23534D"
  background: "#141918"
  on-background: "#EDF2EC"
  surface-variant: "#35423B"
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

Calfit is a wellness app supporting sustainable movement, training, and personal progress. The visual direction is grounded technical athleticism: clear data and dependable controls within a softer, nature-tinted dark environment. Color is an interface hierarchy, not a promise of psychological or health outcomes.

## Colors

The October 2026 wellness palette supersedes the earlier neutral-charcoal, neon-green, and blue accent combination. Dark mode remains the supported appearance; light-system settings deliberately use the same dark palette.

- **Electric Orange (#FF854D):** A softer orange reserved for primary actions and active navigation. Pair filled actions with deep brown #29180F, never white. Pale peach #FFBC99 supports text-only secondary actions.
- **Canvas (#141918), cards (#202925), elevated (#2B3631):** Low-chroma green-charcoal surfaces provide tonal depth without heavy shadows or large saturated fields.
- **Text (#EDF2EC / #C2CFC5 / #A7B9AD):** Off-white primary text and sage-neutral secondary/muted roles preserve hierarchy. Do not reduce placeholder opacity.
- **Sage (#9CCDAB):** Completion and recorded consistency, with #243C2D containers. Accompany status with words, icons, or counts.
- **Teal (#8DD5CE):** Information and keyboard focus. Distinct from orange actions; use #52B7AD with #102D29 for filled information elements.
- **Rose (#FFB4AF):** Errors and destructive meaning; pair with explicit labels and recovery guidance.
- **Sand (#E5C580):** Personal records and milestones; avoid using achievement color to imply a health assessment.
- **Borders:** #2B3631 is decorative grouping only. Controls requiring visible boundaries use #71867A. Focus uses teal, and selected states also expose labels or accessibility state.

Research, contrast measurements, implementation status, and remaining visual checks are tracked in [uiUxAudit.md](uiUxAudit.md).

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

- **Level 0 (Background):** #141918. Used for the main canvas.
- **Level 1 (Cards/Containers):** #202925. Used for exercise cards and list groupings.
- **Borders:** Instead of shadows, use 1px solid strokes (#2B3631) to define the edges of containers. This reinforces the "technical" feel of the interface.
- **Active State:** When an element is focused or "in-progress" (like an active set), use a thin Electric Orange border to signify the active state.

## Shapes

The design system employs a consistent "Rounded Eight" (8px) logic for standard UI components.

- **Standard Elements:** Buttons, cards, and input fields use a 0.5rem (8px) corner radius.
- **Icon Enclosures:** Use circular containers for status indicators or numerical icons to provide a visual counterpoint to the structured rectangular grid.
- **Progress Bars:** Use fully rounded (pill-shaped) ends for tracking bars to suggest fluid movement and completion.

## Components

- **Buttons:** Primary buttons are solid Electric Orange with deep brown text for maximum contrast. Secondary buttons use a ghost style (orange outline, pale peach text, transparent fill).
- **Navigation Buttons:** When a button navigates with Expo Router, compose it as `Link` -> `Pressable` -> `View` -> icon or label. Set `asChild` on `Link`, put accessibility props on `Pressable`, and apply the button's visual styles plus the render-prop `pressed` style to the inner `View`. This keeps linked buttons visually and behaviorally consistent across platforms:

  ```tsx
  <Link href="/workouts/create" asChild>
    <Pressable
      accessibilityLabel="Create routine"
      accessibilityRole="button"
    >
      {({ pressed }) => (
        <View style={[styles.createButton, pressed && styles.pressed]}>
          <AppIcon
            color={DesignColors.onPrimaryContainer}
            name="add"
            size={20}
          />
        </View>
      )}
    </Pressable>
  </Link>
  ```
- **Exercise Cards:** Use the Surface Container color with an 8px radius. Titles use bold off-white. Sub-text (reps/weight) uses the secondary text color.
- **Set Logger:** A row-based component with large, accessible input fields. Success states (set completed) should transform the row background to a subtle dark green tint or use a bold checkmark.
- **Progress Rings:** High-stroke circular indicators for rest timers, using Electric Orange for the active progress and the secondary neutral for the remaining track.
- **Inputs:** Numeric-first keyboards should be triggered by default for weight/rep entries. Input fields should have a dark, recessed background (#18201C).
- **Chips:** Small, rounded-pill tags used for "Warm-up," "Drop Set," or "PR" (Personal Record) indicators. The PR chip should use a subtle sand-tinted background.

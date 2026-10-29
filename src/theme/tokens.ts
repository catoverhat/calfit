import { Platform } from "react-native";

export const Fonts = {
  heading: Platform.select({
    ios: "Montserrat-SemiBold",
    default: "Montserrat_600SemiBold",
    web: "Montserrat_600SemiBold",
  }),
  headingBold: Platform.select({
    ios: "Montserrat-Bold",
    default: "Montserrat_700Bold",
    web: "Montserrat_700Bold",
  }),
  display: Platform.select({
    ios: "Montserrat-ExtraBold",
    default: "Montserrat_800ExtraBold",
    web: "Montserrat_800ExtraBold",
  }),
  headingRegular: Platform.select({
    ios: "Montserrat-Regular",
    default: "Montserrat_400Regular",
    web: "Montserrat_400Regular",
  }),
  body: Platform.select({
    ios: "Inter-Regular",
    default: "Inter_400Regular",
    web: "Inter_400Regular",
  }),
  bodyMedium: Platform.select({
    ios: "Inter-Medium",
    default: "Inter_500Medium",
    web: "Inter_500Medium",
  }),
  bodySemiBold: Platform.select({
    ios: "Inter-SemiBold",
    default: "Inter_600SemiBold",
    web: "Inter_600SemiBold",
  }),
  bodyBold: Platform.select({
    ios: "Inter-Bold",
    default: "Inter_700Bold",
    web: "Inter_700Bold",
  }),
  label: Platform.select({
    ios: "Inter-Medium",
    default: "Inter_500Medium",
    web: "Inter_500Medium",
  }),
  mono: Platform.select({
    ios: "ui-monospace",
    default: "monospace",
    web: "var(--font-mono)",
  }),
} as const;

export const Typography = {
  xs: { fontSize: 12, lineHeight: 16 },
  sm: { fontSize: 14, lineHeight: 20 },
  base: { fontSize: 16, lineHeight: 24 },
  lg: { fontSize: 18, lineHeight: 28 },
  xl: { fontSize: 20, lineHeight: 28 },
  "2xl": { fontSize: 24, lineHeight: 32 },
  "3xl": { fontSize: 30, lineHeight: 36 },
  "4xl": { fontSize: 36, lineHeight: 40 },
  "5xl": { fontSize: 48, lineHeight: 48 },
} as const;

export const TypeScale = {
  headlineLg: {
    fontFamily: Fonts.headingBold,
    fontSize: 32,
    fontWeight: "700",
    lineHeight: 40,
  },
  headlineMd: {
    fontFamily: Fonts.headingBold,
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 32,
  },
  headlineSm: {
    fontFamily: Fonts.heading,
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 28,
  },
  bodyLg: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 18,
    fontWeight: "500",
    lineHeight: 26,
  },
  bodyMd: {
    fontFamily: Fonts.body,
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
  },
  labelLg: {
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.7,
    lineHeight: 20,
    textTransform: "uppercase",
  },
  labelMd: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 16,
  },
  dataDisplay: {
    fontFamily: Fonts.display,
    fontSize: 48,
    fontWeight: "800",
    lineHeight: 48,
  },
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Space = {
  xs: 4,
  base: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  gutter: 16,
  marginMobile: 16,
} as const;

export const Radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  "2xl": 24,
  full: 9999,
} as const;

export const BorderWidth = {
  hairline: 1,
  active: 1,
} as const;

export const TouchTarget = {
  min: 48,
} as const;

export const Layout = {
  mobileColumns: 4,
  mobileMargin: Space.marginMobile,
  maxContentWidth: 800,
} as const;

export const MaxContentWidth = 800;

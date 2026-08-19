import { Platform } from 'react-native';

export const Palette = {
  primary: {
    50: '#FFF3EE',
    100: '#FFE4D9',
    200: '#FFC8B3',
    300: '#FFA583',
    400: '#FF7D52',
    500: '#FF5F1F',
    600: '#E9470D',
    700: '#C03608',
    800: '#992D0D',
    900: '#7B2910',
    950: '#431105',
  },
  secondary: {
    50: '#F6F7F8',
    100: '#EDEEF1',
    200: '#D8DBE0',
    300: '#B5BAC3',
    400: '#8E949F',
    500: '#686E79',
    600: '#505560',
    700: '#3D414A',
    800: '#282B32',
    900: '#1A1C23',
    950: '#0D0E12',
  },
  tertiary: {
    50: '#EAF8FE',
    100: '#D5F1FC',
    200: '#ACE4F8',
    300: '#74D2F3',
    400: '#35B9EC',
    500: '#009DE4',
    600: '#007EB8',
    700: '#006594',
    800: '#075477',
    900: '#0B4663',
    950: '#062D43',
  },
  neutral: {
    50: '#F8F9FA',
    100: '#EFF0F2',
    200: '#E0E2E5',
    300: '#C8CBD0',
    400: '#A5AAB1',
    500: '#858B93',
    600: '#686E75',
    700: '#51565C',
    800: '#363A3E',
    900: '#222529',
    950: '#111315',
  },
  white: '#FFFFFF',
  black: '#000000',
} as const;

export const DesignColors = {
  surface: '#131313',
  surfaceDim: '#131313',
  surfaceBright: '#393939',
  surfaceContainerLowest: '#0E0E0E',
  surfaceContainerLow: '#1C1B1B',
  surfaceContainer: '#201F1F',
  surfaceContainerHigh: '#2A2A2A',
  surfaceContainerHighest: '#353534',
  onSurface: '#E5E2E1',
  onSurfaceVariant: '#E3BFB3',
  inverseSurface: '#E5E2E1',
  inverseOnSurface: '#313030',
  outline: '#AA897F',
  outlineVariant: '#5B4138',
  surfaceTint: '#FFB59C',
  primary: '#FFB59C',
  onPrimary: '#5C1900',
  primaryContainer: '#FF5F1F',
  onPrimaryContainer: '#561700',
  inversePrimary: '#AB3600',
  secondary: '#C8C6C5',
  onSecondary: '#303030',
  secondaryContainer: '#474746',
  onSecondaryContainer: '#B6B5B4',
  tertiary: '#8DCDFF',
  onTertiary: '#00344F',
  tertiaryContainer: '#009DE4',
  onTertiaryContainer: '#00304A',
  error: '#FFB4AB',
  onError: '#690005',
  errorContainer: '#93000A',
  onErrorContainer: '#FFDAD6',
  primaryFixed: '#FFDBCF',
  primaryFixedDim: '#FFB59C',
  onPrimaryFixed: '#390C00',
  onPrimaryFixedVariant: '#832700',
  secondaryFixed: '#E4E2E1',
  secondaryFixedDim: '#C8C6C5',
  onSecondaryFixed: '#1B1C1C',
  onSecondaryFixedVariant: '#474746',
  tertiaryFixed: '#CAE6FF',
  tertiaryFixedDim: '#8DCDFF',
  onTertiaryFixed: '#001E30',
  onTertiaryFixedVariant: '#004B70',
  background: '#131313',
  onBackground: '#E5E2E1',
  surfaceVariant: '#353534',
  inputBackground: '#181818',
  success: '#2AD06F',
  successContainer: '#10261A',
  pr: '#F9B84A',
} as const;

export const SemanticColors = {
  canvas: DesignColors.background,
  card: DesignColors.surfaceContainer,
  cardElevated: DesignColors.surfaceContainerHigh,
  cardHighest: DesignColors.surfaceContainerHighest,
  recessed: DesignColors.inputBackground,
  textPrimary: DesignColors.onSurface,
  textSecondary: DesignColors.secondary,
  textMuted: DesignColors.onSecondaryContainer,
  action: DesignColors.primaryContainer,
  actionText: DesignColors.onPrimaryContainer,
  actionSoft: DesignColors.primary,
  border: DesignColors.surfaceContainerHigh,
  borderStrong: DesignColors.outlineVariant,
  active: DesignColors.primaryContainer,
  info: DesignColors.tertiary,
  danger: DesignColors.error,
  success: DesignColors.success,
} as const;

export const Colors = {
  light: {
    ...DesignColors,
    primary: SemanticColors.action,
    secondary: DesignColors.secondary,
    tertiary: DesignColors.tertiaryContainer,
    text: SemanticColors.textPrimary,
    textSecondary: SemanticColors.textSecondary,
    background: SemanticColors.canvas,
    backgroundElement: SemanticColors.card,
    backgroundSelected: DesignColors.outlineVariant,
    border: SemanticColors.border,
    onPrimary: DesignColors.onPrimaryContainer,
  },
  dark: {
    ...DesignColors,
    primary: SemanticColors.action,
    secondary: DesignColors.secondary,
    tertiary: DesignColors.tertiaryContainer,
    text: SemanticColors.textPrimary,
    textSecondary: SemanticColors.textSecondary,
    background: SemanticColors.canvas,
    backgroundElement: SemanticColors.card,
    backgroundSelected: DesignColors.outlineVariant,
    border: SemanticColors.border,
    onPrimary: DesignColors.onPrimaryContainer,
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = {
  heading: Platform.select({
    ios: 'Montserrat-SemiBold',
    default: 'Montserrat_600SemiBold',
    web: 'Montserrat_600SemiBold',
  }),
  headingRegular: Platform.select({
    ios: 'Montserrat-Regular',
    default: 'Montserrat_400Regular',
    web: 'Montserrat_400Regular',
  }),
  body: Platform.select({
    ios: 'Inter-Regular',
    default: 'Inter_400Regular',
    web: 'Inter_400Regular',
  }),
  bodyMedium: Platform.select({
    ios: 'Inter-Medium',
    default: 'Inter_500Medium',
    web: 'Inter_500Medium',
  }),
  bodySemiBold: Platform.select({
    ios: 'Inter-SemiBold',
    default: 'Inter_600SemiBold',
    web: 'Inter_600SemiBold',
  }),
  bodyBold: Platform.select({
    ios: 'Inter-Bold',
    default: 'Inter_700Bold',
    web: 'Inter_700Bold',
  }),
  label: Platform.select({
    ios: 'Inter-Medium',
    default: 'Inter_500Medium',
    web: 'Inter_500Medium',
  }),
  mono: Platform.select({ ios: 'ui-monospace', default: 'monospace', web: 'var(--font-mono)' }),
} as const;

export const Typography = {
  xs: { fontSize: 12, lineHeight: 16 },
  sm: { fontSize: 14, lineHeight: 20 },
  base: { fontSize: 16, lineHeight: 24 },
  lg: { fontSize: 18, lineHeight: 28 },
  xl: { fontSize: 20, lineHeight: 28 },
  '2xl': { fontSize: 24, lineHeight: 32 },
  '3xl': { fontSize: 30, lineHeight: 36 },
  '4xl': { fontSize: 36, lineHeight: 40 },
  '5xl': { fontSize: 48, lineHeight: 48 },
} as const;

export const TypeScale = {
  headlineLg: {
    fontFamily: Fonts.heading,
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
  },
  headlineMd: {
    fontFamily: Fonts.heading,
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
  },
  headlineSm: {
    fontFamily: Fonts.heading,
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  bodyLg: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 26,
  },
  bodyMd: {
    fontFamily: Fonts.body,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  labelLg: {
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.7,
    lineHeight: 20,
    textTransform: 'uppercase',
  },
  labelMd: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
  dataDisplay: {
    fontFamily: Fonts.heading,
    fontSize: 48,
    fontWeight: '800',
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
  '2xl': 24,
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

export const ComponentTokens = {
  button: {
    primaryBackground: SemanticColors.action,
    primaryText: DesignColors.onPrimaryContainer,
    secondaryBorder: SemanticColors.action,
    secondaryText: SemanticColors.actionSoft,
    minHeight: TouchTarget.min,
    radius: Radius.md,
  },
  card: {
    background: SemanticColors.card,
    borderColor: SemanticColors.border,
    borderWidth: BorderWidth.hairline,
    radius: Radius.md,
  },
  input: {
    background: SemanticColors.recessed,
    borderColor: SemanticColors.border,
    borderWidth: BorderWidth.hairline,
    minHeight: TouchTarget.min,
    radius: Radius.md,
    selectionColor: SemanticColors.action,
  },
  progress: {
    activeTrack: SemanticColors.action,
    inactiveTrack: DesignColors.secondaryContainer,
    radius: Radius.full,
  },
  chip: {
    background: DesignColors.surfaceContainerHigh,
    prBackground: 'rgba(249, 184, 74, 0.14)',
    prText: DesignColors.pr,
    radius: Radius.full,
  },
} as const;

export const MaxContentWidth = 800;

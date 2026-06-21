import '@/global.css';

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

export const Colors = {
  light: {
    primary: Palette.primary[500],
    secondary: Palette.secondary[900],
    tertiary: Palette.tertiary[500],
    text: Palette.secondary[900],
    textSecondary: Palette.secondary[600],
    background: Palette.neutral[50],
    backgroundElement: Palette.white,
    backgroundSelected: Palette.primary[100],
    border: Palette.neutral[200],
    onPrimary: Palette.white,
  },
  dark: {
    primary: Palette.primary[500],
    secondary: Palette.secondary[900],
    tertiary: Palette.tertiary[400],
    text: Palette.neutral[50],
    textSecondary: Palette.neutral[300],
    background: Palette.secondary[900],
    backgroundElement: Palette.secondary[800],
    backgroundSelected: Palette.primary[950],
    border: Palette.secondary[700],
    onPrimary: Palette.white,
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = {
  heading: 'Montserrat_600SemiBold',
  headingRegular: 'Montserrat_400Regular',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemiBold: 'Inter_600SemiBold',
  bodyBold: 'Inter_700Bold',
  label: 'Inter_500Medium',
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

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

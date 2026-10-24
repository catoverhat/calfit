import type { ThemePreference } from '@/db/types';
import type { AppColorScheme } from './palettes';

export function resolveColorScheme(preference: ThemePreference, system: string | null | undefined): AppColorScheme {
  return preference === 'system' ? system === 'dark' ? 'dark' : 'light' : preference;
}

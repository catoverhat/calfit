import { DarkTheme, DefaultTheme } from 'expo-router';

import type { AppTheme } from './palettes';

export function createNavigationTheme({ scheme, SemanticColors }: AppTheme) {
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      background: SemanticColors.canvas,
      border: SemanticColors.border,
      card: SemanticColors.card,
      primary: SemanticColors.action,
      text: SemanticColors.textPrimary,
    },
  };
}

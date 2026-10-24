import { DarkTheme } from 'expo-router';

import { SemanticColors } from './tokens';

export const AppNavigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: SemanticColors.canvas,
    border: SemanticColors.border,
    card: SemanticColors.card,
    primary: SemanticColors.action,
    text: SemanticColors.textPrimary,
  },
};

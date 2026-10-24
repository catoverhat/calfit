import { useMemo } from 'react';

import { useAppTheme } from './app-theme-provider';
import type { AppTheme } from './palettes';

export function createThemedStyles<Styles>(factory: (theme: AppTheme) => Styles) {
  return function useThemedStyles() {
    const theme = useAppTheme();
    return useMemo(() => factory(theme), [theme]);
  };
}

import React from 'react';
import * as Native from 'react-native';

import { saveThemePreference, type ThemePreference } from '@/db';
import { AppThemeProvider, useAppTheme, useAppearancePreference } from './app-theme-provider';
import { createThemedStyles } from './create-themed-styles';
import { AppThemes } from './palettes';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { act, create } = require('react-test-renderer');

let mockStoredPreference: ThemePreference = 'system';
jest.mock('@/db', () => ({
  initializeLocalDatabase: jest.fn().mockResolvedValue({}),
  getLocalUserProfile: jest.fn(async () => ({ theme_preference: mockStoredPreference })),
  saveThemePreference: jest.fn(async (_db, value) => { mockStoredPreference = value; }),
}));
jest.mock('expo-system-ui', () => ({ setBackgroundColorAsync: jest.fn().mockResolvedValue(undefined) }));
jest.mock('expo-splash-screen', () => ({ hide: jest.fn() }));

let observed: ReturnType<typeof useAppearancePreference>;
let scheme: string;
let background: string;
const useStyles = createThemedStyles(({ SemanticColors }) => ({ backgroundColor: SemanticColors.canvas }));

function Probe() {
  const value = useAppearancePreference();
  const theme = useAppTheme();
  const styles = useStyles();
  React.useEffect(() => {
    observed = value;
    scheme = theme.scheme;
    background = styles.backgroundColor;
  });
  return null;
}

beforeEach(() => {
  mockStoredPreference = 'system';
  jest.clearAllMocks();
  (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
});
afterEach(() => { jest.restoreAllMocks(); });

test('system follows live device changes; explicit choices persist and restore after relaunch', async () => {
  const system = jest.spyOn(Native, 'useColorScheme').mockReturnValue('light');
  let root: ReturnType<typeof create>;
  await act(async () => { root = create(<AppThemeProvider><Probe /></AppThemeProvider>); });
  expect(observed.preference).toBe('system');
  expect(scheme).toBe('light');
  expect(background).toBe(AppThemes.light.SemanticColors.canvas);

  system.mockReturnValue('dark');
  await act(async () => { root.update(<AppThemeProvider><Probe /></AppThemeProvider>); });
  expect(scheme).toBe('dark');

  await act(async () => { await observed.setPreference('light'); });
  expect(scheme).toBe('light');
  expect(mockStoredPreference).toBe('light');
  expect(background).toBe(AppThemes.light.SemanticColors.canvas);
  await act(async () => { root.unmount(); });
  await act(async () => { root = create(<AppThemeProvider><Probe /></AppThemeProvider>); });
  expect(observed.preference).toBe('light');
  expect(scheme).toBe('light');

  await act(async () => { await observed.setPreference('system'); });
  expect(scheme).toBe('dark');
  expect(mockStoredPreference).toBe('system');
  await act(async () => { root.unmount(); });
});

test('failed preference saves restore the previous appearance and expose recovery feedback', async () => {
  jest.spyOn(Native, 'useColorScheme').mockReturnValue('light');
  let root: ReturnType<typeof create>;
  await act(async () => { root = create(<AppThemeProvider><Probe /></AppThemeProvider>); });
  jest.mocked(saveThemePreference).mockRejectedValueOnce(new Error('Storage failed'));
  await act(async () => { await observed.setPreference('dark'); });
  expect(observed.preference).toBe('system');
  expect(scheme).toBe('light');
  expect(observed.error).toContain('could not be saved');
  expect(observed.isSaving).toBe(false);
  expect(mockStoredPreference).toBe('system');
  await act(async () => { root.unmount(); });
});

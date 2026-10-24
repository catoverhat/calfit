import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { ActivityIndicator, Platform, useColorScheme, View } from 'react-native';

import { getLocalUserProfile, initializeLocalDatabase, saveThemePreference, type ThemePreference } from '@/db';
import { resolveColorScheme } from './appearance';
import { createNavigationTheme } from './navigation-theme';
import { AppThemes } from './palettes';

const ThemeContext = createContext(AppThemes.dark);
const PreferenceContext = createContext<{
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => Promise<void>;
  isSaving: boolean;
  error: string | null;
} | null>(null);

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme();
  const [preference, setStoredPreference] = useState<ThemePreference>('system');
  const [ready, setReady] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const saving = useRef(false);
  const scheme = resolveColorScheme(preference, system);
  const theme = AppThemes[scheme];
  const navigationTheme = useMemo(() => createNavigationTheme(theme), [theme]);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const db = await initializeLocalDatabase();
        const user = await getLocalUserProfile(db);
        if (active) setStoredPreference(user.theme_preference);
      } catch {
        if (active) setError('Appearance could not be loaded. Using the system setting.');
      } finally {
        if (active) setReady(true);
      }
    }
    void load();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      void SystemUI.setBackgroundColorAsync(theme.SemanticColors.canvas).catch(() => {});
    }
    if (typeof document !== 'undefined') {
      document.documentElement.style.colorScheme = scheme;
      document.documentElement.style.setProperty('--color-focus', theme.SemanticColors.focus);
      document.documentElement.style.backgroundColor = theme.SemanticColors.canvas;
    }
  }, [scheme, theme]);

  useEffect(() => {
    if (ready && Platform.OS !== 'web') SplashScreen.hide();
  }, [ready]);

  const setPreference = useCallback(async (next: ThemePreference) => {
    if (saving.current || next === preference) return;
    saving.current = true;
    const previous = preference;
    setStoredPreference(next);
    setIsSaving(true);
    setError(null);
    try {
      const db = await initializeLocalDatabase();
      await saveThemePreference(db, next);
    } catch {
      setStoredPreference(previous);
      setError('Appearance could not be saved. Please try again.');
    } finally {
      saving.current = false;
      setIsSaving(false);
    }
  }, [preference]);

  return (
    <ThemeContext.Provider value={theme}>
      <PreferenceContext.Provider value={{ preference, setPreference, isSaving, error }}>
        <ThemeProvider value={navigationTheme}>
          <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
          {ready ? children : (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.SemanticColors.canvas }}>
              <ActivityIndicator accessibilityLabel="Loading preferences" color={theme.SemanticColors.action} />
            </View>
          )}
        </ThemeProvider>
      </PreferenceContext.Provider>
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  return useContext(ThemeContext);
}

export function useAppearancePreference() {
  const preference = useContext(PreferenceContext);
  if (!preference) throw new Error('Appearance preferences require AppThemeProvider.');
  return preference;
}

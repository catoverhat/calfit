import Storage from "expo-sqlite/kv-store";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "calfit.keep-screen-awake-during-workouts";
const WorkoutPreferencesContext = createContext<{
  keepScreenAwake: boolean;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  setKeepScreenAwake: (enabled: boolean) => Promise<void>;
} | null>(null);

// Public preference boundary shared by Profile and the workout screen.
export function WorkoutPreferencesProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [keepScreenAwake, setEnabled] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [isSaving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const saving = useRef(false);

  useEffect(() => {
    let mounted = true;
    void Storage.getItemAsync(STORAGE_KEY)
      .then((value) => {
        if (mounted) setEnabled(value === "true");
      })
      .catch(() => {
        if (mounted)
          setError(
            "Screen preference could not be loaded. Screen timeout is enabled. Choose a setting to try saving again.",
          );
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  async function setKeepScreenAwake(enabled: boolean) {
    if (isLoading || saving.current) return;
    saving.current = true;
    setSaving(true);
    setError(null);
    try {
      await Storage.setItemAsync(STORAGE_KEY, String(enabled));
      setEnabled(enabled);
    } catch {
      setError("Screen preference could not be saved. Please try again.");
    } finally {
      saving.current = false;
      setSaving(false);
    }
  }

  return (
    <WorkoutPreferencesContext.Provider
      value={{
        keepScreenAwake,
        isLoading,
        isSaving,
        error,
        setKeepScreenAwake,
      }}
    >
      {children}
    </WorkoutPreferencesContext.Provider>
  );
}

export function useWorkoutPreferences() {
  const value = useContext(WorkoutPreferencesContext);
  if (!value)
    throw new Error("Workout preferences require WorkoutPreferencesProvider.");
  return value;
}

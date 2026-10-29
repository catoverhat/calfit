import { useFocusEffect } from "expo-router";
import { useCallback, useState, useSyncExternalStore } from "react";
import { AppState } from "react-native";

function subscribeToAppState(onChange: () => void) {
  const subscription = AppState.addEventListener("change", onChange);
  return () => subscription?.remove();
}

const getForeground = () => AppState.currentState === "active";
const getServerForeground = () => false;

export function useWorkoutForeground() {
  const [focused, setFocused] = useState(false);
  const foreground = useSyncExternalStore(
    subscribeToAppState,
    getForeground,
    getServerForeground,
  );

  useFocusEffect(
    useCallback(() => {
      setFocused(true);
      return () => setFocused(false);
    }, []),
  );

  return focused && foreground;
}

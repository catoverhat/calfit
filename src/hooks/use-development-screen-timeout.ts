import { deactivateKeepAwake, ExpoKeepAwakeTag } from "expo-keep-awake";
import { useEffect } from "react";

export function useDevelopmentScreenTimeout() {
  useEffect(() => {
    if (!__DEV__) return;
    // Expo's outer development wrapper acquires this tag in its mount effect.
    // Release it on the next turn, after all mount effects have run, so development
    // follows the same timeout policy as production. Workout locks use other tags.
    const timeout = setTimeout(() => {
      void deactivateKeepAwake(ExpoKeepAwakeTag).catch(() => {});
    }, 0);
    return () => clearTimeout(timeout);
  }, []);
}

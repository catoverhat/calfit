import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import { useEffect, useId, useRef } from "react";

export function useWorkoutScreenAwake(enabled: boolean) {
  const tag = useId();
  const generation = useRef(0);
  useEffect(() => {
    if (!enabled) return;
    const lockTag = `${tag}-${++generation.current}`;
    let disposed = false;
    const release = () => {
      void deactivateKeepAwake(lockTag).catch(() => {});
    };
    void activateKeepAwakeAsync(lockTag)
      .then(() => {
        // Activation can finish after a blur, background event, or unmount.
        if (disposed) release();
      })
      .catch(() => {
        // Unsupported browsers or a denied wake lock retain normal device timeout.
      });
    return () => {
      disposed = true;
      release();
    };
  }, [enabled, tag]);
}

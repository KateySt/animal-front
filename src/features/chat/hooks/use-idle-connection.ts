import { useCallback, useEffect, useRef, useState } from "react";

export const IDLE_DISCONNECT_MS = 60_000;

export function useIdleConnection(fetchToken: () => Promise<void>) {
  const [shouldConnect, setShouldConnect] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pausedRef = useRef(false);
  const wakingRef = useRef<Promise<void> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  const markActive = useCallback(() => {
    clearTimer();
    if (pausedRef.current) return;
    timerRef.current = setTimeout(() => setShouldConnect(false), IDLE_DISCONNECT_MS);
  }, [clearTimer]);

  const setPaused = useCallback(
    (paused: boolean) => {
      pausedRef.current = paused;
      markActive();
    },
    [markActive],
  );

  const wake = useCallback((): Promise<void> => {
    if (shouldConnect) return Promise.resolve();
    wakingRef.current ??= fetchToken()
      .then(() => setShouldConnect(true))
      .finally(() => {
        wakingRef.current = null;
      });
    return wakingRef.current;
  }, [shouldConnect, fetchToken]);

  useEffect(() => {
    if (shouldConnect) markActive();
    return clearTimer;
  }, [shouldConnect, markActive, clearTimer]);

  return { shouldConnect, markActive, setPaused, wake };
}

export type IdleConnection = ReturnType<typeof useIdleConnection>;

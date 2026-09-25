import { useEffect, useRef } from "react";

const DEFAULT_DELAY_MS = 2500;

export function useTimeout(callback: () => void, when: boolean, delay: number = DEFAULT_DELAY_MS): void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (!when) return;
    const timeoutId = setTimeout(() => callbackRef.current(), delay);
    return () => clearTimeout(timeoutId);
  }, [when, delay]);
}

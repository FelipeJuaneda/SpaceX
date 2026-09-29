import { useEffect, useState } from "react";

/** Current time, re-rendering every `interval` ms while enabled. */
export function useNow(interval = 1000, enabled = true): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!enabled) return;
    const id = window.setInterval(() => setNow(Date.now()), interval);
    return () => window.clearInterval(id);
  }, [interval, enabled]);
  return now;
}

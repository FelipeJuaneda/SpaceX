import { useEffect, useRef } from "react";
import { useLocation } from "react-router";

/**
 * After client-side navigation, move focus to <main> so keyboard and screen-reader
 * users start at the new page instead of the link they just activated.
 */
export function RouteFocus() {
  const { pathname } = useLocation();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    document.getElementById("main")?.focus({ preventScroll: true });
  }, [pathname]);
  return null;
}

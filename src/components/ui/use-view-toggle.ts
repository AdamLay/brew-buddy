import { useCallback, useEffect, useState } from "react";

export type ViewMode = "table" | "cards";

const STORAGE_KEY = "brew-buddy-view-mode";

export function useViewMode(entity: string): [ViewMode, () => void] {
  const storageKey = `${STORAGE_KEY}-${entity}`;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const smBreakpoint = getComputedStyle(document.documentElement).getPropertyValue(
      "--breakpoint-md",
    );
    const mql = window.matchMedia(`(max-width: ${smBreakpoint})`);
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };
    // Listen for changes
    (mql as any).addEventListener("change", handler);

    return () => {
      try {
        mql.removeEventListener("change", handler);
      } catch {
        /* noop */
      }
    };
  }, []);

  const [mode, setMode] = useState<ViewMode>(() => {
    try {
      return (localStorage.getItem(storageKey) as ViewMode) || "table";
    } catch {
      return "table";
    }
  });

  // Force cards view on mobile — table doesn't work at narrow widths
  const effectiveMode = isMobile && mode === "table" ? "cards" : mode;

  const toggle = useCallback(() => {
    setMode((prev) => {
      const next = prev === "table" ? "cards" : "table";
      try {
        localStorage.setItem(storageKey, next);
      } catch {
        /* noop */
      }
      return next;
    });
  }, [storageKey]);

  return [effectiveMode, toggle];
}

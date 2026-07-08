import { useState, useCallback } from "react";

export type ViewMode = "table" | "cards";

const STORAGE_KEY = "brew-buddy-view-mode";

export function useViewMode(entity: string): [ViewMode, () => void] {
  const storageKey = `${STORAGE_KEY}-${entity}`;
  const [mode, setMode] = useState<ViewMode>(() => {
    try {
      return (localStorage.getItem(storageKey) as ViewMode) || "table";
    } catch {
      return "table";
    }
  });

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

  return [mode, toggle];
}

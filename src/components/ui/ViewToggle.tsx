import { LayoutGrid, List } from "lucide-react";
import type { ViewMode } from "./use-view-toggle";

export function ViewToggle({ mode, onToggle }: { mode: ViewMode; onToggle: () => void }) {
  return (
    <div className="join hidden md:block">
      <button
        className={`btn btn-sm join-item  ${mode === "table" ? "btn-accent" : "btn-ghost"}`}
        onClick={onToggle}
        aria-label="Table view"
        title="Table view"
      >
        <List className="w-4 h-4" />
      </button>
      <button
        className={`btn btn-sm join-item ${mode === "cards" ? "btn-accent" : "btn-ghost"}`}
        onClick={onToggle}
        aria-label="Card view"
        title="Card view"
      >
        <LayoutGrid className="w-4 h-4" />
      </button>
    </div>
  );
}

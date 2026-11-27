"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "contexo.categoryView";

type ViewMode = "grid" | "list";

function readStoredView(): ViewMode {
  if (typeof window === "undefined") {
    return "grid";
  }
  const value = window.localStorage.getItem(STORAGE_KEY);
  return value === "list" ? "list" : "grid";
}

export function CategoryViewToggle() {
  const [view, setView] = useState<ViewMode>("grid");

  useEffect(() => {
    setView(readStoredView());
  }, []);

  function selectView(next: ViewMode) {
    setView(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }

  return (
    <div
      className="inline-flex rounded-md border border-border bg-surface p-0.5"
      role="group"
      aria-label="Category view"
    >
      {(["grid", "list"] as const).map((mode) => (
        <button
          key={mode}
          type="button"
          onClick={() => selectView(mode)}
          className={`rounded px-3 py-1.5 text-xs font-medium capitalize ${
            view === mode ? "bg-accent text-white" : "text-muted hover:text-foreground"
          }`}
          aria-pressed={view === mode}
        >
          {mode}
        </button>
      ))}
    </div>
  );
}

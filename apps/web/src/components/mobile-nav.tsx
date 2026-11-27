"use client";

import { useState } from "react";

import { Sidebar } from "@/components/sidebar";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="flex items-center gap-3 border-b border-border bg-surface px-4 py-3 md:hidden">
        <button
          type="button"
          className="rounded-md border border-border px-3 py-1.5 text-sm text-foreground"
          onClick={() => setOpen(true)}
        >
          Menu
        </button>
        <span className="text-sm font-semibold">Contexo</span>
      </header>

      {open ? (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/30"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 h-full shadow-lg">
            <Sidebar />
          </div>
        </div>
      ) : null}
    </>
  );
}

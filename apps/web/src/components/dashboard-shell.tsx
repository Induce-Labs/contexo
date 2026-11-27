import { Suspense } from "react";

import { MobileNav } from "@/components/mobile-nav";
import { Sidebar } from "@/components/sidebar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 bg-background">
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <MobileNav />
        <main className="flex-1 px-6 py-6 md:px-8">
          <Suspense fallback={<div className="text-sm text-muted">Loading…</div>}>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
}

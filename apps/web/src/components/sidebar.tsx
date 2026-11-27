"use client";

import Link from "next/link";
import { Suspense } from "react";

import { SidebarNav, SidebarNavFallback } from "@/components/sidebar-nav";
import { SignOutButton } from "@/components/sign-out-button";

export function Sidebar() {
  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-border bg-sidebar">
      <div className="border-b border-border px-5 py-5">
        <Link href="/categories" className="text-lg font-semibold tracking-tight text-foreground">
          Contexo
        </Link>
      </div>
      <Suspense fallback={<SidebarNavFallback />}>
        <SidebarNav />
      </Suspense>
      <div className="mt-auto border-t border-border p-3">
        <SignOutButton />
      </div>
    </aside>
  );
}

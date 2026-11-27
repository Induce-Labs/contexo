"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/categories", label: "Categories" },
  { href: "/recents", label: "Recents" },
  { href: "/connections", label: "Connections" },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === "/categories") {
    return pathname === "/" || pathname === "/categories" || pathname.startsWith("/categories/");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Main">
      {NAV_ITEMS.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              active
                ? "bg-accent-soft text-accent"
                : "text-muted hover:bg-white/70 hover:text-foreground"
            }`}
            aria-current={active ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function SidebarNavFallback() {
  return (
    <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Main">
      {NAV_ITEMS.map((item) => (
        <span
          key={item.href}
          className="rounded-md px-3 py-2 text-sm font-medium text-muted"
        >
          {item.label}
        </span>
      ))}
    </nav>
  );
}

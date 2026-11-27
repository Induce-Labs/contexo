import Link from "next/link";

import { CATEGORIES } from "@/lib/categories";

export default function CategoriesPage() {
  return (
    <div className="mx-auto w-full max-w-5xl">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Categories</h1>
        <p className="mt-1 text-sm text-muted">
          Predefined content formats. Open a category to browse and organise items.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {CATEGORIES.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.id}`}
            className="rounded-lg border border-border bg-surface p-5 transition-colors hover:border-accent/40 hover:bg-accent-soft/40"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-base font-semibold text-foreground">{category.name}</h2>
              <span className="rounded-md bg-sidebar px-2 py-0.5 text-xs font-medium text-muted">
                {category.itemCount} items
              </span>
            </div>
            <p className="mt-2 text-sm text-muted">{category.description}</p>
            <div className="mt-4 min-h-10 border-t border-border pt-3">
              {category.previewLabels.length > 0 ? (
                <ul className="space-y-1">
                  {category.previewLabels.map((label) => (
                    <li key={label} className="truncate text-xs text-muted">
                      {label}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted">No items yet</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

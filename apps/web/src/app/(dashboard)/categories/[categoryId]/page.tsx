import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { CategoryViewToggle } from "@/components/category-view-toggle";
import { CATEGORIES, getCategoryById } from "@/lib/categories";

const LINK_SOURCE_SECTIONS = ["LinkedIn", "YouTube", "X", "Websites", "Others"] as const;

type CategoryDetailPageProps = {
  params: Promise<{ categoryId: string }>;
};

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ categoryId: category.id }));
}

export default async function CategoryDetailPage({ params }: CategoryDetailPageProps) {
  const { categoryId } = await params;
  const category = getCategoryById(categoryId);

  if (!category) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-6">
        <Link href="/categories" className="text-sm text-muted hover:text-foreground">
          ← Categories
        </Link>
      </div>

      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{category.name}</h1>
          <p className="mt-1 text-sm text-muted">{category.description}</p>
        </div>
        <Suspense fallback={<div className="h-8 w-28 rounded-md border border-border bg-surface" />}>
          <CategoryViewToggle />
        </Suspense>
      </header>

      {category.id === "links" ? (
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
            Source sections
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {LINK_SOURCE_SECTIONS.map((section) => (
              <div
                key={section}
                className="rounded-lg border border-border bg-surface px-4 py-3"
              >
                <p className="text-sm font-medium text-foreground">{section}</p>
                <p className="mt-1 text-xs text-muted">0 items</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
          Items
        </h2>
        <div className="rounded-lg border border-dashed border-border bg-surface px-6 py-12 text-center">
          <p className="text-sm text-muted">
            No saved items in this category yet. Capture from the browser extension or upload
            into a folder.
          </p>
        </div>
      </section>
    </div>
  );
}

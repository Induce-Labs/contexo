export default function RecentsPage() {
  return (
    <div className="mx-auto w-full max-w-5xl">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Recents</h1>
        <p className="mt-1 text-sm text-muted">
          Recently saved items across categories. This is a view of existing items, not a
          separate copy.
        </p>
      </header>

      <div className="rounded-lg border border-dashed border-border bg-surface px-6 py-12 text-center">
        <p className="text-sm text-muted">No recent items yet.</p>
      </div>
    </div>
  );
}

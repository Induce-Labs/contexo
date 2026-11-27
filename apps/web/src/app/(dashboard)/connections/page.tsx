import { CONNECTION_PROVIDERS } from "@/lib/connections";

export default function ConnectionsPage() {
  return (
    <div className="mx-auto w-full max-w-5xl">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Connections</h1>
        <p className="mt-1 text-sm text-muted">
          Connect cloud and knowledge apps, then sync only the folders or files you choose.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {CONNECTION_PROVIDERS.map((provider) => (
          <div
            key={provider.id}
            className="rounded-lg border border-border bg-surface p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-base font-semibold text-foreground">{provider.name}</h2>
              <span className="rounded-md bg-sidebar px-2 py-0.5 text-xs font-medium text-muted">
                Not connected
              </span>
            </div>
            <p className="mt-2 text-sm text-muted">
              Sync selected content into Contexo. Disconnecting later keeps already-synced
              items.
            </p>
            <button
              type="button"
              className="mt-4 rounded-md bg-accent px-3 py-2 text-sm font-medium text-white"
              disabled
              title="Connection flow ships with provider integration work"
            >
              Connect
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

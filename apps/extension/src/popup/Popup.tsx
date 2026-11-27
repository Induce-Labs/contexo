import { useState } from "react";

import { checkApiHealth } from "../lib/api";

type Status = { kind: "idle" | "ok" | "error"; message: string };

export function Popup() {
  const [status, setStatus] = useState<Status>({ kind: "idle", message: "" });
  const [busy, setBusy] = useState(false);

  async function onSavePage() {
    setBusy(true);
    setStatus({ kind: "idle", message: "" });
    try {
      // Capture endpoints land with extension auth; for now verify API reachability.
      await checkApiHealth();
      setStatus({
        kind: "ok",
        message: "API reachable. Save capture ships with auth + capture endpoints.",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not reach the Contexo API";
      setStatus({ kind: "error", message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="popup">
      <h1 className="brand">Contexo</h1>
      <p className="hint">Save the current page. Organisation happens later in the dashboard.</p>
      <div className="actions">
        <button type="button" className="primary" disabled={busy} onClick={onSavePage}>
          {busy ? "Working…" : "Save page"}
        </button>
        <button type="button" className="secondary" disabled title="Selected-text capture next">
          Save selection
        </button>
      </div>
      <p className={`status ${status.kind === "idle" ? "" : status.kind}`}>{status.message}</p>
    </div>
  );
}

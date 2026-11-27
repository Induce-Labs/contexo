/** Phase 1 connected-app providers (P1-CONN-01). */

export type ConnectionProvider = {
  id: string;
  name: string;
  status: "not_connected" | "connected";
};

export const CONNECTION_PROVIDERS: ConnectionProvider[] = [
  { id: "google-drive", name: "Google Drive", status: "not_connected" },
  { id: "notion", name: "Notion", status: "not_connected" },
  { id: "dropbox", name: "Dropbox", status: "not_connected" },
  { id: "onedrive", name: "OneDrive", status: "not_connected" },
];

import { defineManifest } from "@crxjs/vite-plugin";

export default defineManifest({
  manifest_version: 3,
  name: "Contexo",
  description: "Save webpages and selected text to your Contexo space",
  version: "0.1.0",
  action: {
    default_popup: "src/popup/index.html",
    default_title: "Save to Contexo",
  },
  background: {
    service_worker: "src/background/service-worker.ts",
    type: "module",
  },
  permissions: ["activeTab", "storage"],
  host_permissions: ["http://localhost:8000/*"],
});

/**
 * Manifest V3 service worker.
 * Keep privileged credentials out of the extension; call FastAPI with a user session.
 */

chrome.runtime.onInstalled.addListener(() => {
  // Intentionally no secrets or broad host permissions here.
});

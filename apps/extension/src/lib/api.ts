const DEFAULT_API_BASE_URL = "http://localhost:8000/api/v1";

function getApiBaseUrl(): string {
  // Extension build can override via Vite env later; keep localhost for local Phase 1.
  return DEFAULT_API_BASE_URL;
}

export type HealthResponse = {
  status: string;
  service: string;
  environment: string;
};

export async function checkApiHealth(): Promise<HealthResponse> {
  const response = await fetch(`${getApiBaseUrl()}/health`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Health check failed with status ${response.status}`);
  }

  return (await response.json()) as HealthResponse;
}

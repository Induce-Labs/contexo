/**
 * Thin client for the Contexo FastAPI backend.
 * Browser calls should attach a Neon Auth JWT from authClient.getSession().
 */

const DEFAULT_API_BASE_URL = "http://localhost:8000/api/v1";

export function getApiBaseUrl(): string {
  const value = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!value) {
    return DEFAULT_API_BASE_URL;
  }
  return value.replace(/\/$/, "");
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details: Record<string, unknown>;

  constructor(
    message: string,
    opts: { status: number; code: string; details?: Record<string, unknown> },
  ) {
    super(message);
    this.name = "ApiError";
    this.status = opts.status;
    this.code = opts.code;
    this.details = opts.details ?? {};
  }
}

type ErrorPayload = {
  error?: {
    code?: string;
    message?: string;
    details?: Record<string, unknown>;
  };
};

export async function apiGet<T>(
  path: string,
  opts?: { accessToken?: string },
): Promise<T> {
  const url = `${getApiBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
  const headers: HeadersInit = { Accept: "application/json" };
  if (opts?.accessToken) {
    headers.Authorization = `Bearer ${opts.accessToken}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    let payload: ErrorPayload = {};
    try {
      payload = (await response.json()) as ErrorPayload;
    } catch {
      throw new ApiError(`API request failed with status ${response.status}`, {
        status: response.status,
        code: "http_error",
      });
    }

    throw new ApiError(payload.error?.message ?? "API request failed", {
      status: response.status,
      code: payload.error?.code ?? "http_error",
      details: payload.error?.details,
    });
  }

  return (await response.json()) as T;
}

export type HealthResponse = {
  status: string;
  service: string;
  environment: string;
};

export type MeResponse = {
  user_id: string;
  email: string | null;
  name: string | null;
};

export function fetchHealth(): Promise<HealthResponse> {
  return apiGet<HealthResponse>("/health");
}

export function fetchMe(accessToken: string): Promise<MeResponse> {
  return apiGet<MeResponse>("/me", { accessToken });
}

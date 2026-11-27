/**
 * Shared API contracts.
 * Keep these aligned with FastAPI response schemas; do not import backend internals.
 */

export type HealthResponse = {
  status: string;
  service: string;
  environment: string;
};

export type ApiErrorBody = {
  code: string;
  message: string;
  details?: Record<string, unknown>;
};

export type ApiErrorResponse = {
  error: ApiErrorBody;
};

export type MeResponse = {
  user_id: string;
  email: string | null;
  name: string | null;
};

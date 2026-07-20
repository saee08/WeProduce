import { NextResponse } from "next/server";

/**
 * Uniform envelope for every API response in the platform.
 * Keeping this consistent means the mobile client never has to
 * special-case a response shape per-endpoint.
 */
export interface ApiSuccessBody<T> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiErrorBody {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }

  static badRequest(message: string, details?: unknown) {
    return new ApiError(400, "BAD_REQUEST", message, details);
  }
  static unauthorized(message = "Unauthorized") {
    return new ApiError(401, "UNAUTHORIZED", message);
  }
  static forbidden(message = "Forbidden") {
    return new ApiError(403, "FORBIDDEN", message);
  }
  static notFound(message = "Resource not found") {
    return new ApiError(404, "NOT_FOUND", message);
  }
  static conflict(message: string, details?: unknown) {
    return new ApiError(409, "CONFLICT", message, details);
  }
  static internal(message = "Internal server error", details?: unknown) {
    return new ApiError(500, "INTERNAL_ERROR", message, details);
  }
}

export function ok<T>(data: T, meta?: Record<string, unknown>, status = 200) {
  const body: ApiSuccessBody<T> = { success: true, data, ...(meta ? { meta } : {}) };
  return NextResponse.json(body, { status });
}

export function fail(error: unknown) {
  if (error instanceof ApiError) {
    const body: ApiErrorBody = {
      success: false,
      error: { code: error.code, message: error.message, details: error.details },
    };
    return NextResponse.json(body, { status: error.statusCode });
  }

  // Unexpected error — never leak internals to the client.
  const body: ApiErrorBody = {
    success: false,
    error: { code: "INTERNAL_ERROR", message: "Something went wrong. Please try again." },
  };
  return NextResponse.json(body, { status: 500 });
}

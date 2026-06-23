import { getAuthToken } from "@/lib/auth-storage";

const DEFAULT_API_BASE_URL = "https://k3isonfire.ir/api/v1/";

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

export function getApiBaseUrl(): string {
  return normalizeBaseUrl(
    process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || DEFAULT_API_BASE_URL,
  );
}

function buildUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const cleanedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBaseUrl()}${cleanedPath}`;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

type ApiRequestOptions = Omit<RequestInit, "headers"> & {
  headers?: HeadersInit;
  auth?: boolean;
};

export async function apiRequest<T = unknown>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { auth = true, ...requestOptions } = options;
  const headers = new Headers(requestOptions.headers ?? {});
  const token = auth ? getAuthToken() : null;

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(buildUrl(path), {
    ...requestOptions,
    headers,
  });

  let payload: unknown = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message =
      payload &&
        typeof payload === "object" &&
        "message" in payload &&
        typeof (payload as { message?: unknown }).message === "string"
        ? (payload as { message: string }).message
        : `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status);
  }

  return payload as T;
}

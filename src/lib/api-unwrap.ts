export type ApiWrapper<T> = {
  message?: string;
  data?: T;
};

export type PaginatedResults<T> = {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results: T[];
};

export function unwrapData<T>(payload: ApiWrapper<T>): T {
  if (!payload.data) {
    throw new Error("Invalid API response");
  }
  return payload.data;
}

export function unwrapResults<T>(payload: ApiWrapper<PaginatedResults<T>>): T[] {
  const data = unwrapData(payload);
  return data.results ?? [];
}

/** Convert API pagination `next`/`previous` URLs to paths for `apiRequest`. */
export function pathFromApiPaginationUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const match = parsed.pathname.match(/\/api\/v1(\/.*)/);
    const path = match?.[1] ?? parsed.pathname;
    return `${path}${parsed.search}`;
  } catch {
    return url.startsWith("/") ? url : `/${url}`;
  }
}

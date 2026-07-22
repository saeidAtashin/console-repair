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

import { apiRequest } from "@/lib/api-client";
import {
  unwrapResults,
  type ApiWrapper,
  type PaginatedResults,
} from "@/lib/api-unwrap";

export type LocationItem = { id: number; name: string };

export async function fetchProvinces(): Promise<LocationItem[]> {
  const response = await apiRequest<
    ApiWrapper<PaginatedResults<LocationItem>>
  >("/locations/provinces/", { auth: false });
  return unwrapResults(response);
}

/** Backend path uses the misspelled `citites` segment. */
export async function fetchCities(provinceId: number): Promise<LocationItem[]> {
  const response = await apiRequest<
    ApiWrapper<PaginatedResults<LocationItem>>
  >(`/locations/provinces/${provinceId}/citites/`, { auth: false });
  return unwrapResults(response);
}

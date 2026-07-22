import { apiRequest } from "@/lib/api-client";
import {
  unwrapData,
  unwrapResults,
  type ApiWrapper,
  type PaginatedResults,
} from "@/lib/api-unwrap";

export type UserProfile = {
  phone_number: string;
  first_name: string;
  last_name: string;
};

export type UserAddress = {
  id: number;
  title: string;
  city: number | { id: number; name: string; province?: number | { id: number; name: string } };
  address_detail: string;
  postal_code: string;
  latitude: string;
  longitude: string;
};

export type UserAddressPayload = {
  title: string;
  city: number;
  address_detail: string;
  postal_code: string;
  latitude: string;
  longitude: string;
};

export async function fetchUserProfile(): Promise<UserProfile> {
  const response = await apiRequest<ApiWrapper<UserProfile>>("/user/profile/");
  return unwrapData(response);
}

export async function createUserProfile(payload: {
  first_name: string;
  last_name: string;
}): Promise<UserProfile> {
  const response = await apiRequest<ApiWrapper<UserProfile>>("/user/profile/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return unwrapData(response);
}

export async function updateUserProfile(payload: {
  first_name: string;
  last_name: string;
}): Promise<UserProfile> {
  const response = await apiRequest<ApiWrapper<UserProfile>>("/user/profile/", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return unwrapData(response);
}

export async function fetchUserAddresses(): Promise<UserAddress[]> {
  const response = await apiRequest<
    ApiWrapper<PaginatedResults<UserAddress> | UserAddress[]>
  >("/user/address/");

  if (Array.isArray(response.data)) {
    return response.data;
  }
  if (response.data && "results" in response.data) {
    return unwrapResults(
      response as ApiWrapper<PaginatedResults<UserAddress>>,
    );
  }
  return [];
}

export async function createUserAddress(
  payload: UserAddressPayload,
): Promise<UserAddress> {
  const response = await apiRequest<ApiWrapper<UserAddress>>("/user/address/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return unwrapData(response);
}

export async function updateUserAddress(
  id: number,
  payload: UserAddressPayload,
): Promise<UserAddress> {
  const response = await apiRequest<ApiWrapper<UserAddress>>(
    `/user/address/${id}/`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );
  return unwrapData(response);
}

export async function deleteUserAddress(id: number): Promise<void> {
  await apiRequest(`/user/address/${id}/`, { method: "DELETE" });
}

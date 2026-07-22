import { apiRequest } from "@/lib/api-client";
import {
  unwrapData,
  unwrapResults,
  type ApiWrapper,
  type PaginatedResults,
} from "@/lib/api-unwrap";
import { clearGuestUid, getOrCreateGuestUid } from "@/lib/guest-uid";
import { consoleIdFromGameInstallSlug } from "@/lib/repair-links";
import type { ConsoleId } from "@/lib/console-catalog";

export type InstallationDevice = { id: number; name: string };

export type InstallationGameRate = {
  id: number;
  source: string;
  rate: string;
};

export type InstallationGameDevice = { id: number; name: string };

export type InstallationGame = {
  id: number;
  name: string;
  size: number;
  price: number;
  image: string | null;
  device_type: InstallationGameDevice[];
  rates: InstallationGameRate[];
};

export type InstallationDraftItem = {
  id: number;
  game: {
    id: number;
    name: string;
    size: number;
  };
  price: number;
};

export type InstallationDraft = {
  id: number;
  guest_uid: string | null;
  device_type: InstallationGameDevice | null;
  total_price: number | null;
  admin_note: string | null;
  clear_guest_uid: boolean | null;
  items: InstallationDraftItem[];
  status: string;
};

export type AddInstallItemPayload = {
  game: number;
  device_type: number;
  guest_uid?: string;
};

export type AddInstallItemResult = {
  id: number;
  game: number;
  clear_guest_uid: boolean;
};

function normalizeDeviceName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/pes/g, "ps")
    .replace(/playstation/g, "ps");
}

/** Map install console slug → device family used for matching API device names. */
export function deviceFamilyFromConsoleSlug(consoleSlug: string): ConsoleId | null {
  return consoleIdFromGameInstallSlug(consoleSlug) ?? null;
}

export function matchInstallationDevice(
  devices: InstallationDevice[],
  consoleSlug: string,
): InstallationDevice | undefined {
  const family = deviceFamilyFromConsoleSlug(consoleSlug);
  if (!family) return undefined;

  const normalized = devices.map((d) => ({
    device: d,
    name: normalizeDeviceName(d.name),
  }));

  if (family === "xbox") {
    return normalized.find((d) => d.name.includes("xbox"))?.device;
  }

  if (family === "ps4") {
    return (
      normalized.find((d) => d.name.includes("ps4") || d.name === "pes4")
        ?.device ?? normalized.find((d) => /ps4|pes4/.test(d.name))?.device
    );
  }

  if (family === "ps5") {
    return (
      normalized.find((d) => d.name.includes("ps5") || d.name.includes("pes5"))
        ?.device
    );
  }

  return undefined;
}

export async function fetchInstallationDevices(): Promise<InstallationDevice[]> {
  const response = await apiRequest<
    ApiWrapper<PaginatedResults<InstallationDevice>>
  >("/installation/devices/", { auth: false });
  return unwrapResults(response);
}

export async function fetchInstallationGames(params?: {
  page?: number;
  pageSize?: number;
}): Promise<InstallationGame[]> {
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 100;
  const response = await apiRequest<
    ApiWrapper<PaginatedResults<InstallationGame>>
  >(`/installation/games/?page=${page}&page_size=${pageSize}`, {
    auth: false,
  });
  return unwrapResults(response);
}

export function filterGamesForDevice(
  games: InstallationGame[],
  deviceId: number,
): InstallationGame[] {
  return games.filter((game) =>
    game.device_type.some((d) => d.id === deviceId),
  );
}

function guestQuery(isLoggedIn: boolean): string {
  if (isLoggedIn) return "";
  const uid = getOrCreateGuestUid();
  return `&guest_uid=${encodeURIComponent(uid)}`;
}

export async function fetchInstallationDraft(options: {
  isLoggedIn: boolean;
  page?: number;
  pageSize?: number;
}): Promise<InstallationDraft | null> {
  const page = options.page ?? 1;
  const pageSize = options.pageSize ?? 100;
  const qs = `page=${page}&page_size=${pageSize}${guestQuery(options.isLoggedIn)}`;

  try {
    const response = await apiRequest<ApiWrapper<InstallationDraft>>(
      `/installation/requests/draft/?${qs}`,
      { auth: options.isLoggedIn },
    );
    return unwrapData(response);
  } catch {
    return null;
  }
}

export async function addInstallationItem(
  payload: AddInstallItemPayload,
  isLoggedIn: boolean,
): Promise<AddInstallItemResult> {
  const body: AddInstallItemPayload = {
    game: payload.game,
    device_type: payload.device_type,
  };

  if (!isLoggedIn) {
    body.guest_uid = payload.guest_uid ?? getOrCreateGuestUid();
  }

  const response = await apiRequest<ApiWrapper<AddInstallItemResult>>(
    "/installation/requests/items/",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      auth: isLoggedIn,
    },
  );

  const data = unwrapData(response);
  if (data.clear_guest_uid) {
    clearGuestUid();
  }
  return data;
}

export async function removeInstallationItem(
  itemId: number,
  isLoggedIn: boolean,
): Promise<void> {
  const body: { guest_uid?: string } = {};
  if (!isLoggedIn) {
    body.guest_uid = getOrCreateGuestUid();
  }

  await apiRequest(`/installation/requests/items/${itemId}/`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    auth: isLoggedIn,
  });
}

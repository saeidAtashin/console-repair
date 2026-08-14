import { apiRequest } from "@/lib/api-client";
import {
  unwrapData,
  unwrapResults,
  pathFromApiPaginationUrl,
  type ApiWrapper,
  type PaginatedResults,
} from "@/lib/api-unwrap";
import { clearGuestUid, getOrCreateGuestUid } from "@/lib/guest-uid";
import { INSTALLATION_CATALOG_PAGE_SIZE } from "@/lib/game-install-catalog";
import { consoleIdFromGameInstallSlug } from "@/lib/repair-links";
import type { ConsoleId } from "@/lib/console-catalog";

export type InstallationGamesPage = {
  games: InstallationGame[];
  hasNext: boolean;
  totalCount: number;
};

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

export const INSTALLATION_CATALOG_REVALIDATE = 300;

const publicCatalogFetch = { auth: false as const, next: { revalidate: INSTALLATION_CATALOG_REVALIDATE } };

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
  >("/installation/devices/", publicCatalogFetch);
  return unwrapResults(response);
}

export async function fetchInstallationGames(params?: {
  page?: number;
  pageSize?: number;
}): Promise<InstallationGame[]> {
  const page = await fetchInstallationGamesPage(
    params?.page ?? 1,
    params?.pageSize ?? INSTALLATION_CATALOG_PAGE_SIZE,
  );
  return page.games;
}

export async function fetchInstallationGamesPage(
  page = 1,
  pageSize = INSTALLATION_CATALOG_PAGE_SIZE,
): Promise<InstallationGamesPage> {
  const response = await apiRequest<
    ApiWrapper<PaginatedResults<InstallationGame>>
  >(catalogGamesPath(page, pageSize), publicCatalogFetch);
  const data = unwrapData(response);
  return {
    games: data.results ?? [],
    hasNext: Boolean(data.next),
    totalCount: data.count ?? 0,
  };
}

function catalogGamesPath(page: number, pageSize: number): string {
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });
  if (typeof window !== "undefined") {
    params.set("guest_uid", getOrCreateGuestUid());
  }
  return `/installation/games/?${params.toString()}`;
}

/** Fetch every page from `/installation/games/` (for draft catalog index). */
export async function fetchAllInstallationGames(
  pageSize = INSTALLATION_CATALOG_PAGE_SIZE,
): Promise<InstallationGame[]> {
  const games: InstallationGame[] = [];
  let path: string | null = catalogGamesPath(1, pageSize);

  while (path) {
    const response: ApiWrapper<PaginatedResults<InstallationGame>> =
      await apiRequest<ApiWrapper<PaginatedResults<InstallationGame>>>(
        path,
        publicCatalogFetch,
      );
    const data: PaginatedResults<InstallationGame> = unwrapData(response);
    games.push(...(data.results ?? []));
    path = data.next ? pathFromApiPaginationUrl(data.next) : null;
  }

  return games;
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
  const pageSize = options.pageSize ?? 20;
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

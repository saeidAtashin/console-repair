import {
  consoleCatalog,
  consoleIds,
  getRepairService,
  type ConsoleId,
} from "./console-catalog";

export const consoleRepairIcons: Record<ConsoleId, string> = {
  ps5: "/icons/ps5.svg",
  ps4: "/icons/ps4.svg",
  xbox: "/icons/xbox.svg",
};

export const REPAIR_DEVICE_GROUP_ORDER = [
  "ps5",
  "ps4",
  "xbox-series",
  "xbox-one",
  "controller",
  "other",
] as const;

export type RepairDeviceGroupId = (typeof REPAIR_DEVICE_GROUP_ORDER)[number];

export type RepairDeviceRef = { id: number; name: string };

export type RepairDeviceGroup = {
  id: RepairDeviceGroupId;
  label: string;
  icon: string;
  invert: boolean;
  devices: RepairDeviceRef[];
};

export const REPAIR_DEVICE_GROUP_META: Record<
  RepairDeviceGroupId,
  { label: string; icon: string; invert: boolean }
> = {
  ps5: { label: "PS5", icon: "/icons/ps5.svg", invert: true },
  ps4: { label: "PS4", icon: "/icons/ps4.svg", invert: true },
  "xbox-series": { label: "Xbox Series", icon: "/icons/xbox.svg", invert: true },
  "xbox-one": { label: "Xbox One", icon: "/icons/xbox.svg", invert: true },
  controller: {
    label: "دسته",
    icon: "/controller/controller1.webp",
    invert: false,
  },
  other: { label: "سایر کنسول", icon: "", invert: false },
};

function normalizeDeviceName(deviceName: string): string {
  return deviceName
    .toLowerCase()
    .replace(/[\s_-]+/g, "")
    .replace(/pes/g, "ps");
}

function isControllerDeviceName(key: string): boolean {
  return (
    key.includes("controller") ||
    key.includes("dualsense") ||
    key.includes("dualshock") ||
    key.includes("gamepad") ||
    key.includes("joycon") ||
    key.includes("دسته")
  );
}

/** Collapse API device names into the six repair-form cards. */
export function classifyRepairDevice(deviceName: string): RepairDeviceGroupId {
  const key = normalizeDeviceName(deviceName);

  if (isControllerDeviceName(key)) return "controller";
  if (key.includes("ps5") || key.includes("playstation5")) return "ps5";
  if (key.includes("ps4") || key.includes("playstation4")) return "ps4";

  if (key.includes("xbox")) {
    if (key.includes("360")) return "other";
    if (key.includes("one") && !key.includes("series")) return "xbox-one";
    return "xbox-series";
  }

  return "other";
}

export function isRepairDeviceGroupId(
  value: string,
): value is RepairDeviceGroupId {
  return (REPAIR_DEVICE_GROUP_ORDER as readonly string[]).includes(value);
}

export function groupRepairDevices(
  devices: RepairDeviceRef[],
): RepairDeviceGroup[] {
  const buckets = new Map<RepairDeviceGroupId, RepairDeviceRef[]>();

  for (const device of devices) {
    const id = classifyRepairDevice(device.name);
    const list = buckets.get(id) ?? [];
    list.push(device);
    buckets.set(id, list);
  }

  return REPAIR_DEVICE_GROUP_ORDER.flatMap((id) => {
    const grouped = buckets.get(id);
    if (!grouped?.length) return [];
    const meta = REPAIR_DEVICE_GROUP_META[id];
    return [
      {
        id,
        label: meta.label,
        icon: meta.icon,
        invert: meta.invert,
        devices: grouped,
      },
    ];
  });
}

export function repairDeviceHeaderVisual(
  deviceName: string,
): { src: string; invert: boolean } | null {
  const group = classifyRepairDevice(deviceName);
  if (group === "other") return null;
  const meta = REPAIR_DEVICE_GROUP_META[group];
  if (!meta.icon) return null;
  return { src: meta.icon, invert: meta.invert };
}

/** Map API device `name` (ps5, ps4, xbox1, xboxone, …) to a console id. */
export function consoleIdFromDeviceName(
  deviceName: string,
): ConsoleId | undefined {
  const key = normalizeDeviceName(deviceName);

  if (isControllerDeviceName(key)) return undefined;
  if (key.includes("ps5")) return "ps5";
  if (key.includes("ps4")) return "ps4";
  if (key.includes("xbox")) return "xbox";

  return undefined;
}

/** Map API device `name` (ps5, ps4, xbox1, xboxone, …) to the repair icon asset. */
export function getRepairDeviceIcon(deviceName: string): string {
  return (
    repairDeviceHeaderVisual(deviceName)?.src ?? consoleRepairIcons.xbox
  );
}

export function getRepairDeviceDisplayName(deviceName: string): string {
  const key = normalizeDeviceName(deviceName);
  const group = classifyRepairDevice(deviceName);

  if (group === "ps5") {
    if (key.includes("pro")) return "PS5 Pro";
    if (key.includes("slim")) return "PS5 Slim";
    return "PS5";
  }

  if (group === "ps4") {
    if (key.includes("pro")) return "PS4 Pro";
    if (key.includes("slim")) return "PS4 Slim";
    return "PS4";
  }

  if (group === "xbox-series") {
    if (key.includes("seriesx")) return "Xbox Series X";
    if (key.includes("seriess")) return "Xbox Series S";
    if (key === "xbox" || key === "xbox1" || key === "xboxseries") {
      return "Xbox Series";
    }
    return deviceName;
  }

  if (group === "xbox-one") {
    if (key === "xboxone") return "Xbox One";
    return deviceName;
  }

  if (key.includes("xbox")) return "Xbox";

  return deviceName;
}

export function isConsoleId(value: string): value is ConsoleId {
  return (consoleIds as string[]).includes(value);
}

export function consoleIdFromRepairSlug(slug: string): ConsoleId | undefined {
  return consoleIds.find((id) => consoleCatalog[id].repairSlug === slug);
}

export function consoleIdFromIssueSlug(slug: string): ConsoleId | undefined {
  if (slug.startsWith("ps5") || slug.includes("dualsense")) return "ps5";
  if (slug.startsWith("ps4") || slug.includes("dualshock")) return "ps4";
  if (slug.startsWith("xbox")) return "xbox";
  return undefined;
}

export function consoleIdFromGameInstallSlug(
  slug: string,
): ConsoleId | undefined {
  if (slug === "ps5" || slug === "ps4") return slug;
  if (slug === "xbox-one" || slug === "xbox-series") return "xbox";
  return undefined;
}

export type RepairPrefill = {
  consoleId?: ConsoleId;
  issue?: string;
  description?: string;
  deviceGroup?: RepairDeviceGroupId;
};

/** Canonical URL for SEO — strips one-off prefill params. */
export function buildRepairCanonicalPath(prefill?: RepairPrefill): string {
  if (prefill?.consoleId) {
    return `/repair?console=${prefill.consoleId}`;
  }
  return "/repair";
}

export function buildRepairHref(prefill?: RepairPrefill): string {
  if (!prefill?.consoleId && !prefill?.issue && !prefill?.description) {
    return "/repair";
  }

  const params = new URLSearchParams();
  if (prefill.consoleId) params.set("console", prefill.consoleId);
  if (prefill.issue) params.set("issue", prefill.issue);
  if (prefill.description) params.set("description", prefill.description);

  return `/repair?${params.toString()}`;
}

export function parseRepairSearchParams(
  searchParams: URLSearchParams,
): RepairPrefill {
  const consoleParam = searchParams.get("console")?.trim() ?? "";
  const consoleId = isConsoleId(consoleParam) ? consoleParam : undefined;
  const deviceParam = searchParams.get("device")?.trim() ?? "";

  return {
    consoleId,
    issue: searchParams.get("issue")?.trim() || undefined,
    description: searchParams.get("description")?.trim() || undefined,
    deviceGroup: isRepairDeviceGroupId(deviceParam) ? deviceParam : undefined,
  };
}

export function gameInstallHrefForConsole(consoleId?: ConsoleId): string {
  if (!consoleId) return "/services/game-install";
  const slug = consoleCatalog[consoleId].gameInstallSlugs[0]?.slug;
  return slug ? `/services/game-install/${slug}` : "/services/game-install";
}

export function getRepairDeviceLabel(consoleId: ConsoleId): string {
  return (
    getRepairService(consoleId)?.title ??
    `تعمیر ${consoleCatalog[consoleId].title}`
  );
}

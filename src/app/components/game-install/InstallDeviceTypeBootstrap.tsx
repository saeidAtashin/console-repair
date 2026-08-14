"use client";

import { useEffect } from "react";

import { cacheDeviceTypeId } from "@/lib/game-install-list";

type Props = {
  consoleSlug: string;
  deviceTypeId: number | null;
};

/** Cache server-resolved device type id to skip an extra devices API call on add. */
export default function InstallDeviceTypeBootstrap({
  consoleSlug,
  deviceTypeId,
}: Props) {
  useEffect(() => {
    if (deviceTypeId != null) {
      cacheDeviceTypeId(consoleSlug, deviceTypeId);
    }
  }, [consoleSlug, deviceTypeId]);

  return null;
}

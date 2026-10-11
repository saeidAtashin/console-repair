"use client";

import Image from "next/image";
import { useMemo } from "react";
import { Boxes } from "lucide-react";

import FormField from "../components/ui/form/FormField";
import { getRepairDeviceDisplayName, groupRepairDevices } from "../../lib/repair-links";
import type { BrandTheme } from "@/lib/brand-theme";
import type { RepairDevice } from "@/lib/repair/api";
import { cn } from "../../lib/utils";

type Props = {
  devices: RepairDevice[];
  value: number | "";
  onChange: (id: number) => void;
  loading?: boolean;
  error?: string | null;
  theme: BrandTheme;
};

export default function RepairDevicePicker({
  devices,
  value,
  onChange,
  loading = false,
  error,
  theme,
}: Props) {
  const groups = useMemo(() => groupRepairDevices(devices), [devices]);
  const activeGroup = groups.find((group) =>
    group.devices.some((device) => device.id === value),
  );
  const selected = devices.find((device) => device.id === value);
  const selectedModel = selected
    ? getRepairDeviceDisplayName(selected.name)
    : null;
  const statusLabel = activeGroup
    ? selectedModel && selectedModel !== activeGroup.label
      ? `${activeGroup.label} · ${selectedModel}`
      : activeGroup.label
    : null;

  return (
    <FormField
      label="نوع دستگاه ( اختیاری )"
      htmlFor="repair-device"
      error={error}
      className="relative mx-auto mt-5 w-full max-w-2xl"
      labelClassName="text-center text-sm font-medium"
      errorClassName="text-center text-sm"
    >
      <p className="mb-3 text-center text-sm text-zinc-400">
        {loading
          ? "در حال بارگذاری دستگاه‌ها..."
          : statusLabel
            ? statusLabel
            : "دستگاه خود را انتخاب کنید"}
      </p>
      <div
        id="repair-device"
        role="radiogroup"
        aria-label="نوع دستگاه"
        aria-invalid={!!error}
        aria-describedby={error ? "repair-device-error" : undefined}
        className="grid grid-cols-2 gap-3 sm:grid-cols-3"
      >
        {groups.map((group) => {
          const active = activeGroup?.id === group.id;

          return (
            <button
              key={group.id}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={group.label}
              disabled={loading}
              onClick={() => {
                const next = group.devices[0];
                if (next) onChange(next.id);
              }}
              className={cn(
                "group relative flex flex-col items-center gap-2 overflow-hidden rounded-2xl border px-2 py-4 backdrop-blur-md transition-[color,box-shadow,border-color] duration-300 disabled:cursor-not-allowed disabled:opacity-50",
                active
                  ? cn(
                      theme.border,
                      theme.bg,
                      theme.primary,
                      "shadow-[0_0_28px_rgba(34,211,238,0.2)]",
                    )
                  : cn(
                      "border-white/15 bg-black/40 text-zinc-300 hover:text-zinc-100",
                      theme.borderHover,
                    ),
              )}
            >
              {active && (
                <span
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute inset-0 rounded-2xl border shadow-[inset_0_0_24px_rgba(34,211,238,0.1)]",
                    theme.border,
                    theme.bg,
                  )}
                />
              )}
              {group.id === "other" || !group.icon ? (
                <Boxes
                  className="relative z-10 h-12 w-12 sm:h-14 sm:w-14"
                  aria-hidden
                />
              ) : (
                <Image
                  src={group.icon}
                  alt=""
                  width={48}
                  height={48}
                  className={cn(
                    "relative z-10 h-16 w-16 object-contain transition-all duration-300 sm:h-20 sm:w-20",
                    group.invert && "invert",
                    active ? "opacity-100" : "opacity-75 group-hover:opacity-95",
                  )}
                />
              )}
              <span className="relative z-10 text-center text-xs font-bold leading-tight sm:text-sm">
                {group.label}
              </span>
            </button>
          );
        })}
      </div>

      {activeGroup && activeGroup.devices.length > 1 ? (
        activeGroup.devices.length > 8 ? (
          <label className="mx-auto mt-3 block max-w-sm text-center text-xs text-zinc-400">
            مدل دقیق
            <select
              value={value === "" ? "" : String(value)}
              onChange={(event) => onChange(Number(event.target.value))}
              aria-label={`مدل ${activeGroup.label}`}
              className="mt-2 h-11 w-full rounded-2xl border border-white/15 bg-black/50 px-3 text-sm font-bold text-white"
            >
              {activeGroup.devices.map((device) => (
                <option key={device.id} value={device.id}>
                  {getRepairDeviceDisplayName(device.name)}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <div
            className="mt-3 flex flex-wrap justify-center gap-2"
            role="radiogroup"
            aria-label={`مدل ${activeGroup.label}`}
          >
            {activeGroup.devices.map((device) => {
              const active = value === device.id;
              const label = getRepairDeviceDisplayName(device.name);
              return (
                <button
                  key={device.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => onChange(device.id)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-bold transition",
                    active
                      ? cn(theme.border, theme.bg, theme.primary)
                      : "border-white/15 bg-black/40 text-zinc-300 hover:text-white",
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )
      ) : null}
    </FormField>
  );
}

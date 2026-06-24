"use client";

import Image from "next/image";

import FormField from "../components/ui/form/FormField";
import {
  getRepairDeviceDisplayName,
  getRepairDeviceIcon,
} from "../../lib/repair-links";
import type { RepairDevice } from "@/lib/repair/api";
import { cn } from "../../lib/utils";

type Props = {
  devices: RepairDevice[];
  value: number | "";
  onChange: (id: number) => void;
  loading?: boolean;
  error?: string | null;
};

export default function RepairDevicePicker({
  devices,
  value,
  onChange,
  loading = false,
  error,
}: Props) {
  const selected = devices.find((device) => device.id === value);

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
          : selected
            ? getRepairDeviceDisplayName(selected.name)
            : "دستگاه خود را انتخاب کنید"}
      </p>
      <div
        id="repair-device"
        role="radiogroup"
        aria-label="نوع دستگاه"
        aria-invalid={!!error}
        aria-describedby={error ? "repair-device-error" : undefined}
        className="grid grid-cols-2 gap-3 sm:grid-cols-4"
      >
        {devices.map((device) => {
          const active = value === device.id;
          const label = getRepairDeviceDisplayName(device.name);
          const icon = getRepairDeviceIcon(device.name);

          return (
            <button
              key={device.id}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={label}
              disabled={loading}
              onClick={() => onChange(device.id)}
              className={cn(
                "group relative flex flex-col items-center gap-2 overflow-hidden rounded-2xl border px-2 py-4 backdrop-blur-md transition-[color,box-shadow,border-color] duration-300 disabled:cursor-not-allowed disabled:opacity-50",
                active
                  ? "border-cyan-400/50 bg-cyan-500/15 text-cyan-100 shadow-[0_0_28px_rgba(34,211,238,0.35)]"
                  : "border-white/15 bg-black/40 text-zinc-300 hover:border-cyan-400/35 hover:text-zinc-100 hover:shadow-[0_0_18px_rgba(34,211,238,0.12)]",
              )}
            >
              {active && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-2xl border border-cyan-400/55 bg-cyan-500/20 shadow-[inset_0_0_24px_rgba(34,211,238,0.15)]"
                />
              )}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.22),transparent_65%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
              <Image
                src={icon}
                alt=""
                width={48}
                height={48}
                className={cn(
                  "relative z-10 h-16 w-16 object-contain invert transition-all duration-300 sm:h-20 sm:w-20",
                  active
                    ? "drop-shadow-[0_0_12px_rgba(34,211,238,0.45)]"
                    : "opacity-75 group-hover:opacity-95",
                )}
              />
              <span className="relative z-10 text-center text-xs font-bold leading-tight sm:text-sm">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </FormField>
  );
}

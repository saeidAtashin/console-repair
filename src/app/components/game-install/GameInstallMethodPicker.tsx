"use client";

import { cn } from "@/lib/utils";
import {
  getInstallMethodsForConsole,
  type InstallMethodId,
} from "@/lib/game-install-quote";
import { useInstallMethod } from "@/app/hooks/useInstallMethod";

type Props = {
  consoleSlug: string;
  className?: string;
};

export default function GameInstallMethodPicker({
  consoleSlug,
  className = "",
}: Props) {
  const methods = getInstallMethodsForConsole(consoleSlug);
  const [methodId, setMethodId] = useInstallMethod(consoleSlug);

  if (methods.length <= 1) {
    return (
      <div className={cn("rounded-xl border border-white/10 bg-black/20 px-4 py-3", className)}>
        <p className="text-xs text-zinc-500">روش نصب</p>
        <p className="mt-1 text-sm font-bold text-zinc-200">{methods[0]?.label}</p>
      </div>
    );
  }

  return (
    <fieldset className={cn("space-y-3", className)}>
      <legend className="text-sm font-bold text-zinc-200">روش نصب</legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {methods.map((method) => {
          const active = methodId === method.id;
          return (
            <label
              key={method.id}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition ${
                active
                  ? "border-cyan-400/50 bg-cyan-500/15"
                  : "border-white/10 bg-black/20 hover:border-white/20"
              }`}
            >
              <input
                type="radio"
                name={`install-method-${consoleSlug}`}
                value={method.id}
                checked={active}
                onChange={() => setMethodId(method.id as InstallMethodId)}
                className="mt-1 accent-cyan-400"
              />
              <span className="text-sm font-medium leading-6 text-zinc-100">
                {method.label}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

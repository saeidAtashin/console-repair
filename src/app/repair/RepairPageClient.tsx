"use client";

import { useCallback, useMemo, useState } from "react";

import type { ConsoleId } from "@/lib/console-catalog";
import { getThemeForConsole } from "@/lib/brand-theme";
import type { RepairPrefill } from "@/lib/repair-links";
import RepairPageBackground from "./RepairPageBackground";
import { RepairThemeProvider } from "./RepairThemeContext";
import RepairFormClient from "./RepairFormClient";
import RepairPageContent from "./RepairPageContent";

type Props = {
  initialPrefill: RepairPrefill;
  initialConsoleId?: ConsoleId;
};

export default function RepairPageClient({
  initialPrefill,
  initialConsoleId,
}: Props) {
  const [activeConsoleId, setActiveConsoleId] = useState<ConsoleId | undefined>(
    initialPrefill.consoleId ?? initialConsoleId,
  );

  const theme = useMemo(
    () => getThemeForConsole(activeConsoleId),
    [activeConsoleId],
  );

  const handleConsoleChange = useCallback((consoleId: ConsoleId | undefined) => {
    setActiveConsoleId(consoleId);
  }, []);

  const contentConsoleId = activeConsoleId ?? initialConsoleId;

  return (
    <RepairThemeProvider theme={theme}>
      <div className="relative isolate overflow-hidden">
        <RepairPageBackground />
        <div className="relative z-10">
          <RepairFormClient
            initialPrefill={initialPrefill}
            theme={theme}
            onConsoleChange={handleConsoleChange}
          />
          <RepairPageContent consoleId={contentConsoleId} />
        </div>
      </div>
    </RepairThemeProvider>
  );
}

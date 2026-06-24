"use client";

import { createContext, useContext } from "react";

import { brandThemes, type BrandTheme } from "@/lib/brand-theme";

const RepairThemeContext = createContext<BrandTheme>(brandThemes.gaming);

export function RepairThemeProvider({
  theme,
  children,
}: {
  theme: BrandTheme;
  children: React.ReactNode;
}) {
  return (
    <RepairThemeContext.Provider value={theme}>
      {children}
    </RepairThemeContext.Provider>
  );
}

export function useRepairTheme() {
  return useContext(RepairThemeContext);
}

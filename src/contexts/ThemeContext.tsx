import { createContext, useContext } from "react";

export type SiteTheme = "classico" | "mare" | "baoba";

interface ThemeContextValue {
  theme: SiteTheme;
  setTheme: (theme: SiteTheme) => void;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function useSiteTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useSiteTheme must be used within ThemeProvider");
  return context;
}
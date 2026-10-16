import { useEffect, useState, type ReactNode } from "react";
import { ThemeContext, type SiteTheme } from "@/contexts/ThemeContext";

const THEME_STORAGE_KEY = "servicoja-theme";

function getStoredTheme(): SiteTheme {
  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  return storedTheme === "mare" || storedTheme === "baoba" ? storedTheme : "classico";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<SiteTheme>(getStoredTheme);

  useEffect(() => {
    if (theme === "classico") {
      delete document.documentElement.dataset.theme;
    } else {
      document.documentElement.dataset.theme = theme;
    }
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}
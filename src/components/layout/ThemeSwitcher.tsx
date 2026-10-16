import { Palette } from "lucide-react";
import { useSiteTheme, type SiteTheme } from "@/contexts/ThemeContext";

const themes: { value: SiteTheme; label: string }[] = [
  { value: "classico", label: "Clássico" },
  { value: "mare", label: "Maré" },
  { value: "baoba", label: "Baobá" },
];

export function ThemeSwitcher({ fullWidth = false }: { fullWidth?: boolean }) {
  const { theme, setTheme } = useSiteTheme();

  return (
    <label className={`inline-flex items-center gap-2 ${fullWidth ? "w-full" : ""}`}>
      <Palette className="w-4 h-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      <span className="sr-only">Tema de cores</span>
      <select
        aria-label="Tema de cores"
        value={theme}
        onChange={(event) => setTheme(event.target.value as SiteTheme)}
        className={`h-10 rounded-md border border-border bg-background px-2 text-sm font-medium text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring ${fullWidth ? "flex-1" : "max-w-28"}`}
      >
        {themes.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}
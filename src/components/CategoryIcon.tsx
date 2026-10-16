import {
  Briefcase,
  Hammer,
  Scissors,
  Shapes,
  Tv,
  Wrench,
  Zap,
} from "lucide-react";

const legacyIconValues: Record<string, string> = {
  "\u26A1": "zap",
  "\u{1F527}": "wrench",
  "\u{1F9F1}": "hammer",
  "\u{1F4FA}": "tv",
  "\u{1F487}": "scissors",
};

const categoryIcons = {
  zap: Zap,
  wrench: Wrench,
  hammer: Hammer,
  tv: Tv,
  scissors: Scissors,
  briefcase: Briefcase,
} as const;

export const categoryIconOptions = [
  { value: "zap", label: "Eletricidade" },
  { value: "wrench", label: "Canalização" },
  { value: "hammer", label: "Construção" },
  { value: "tv", label: "Tecnologia" },
  { value: "scissors", label: "Beleza" },
  { value: "briefcase", label: "Outros serviços" },
];

export function getCategoryIconValue(icon?: string | null) {
  if (!icon) return "briefcase";
  return legacyIconValues[icon] || (Object.prototype.hasOwnProperty.call(categoryIcons, icon) ? icon : "briefcase");
}

export function CategoryIcon({
  icon,
  className = "w-5 h-5",
}: {
  icon?: string | null;
  className?: string;
}) {
  const iconValue = getCategoryIconValue(icon);
  const Icon = categoryIcons[iconValue as keyof typeof categoryIcons] || Shapes;
  return <Icon className={className} aria-hidden="true" />;
}
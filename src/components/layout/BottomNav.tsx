import { Home, Search, FileText, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const items = [
  { to: "/", icon: Home, label: "Início" },
  { to: "/services", icon: Search, label: "Serviços" },
  { to: "/meus-pedidos", icon: FileText, label: "Pedidos" },
  { to: "/auth", icon: User, label: "Perfil" },
];

export function BottomNav() {
  const { user, profile } = useAuth();
  const profileTo = user
    ? profile?.user_type === "provider"
      ? "/painel"
      : "/meus-pedidos"
    : "/auth";

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border shadow-[0_-4px_12px_rgba(0,0,0,0.05)] pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-4">
        {items.map((item, idx) => {
          const to = idx === 3 ? profileTo : item.to;
          return (
            <NavLink
              key={item.label}
              to={to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center gap-1 py-2.5 text-xs font-medium transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

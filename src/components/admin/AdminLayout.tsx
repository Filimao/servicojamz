import { ReactNode, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { Button } from "@/components/ui/button";
import { LogOut, Home, Loader2, ShieldAlert } from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isAdmin, isLoading, isAdminLoading, adminCheckError, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth", { replace: true });
    }
  }, [user, isAdmin, isLoading, isAdminLoading, adminCheckError, navigate]);

  if (isLoading || isAdminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" aria-label="A verificar acesso administrativo" />
      </div>
    );
  }

  if (adminCheckError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="max-w-md text-center">
          <ShieldAlert className="w-10 h-10 text-warning mx-auto mb-4" />
          <h1 className="text-xl font-semibold mb-2">Não foi possível verificar o acesso</h1>
          <p className="text-muted-foreground mb-5">A sessão pode ter expirado. Entre novamente e tente abrir o painel.</p>
          <Button onClick={async () => { await signOut(); navigate("/auth", { replace: true }); }}>
            <LogOut className="w-4 h-4 mr-2" />
            Sair e entrar novamente
          </Button>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="max-w-md text-center">
          <ShieldAlert className="w-10 h-10 text-warning mx-auto mb-4" />
          <h1 className="text-xl font-semibold mb-2">Esta conta não tem acesso administrativo</h1>
          <p className="text-muted-foreground mb-2">Conta atual: {user?.email || "não autenticada"}</p>
          <p className="text-muted-foreground mb-5">O acesso depende do papel admin atribuído no Supabase.</p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" asChild>
              <Link to="/"><Home className="w-4 h-4 mr-2" />Voltar ao site</Link>
            </Button>
            <Button onClick={async () => { await signOut(); navigate("/auth", { replace: true }); }}>
              <LogOut className="w-4 h-4 mr-2" />Sair
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          {/* Top bar */}
          <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
            <h1 className="text-lg font-semibold text-foreground">
              Painel Administrativo
            </h1>
            <div className="flex items-center gap-3">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <Home className="w-4 h-4 mr-2" />
                  Ir para o site
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
